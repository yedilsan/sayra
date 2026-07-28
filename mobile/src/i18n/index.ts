import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { Lang } from '@/types';

import en from './locales/en.json';
import ja from './locales/ja.json';
import kz from './locales/kz.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGS: Lang[] = ['EN', 'RU', 'KZ', 'JA'];

const LOCALE_BY_LANG: Record<Lang, string> = {
  EN: 'en',
  RU: 'ru',
  KZ: 'kz',
  JA: 'ja',
};

const LANG_BY_LOCALE: Record<string, Lang> = {
  en: 'EN',
  ru: 'RU',
  kz: 'KZ',
  kk: 'KZ',
  ja: 'JA',
};

export function langToLocale(lang: Lang): string {
  return LOCALE_BY_LANG[lang];
}

export function detectDeviceLang(): Lang {
  const deviceLocales = Localization.getLocales();
  for (const locale of deviceLocales) {
    const match = LANG_BY_LOCALE[locale.languageCode?.toLowerCase() ?? ''];
    if (match) {
      return match;
    }
  }
  return 'EN';
}

void i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kz: { translation: kz },
    ja: { translation: ja },
  },
  lng: langToLocale(detectDeviceLang()),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setAppLanguage(lang: Lang) {
  void i18next.changeLanguage(langToLocale(lang));
}

export default i18next;
