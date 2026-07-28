import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ListCard } from '@/components/ListCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { LISTEN_AND_POINT_SLUG } from '@/constants/exercises';
import { useExercisesByType, useExerciseTypes } from '@/hooks/useExercises';
import { useAuthStore } from '@/store/auth-store';
import { colors, fontFamily, fontSize, spacing } from '@/theme';
import { pickLocalized } from '@/utils/localized';

export default function ExerciseListScreen() {
  const { t } = useTranslation();
  const { typeSlug } = useLocalSearchParams<{ typeSlug: string }>();
  const lang = useAuthStore((state) => state.user?.language ?? 'EN');

  const typesQuery = useExerciseTypes();
  const exercisesQuery = useExercisesByType(typeSlug);

  const type = typesQuery.data?.find((item) => item.slug === typeSlug);
  const typeName = type ? pickLocalized(type, 'name', lang) : t('exercises.title');
  const isQuizType = typeSlug === LISTEN_AND_POINT_SLUG;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader backLabel={t('exercises.title')} title={typeName} />

      {exercisesQuery.isPending ? (
        <ActivityIndicator color={colors.textMuted} style={styles.loader} />
      ) : exercisesQuery.isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{t('common.somethingWentWrong')}</Text>
          <Button label={t('common.retry')} onPress={() => void exercisesQuery.refetch()} />
        </View>
      ) : (
        <View style={styles.list}>
          {(exercisesQuery.data ?? []).map((exercise, index) => (
            <ListCard
              key={exercise.id}
              title={pickLocalized(exercise, 'title', lang)}
              subtitle={pickLocalized(exercise, 'description', lang)}
              onPress={() => {
                if (isQuizType) {
                  router.push(`/exercises/quiz?typeSlug=${typeSlug}&start=${index}`);
                } else {
                  router.push(`/exercises/detail/${exercise.id}?typeSlug=${typeSlug}`);
                }
              }}
            />
          ))}
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
