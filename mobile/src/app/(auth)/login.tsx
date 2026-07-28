import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as authApi from '@/api/auth';
import { Button } from '@/components/Button';
import { SegmentedControl } from '@/components/SegmentedControl';
import { TextField } from '@/components/TextField';
import { useAuthStore } from '@/store/auth-store';
import { useLanguageStore } from '@/store/language-store';
import { colors, fontFamily, fontSize, radii, spacing, textStyle } from '@/theme';
import {
  type AuthField,
  type FieldErrors,
  mapAuthError,
  validateAuthForm,
} from '@/utils/auth-errors';

type AuthMode = 'login' | 'signup';

export default function LoginScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const setSession = useAuthStore((state) => state.setSession);
  const preferredLang = useLanguageStore((state) => state.preferredLang);

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Clearing as the user types keeps a stale error from lingering on a fixed field. */
  function clearFieldError(field: AuthField) {
    setFormError(null);
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleChangeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setFieldErrors({});
    setFormError(null);
  }

  async function handleSubmit() {
    const errors = validateAuthForm({ mode, name, email, password, t });
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response =
        mode === 'signup'
          ? await authApi.register({
              email: email.trim(),
              password,
              name: name.trim(),
              // Seed the account with the language picked before sign-up.
              ...(preferredLang ? { language: preferredLang } : {}),
            })
          : await authApi.login({ email: email.trim(), password });

      // Setting the session authenticates immediately; the root gate then routes a brand
      // new account to Add Child, since it has no children yet.
      const { user, ...tokens } = response;
      setSession(user, tokens);
    } catch (err) {
      const mapped = mapAuthError(err, t);
      setFieldErrors(mapped.fieldErrors);
      setFormError(mapped.formError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', default: undefined })}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.huge, paddingBottom: insets.bottom + spacing.huge },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={colors.gradient} style={styles.logo}>
          <Text style={styles.logoText}>Ra</Text>
        </LinearGradient>

        <Text style={styles.appName}>{t('app.name')}</Text>
        <Text style={styles.tagline}>{t('app.tagline')}</Text>

        <View style={styles.segmented}>
          <SegmentedControl
            value={mode}
            onChange={handleChangeMode}
            options={[
              { label: t('auth.logIn'), value: 'login' },
              { label: t('auth.signUp'), value: 'signup' },
            ]}
          />
        </View>

        <View style={styles.form}>
          {mode === 'signup' ? (
            <TextField
              value={name}
              onChangeText={(value) => {
                setName(value);
                clearFieldError('name');
              }}
              placeholder={t('auth.parentName')}
              autoCapitalize="words"
              autoComplete="name"
              error={fieldErrors.name}
              editable={!loading}
            />
          ) : null}

          <TextField
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              clearFieldError('email');
            }}
            placeholder={t('auth.email')}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            error={fieldErrors.email}
            editable={!loading}
          />

          <TextField
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              clearFieldError('password');
            }}
            placeholder={t('auth.password')}
            secureTextEntry
            autoComplete={mode === 'signup' ? 'new-password' : 'password'}
            error={fieldErrors.password}
            editable={!loading}
          />

          {formError ? (
            <Text style={styles.formError} accessibilityLiveRegion="polite">
              {formError}
            </Text>
          ) : null}

          <Button
            label={mode === 'signup' ? t('auth.submitSignUp') : t('auth.submitLogIn')}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submit}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchPrompt}>
            {mode === 'login' ? t('auth.noAccountPrompt') : t('auth.hasAccountPrompt')}{' '}
          </Text>
          <Text
            style={styles.switchLink}
            onPress={() => !loading && handleChangeMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? t('auth.signUp') : t('auth.logIn')}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.formX,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radii.huge,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoText: {
    ...textStyle('black', fontSize['5xl']),
    color: colors.white,
  },
  appName: {
    ...textStyle('black', fontSize['7xl']),
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  tagline: {
    ...textStyle('semiBold', fontSize.lg),
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.huge,
  },
  segmented: {
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
  submit: {
    marginTop: spacing.xs,
  },
  formError: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.error,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.huge,
  },
  switchPrompt: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  switchLink: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.tabs.aac,
  },
});
