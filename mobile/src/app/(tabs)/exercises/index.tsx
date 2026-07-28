import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ListCard } from '@/components/ListCard';
import { useExerciseTypes } from '@/hooks/useExercises';
import { useAuthStore } from '@/store/auth-store';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { pickLocalized } from '@/utils/localized';
import { getTint } from '@/utils/tint';

export default function ExerciseTypesScreen() {
  const { t } = useTranslation();
  const lang = useAuthStore((state) => state.user?.language ?? 'EN');
  const typesQuery = useExerciseTypes();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('exercises.title')}</Text>
      <Text style={styles.subtitle}>{t('exercises.subtitle')}</Text>

      {typesQuery.isPending ? (
        <ActivityIndicator color={colors.textMuted} style={styles.loader} />
      ) : typesQuery.isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{t('common.somethingWentWrong')}</Text>
          <Button label={t('common.retry')} onPress={() => void typesQuery.refetch()} />
        </View>
      ) : (
        <View style={styles.list}>
          {(typesQuery.data ?? []).map((type) => {
            const tint = getTint(type.id);
            const name = pickLocalized(type, 'name', lang);
            return (
              <ListCard
                key={type.id}
                title={name}
                subtitle={pickLocalized(type, 'description', lang)}
                icon={{ glyph: name.charAt(0).toUpperCase(), bg: tint.bg, color: tint.text }}
                onPress={() => router.push(`/exercises/${type.slug}`)}
              />
            );
          })}
        </View>
      )}
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
  loader: {
    marginTop: spacing.huge,
  },
  errorBox: {
    gap: spacing.xxl,
    marginTop: spacing.huge,
  },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.text,
    textAlign: 'center',
  },
  list: {
    gap: spacing.lg,
  },
});
