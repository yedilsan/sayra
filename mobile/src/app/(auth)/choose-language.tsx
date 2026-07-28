import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { setAppLanguage, SUPPORTED_LANGS } from '@/i18n';
import { useLanguageStore } from '@/store/language-store';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';
import type { Lang } from '@/types';

/**
 * Each option is labelled in its own language — the whole point of this screen is that
 * the user can't necessarily read the current one.
 */
const LANG_LABELS: Record<Lang, { native: string; english: string }> = {
  RU: { native: 'Русский', english: 'Russian' },
  KZ: { native: 'Қазақша', english: 'Kazakh' },
  JA: { native: '日本語', english: 'Japanese' },
  EN: { native: 'English', english: 'English' },
};

const LANG_ACCENT: Record<Lang, string> = {
  RU: colors.tabs.pronunciation,
  KZ: colors.tabs.exercises,
  JA: colors.tabs.profile,
  EN: colors.tabs.aac,
};

export default function ChooseLanguageScreen() {
  const insets = useSafeAreaInsets();
  const setPreferredLang = useLanguageStore((state) => state.setPreferredLang);

  function handleChoose(lang: Lang) {
    setPreferredLang(lang);
    setAppLanguage(lang);
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.huge, paddingBottom: insets.bottom + spacing.huge },
      ]}
    >
      <LinearGradient colors={colors.gradient} style={styles.logo}>
        <Text style={styles.logoText}>Ra</Text>
      </LinearGradient>

      <Text style={styles.title}>Say Ra</Text>
      <Text style={styles.subtitle}>Choose your language · Выберите язык</Text>

      <View style={styles.list}>
        {SUPPORTED_LANGS.map((lang) => (
          <Pressable
            key={lang}
            onPress={() => handleChoose(lang)}
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          >
            <View style={[styles.badge, { backgroundColor: LANG_ACCENT[lang] }]}>
              <Text style={styles.badgeText}>{lang}</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionNative}>{LANG_LABELS[lang].native}</Text>
              <Text style={styles.optionEnglish}>{LANG_LABELS[lang].english}</Text>
            </View>
            <Text style={styles.chevron}>{'›'}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
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
    fontFamily: fontFamily.black,
    fontSize: fontSize['5xl'],
    color: colors.white,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['7xl'],
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.huge,
  },
  list: {
    gap: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    gap: spacing.xl,
    ...shadows.card,
  },
  optionPressed: {
    opacity: 0.85,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.white,
  },
  optionText: {
    flex: 1,
  },
  optionNative: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize['4xl'],
    color: colors.text,
  },
  optionEnglish: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 1,
  },
  chevron: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['5xl'],
    color: colors.placeholder,
  },
});
