import type { Lang } from '@/types';

const LANG_SUFFIX: Record<Lang, string> = {
  RU: 'Ru',
  KZ: 'Kz',
  JA: 'Ja',
  EN: 'En',
};

const FALLBACK_ORDER: Lang[] = ['EN', 'RU', 'KZ', 'JA'];

/**
 * Reads a `{field}{Lang}` column (e.g. `nameRu`/`nameEn`) off a record, preferring `lang`,
 * then falling back through EN/RU/KZ/JA since every language field is optional server-side.
 */
export function pickLocalized(record: object, field: string, lang: Lang): string {
  const values = record as Record<string, unknown>;

  const preferred = values[`${field}${LANG_SUFFIX[lang]}`];
  if (typeof preferred === 'string' && preferred.length > 0) {
    return preferred;
  }

  for (const fallbackLang of FALLBACK_ORDER) {
    const value = values[`${field}${LANG_SUFFIX[fallbackLang]}`];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return '';
}
