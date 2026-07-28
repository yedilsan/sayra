import { isAxiosError } from 'axios';

/** Mirrors the backend's `@MinLength(8)` on RegisterDto.password. */
export const PASSWORD_MIN_LENGTH = 8;

export type AuthField = 'name' | 'email' | 'password';
export type FieldErrors = Partial<Record<AuthField, string>>;

// Deliberately permissive — the backend's class-validator @IsEmail is authoritative.
// This only catches obviously-malformed input before a round trip.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

interface ValidateInput {
  mode: 'login' | 'signup';
  name: string;
  email: string;
  password: string;
  t: (key: string) => string;
}

/** Client-side checks, matched to the backend's DTO constraints. */
export function validateAuthForm({ mode, name, email, password, t }: ValidateInput): FieldErrors {
  const errors: FieldErrors = {};

  if (mode === 'signup' && !name.trim()) {
    errors.name = t('auth.errorNameRequired');
  }

  if (!email.trim()) {
    errors.email = t('auth.errorEmailRequired');
  } else if (!isValidEmail(email)) {
    errors.email = t('auth.errorEmailInvalid');
  }

  if (!password) {
    errors.password = t('auth.errorPasswordRequired');
  } else if (mode === 'signup' && password.length < PASSWORD_MIN_LENGTH) {
    // Only enforced on signup — an existing account may predate the rule, and the
    // server decides whether the credentials are valid.
    errors.password = t('auth.errorPasswordShort');
  }

  return errors;
}

/** Routes a class-validator message like "password must be longer..." to its field. */
function fieldForMessage(message: string): AuthField | null {
  const lower = message.toLowerCase();
  if (lower.startsWith('email')) return 'email';
  if (lower.startsWith('password')) return 'password';
  if (lower.startsWith('name')) return 'name';
  return null;
}

export interface MappedAuthError {
  fieldErrors: FieldErrors;
  formError: string | null;
}

/**
 * Maps a failed auth request onto per-field and form-level messages.
 *
 * Codes verified against this backend: duplicate email is 409 (ConflictException) and bad
 * credentials are 401 (UnauthorizedException) — not the 403s some Nest tutorials use.
 * 403 is still handled so a backend change doesn't silently degrade to a generic message.
 */
export function mapAuthError(error: unknown, t: (key: string) => string): MappedAuthError {
  if (!isAxiosError(error)) {
    return { fieldErrors: {}, formError: t('common.somethingWentWrong') };
  }

  // No response at all — DNS failure, wrong LAN IP, server down, timeout.
  if (!error.response) {
    return { fieldErrors: {}, formError: t('auth.errorNetwork') };
  }

  const { status, data } = error.response;
  const raw = (data as { message?: string | string[] } | undefined)?.message;
  const messages = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const joined = messages.join(' ').toLowerCase();

  if (status === 400) {
    const fieldErrors: FieldErrors = {};
    for (const message of messages) {
      const field = fieldForMessage(message);
      // Keep the first message per field so the inline error stays short.
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = message;
      }
    }
    return Object.keys(fieldErrors).length > 0
      ? { fieldErrors, formError: null }
      : { fieldErrors: {}, formError: t('common.somethingWentWrong') };
  }

  if (status === 409 || (status === 403 && joined.includes('taken'))) {
    return { fieldErrors: { email: t('auth.errorEmailRegistered') }, formError: null };
  }

  if (status === 401 || status === 403) {
    return { fieldErrors: {}, formError: t('auth.errorIncorrect') };
  }

  if (status >= 500) {
    return { fieldErrors: {}, formError: t('auth.errorNetwork') };
  }

  return { fieldErrors: {}, formError: t('common.somethingWentWrong') };
}
