import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DEFAULT_EXERCISE_DURATION_SECONDS } from '@/constants/exercises';
import { useCompleteExercise, useExercisesByType, useExerciseTypes } from '@/hooks/useExercises';
import { useAuthStore } from '@/store/auth-store';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';
import { pickLocalized } from '@/utils/localized';

export default function ExerciseDetailScreen() {
  const { t } = useTranslation();
  const { id, typeSlug } = useLocalSearchParams<{ id: string; typeSlug?: string }>();
  const lang = useAuthStore((state) => state.user?.language ?? 'EN');

  const typesQuery = useExerciseTypes();
  const exercisesQuery = useExercisesByType(typeSlug);
  const completeExercise = useCompleteExercise();

  const exercise = exercisesQuery.data?.find((item) => item.id === id);
  const type = typesQuery.data?.find((item) => item.slug === typeSlug);
  const typeName = type ? pickLocalized(type, 'name', lang) : t('exercises.title');

  if (exercisesQuery.isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.textMuted} />
      </View>
    );
  }

  if (!exercise) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader backLabel={typeName} title={t('common.somethingWentWrong')} />
      </ScrollView>
    );
  }

  const instruction = pickLocalized(exercise, 'instruction', lang);
  const description = pickLocalized(exercise, 'description', lang);
  const isCompleted = completeExercise.isSuccess;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader backLabel={typeName} title={pickLocalized(exercise, 'title', lang)} />

      {exercise.mediaUrl ? (
        <Image source={{ uri: exercise.mediaUrl }} style={styles.media} contentFit="cover" />
      ) : null}

      {instruction ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('exercises.howToPractice')}</Text>
          <Text style={styles.cardText}>{instruction}</Text>
        </View>
      ) : null}

      {description && description !== instruction ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      <Button
        label={isCompleted ? t('exercises.completed') : t('exercises.markComplete')}
        onPress={() =>
          completeExercise.mutate({
            exerciseId: exercise.id,
            durationSeconds: exercise.durationSeconds ?? DEFAULT_EXERCISE_DURATION_SECONDS,
          })
        }
        loading={completeExercise.isPending}
        disabled={isCompleted}
        style={styles.completeButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  media: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radii.xxl,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    ...shadows.card,
  },
  cardLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    color: colors.text,
    lineHeight: 22,
  },
  description: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.xxl,
  },
  completeButton: {
    marginTop: 'auto',
  },
});
