import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ListCard } from '@/components/ListCard';
import { PRONUNCIATION_TYPE_IDS, type PronunciationTypeId } from '@/content/pronunciation-word-bank';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { getTint } from '@/utils/tint';

const TYPE_GLYPHS: Record<PronunciationTypeId, string> = {
  sounds: 'S',
  words: 'W',
  picture: 'P',
};

export default function PronunciationTypesScreen() {
  const { t } = useTranslation();

  const labels: Record<PronunciationTypeId, { label: string; description: string }> = {
    sounds: { label: t('pronunciation.typeSounds'), description: t('pronunciation.typeSoundsDesc') },
    words: { label: t('pronunciation.typeWords'), description: t('pronunciation.typeWordsDesc') },
    picture: { label: t('pronunciation.typePicture'), description: t('pronunciation.typePictureDesc') },
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('pronunciation.title')}</Text>
      <Text style={styles.subtitle}>{t('pronunciation.subtitle')}</Text>

      <View style={styles.list}>
        {PRONUNCIATION_TYPE_IDS.map((typeId) => {
          const tint = getTint(typeId);
          return (
            <ListCard
              key={typeId}
              title={labels[typeId].label}
              subtitle={labels[typeId].description}
              icon={{ glyph: TYPE_GLYPHS[typeId], bg: tint.bg, color: tint.text }}
              onPress={() => router.push(`/pronunciation/session?type=${typeId}`)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['7xl'],
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.huge,
  },
  list: {
    gap: spacing.lg,
  },
});
