import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DEFAULT_EXERCISE_DURATION_SECONDS } from '@/constants/exercises';
import { useCompleteExercise, useExercisesByType, useExerciseTypes } from '@/hooks/useExercises';
import { useAuthStore } from '@/store/auth-store';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';
import { pickLocalized } from '@/utils/localized';

const FEEDBACK_DELAY_MS = 1300;

type Feedback = 'correct' | 'incorrect' | null;

export default function ListenAndPointQuizScreen() {
  const { t } = useTranslation();
  const { typeSlug, start } = useLocalSearchParams<{ typeSlug: string; start?: string }>();
  const lang = useAuthStore((state) => state.user?.language ?? 'EN');

  const typesQuery = useExerciseTypes();
  const exercisesQuery = useExercisesByType(typeSlug);
  const completeExercise = useCompleteExercise();

  const questions = exercisesQuery.data ?? [];
  const startIndex = Number(start ?? 0) || 0;

  const [round, setRound] = useState(startIndex);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [missedThisRound, setMissedThisRound] = useState(false);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Mirrors the prototype's `_analyzeTimer` cleanup so a pending advance never
  // fires after the screen unmounts.
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  const type = typesQuery.data?.find((item) => item.slug === typeSlug);
  const typeName = type ? pickLocalized(type, 'name', lang) : t('exercises.title');
  const question = questions[round];

  function restart() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
    }
    setRound(0);
    setFeedback(null);
    setMissedThisRound(false);
    setFirstTryCorrect(0);
    setIsComplete(false);
  }

  function handleAnswer(isCorrect: boolean) {
    if (feedback || !question) {
      return;
    }

    if (!isCorrect) {
      setFeedback('incorrect');
      setMissedThisRound(true);
      advanceTimer.current = setTimeout(() => setFeedback(null), FEEDBACK_DELAY_MS);
      return;
    }

    setFeedback('correct');
    if (!missedThisRound) {
      setFirstTryCorrect((prev) => prev + 1);
    }
    completeExercise.mutate({
      exerciseId: question.id,
      durationSeconds: question.durationSeconds ?? DEFAULT_EXERCISE_DURATION_SECONDS,
    });

    advanceTimer.current = setTimeout(() => {
      setFeedback(null);
      setMissedThisRound(false);
      if (round >= questions.length - 1) {
        setIsComplete(true);
      } else {
        setRound((prev) => prev + 1);
      }
    }, FEEDBACK_DELAY_MS);
  }

  if (exercisesQuery.isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.textMuted} />
      </View>
    );
  }

  if (isComplete) {
    return (
      <ScrollView contentContainerStyle={styles.completeContent}>
        <View style={styles.completeBadge}>
          <Text style={styles.completeBadgeGlyph}>★</Text>
        </View>
        <Text style={styles.completeTitle}>{t('exercises.quizCompleteTitle')}</Text>
        <Text style={styles.completeScore}>
          {t('exercises.quizCompleteScore', { correct: firstTryCorrect, total: questions.length })}
        </Text>
        <Button label={t('exercises.tryAgain')} onPress={restart} style={styles.completeButton} />
        <Button
          label={t('exercises.backToExercises')}
          variant="secondary"
          onPress={() => router.back()}
          style={styles.completeButton}
        />
      </ScrollView>
    );
  }

  if (!question) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader backLabel={typeName} title={t('common.somethingWentWrong')} />
      </ScrollView>
    );
  }

  const options = question.optionImages ?? [];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader
        backLabel={typeName}
        title={t('exercises.quizProgress', { current: round + 1, total: questions.length })}
      />

      <View style={styles.promptCard}>
        <Text style={styles.promptLabel}>{t('exercises.pointToThe')}</Text>
        <Text style={styles.promptWord}>{pickLocalized(question, 'instruction', lang)}</Text>
      </View>

      <View style={styles.optionsGrid}>
        {options.map((option) => (
          <Pressable
            key={option.imageUrl}
            onPress={() => handleAnswer(option.isCorrect)}
            disabled={!!feedback}
            style={styles.optionCard}
          >
            <Image source={{ uri: option.imageUrl }} style={styles.optionImage} contentFit="cover" />
            <Text style={styles.optionLabel} numberOfLines={1}>
              {pickLocalized(option, 'label', lang)}
            </Text>
          </Pressable>
        ))}
      </View>

      {feedback ? (
        <View style={[styles.feedback, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
          <Text
            style={[
              styles.feedbackText,
              feedback === 'correct' ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect,
            ]}
          >
            {feedback === 'correct' ? t('exercises.correct') : t('exercises.incorrect')}
          </Text>
        </View>
      ) : null}
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
  promptCard: {
    backgroundColor: colors.tint.blue.bg,
    borderRadius: radii.xxl,
    padding: spacing.huge,
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  promptLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.tint.blue.textAlt,
  },
  promptWord: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['9xl'],
    color: colors.tint.blue.text,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  optionCard: {
    flexGrow: 1,
    flexBasis: '30%',
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.card,
  },
  optionImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.lg,
    backgroundColor: colors.borderLight,
  },
  optionLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.md,
    color: colors.text,
  },
  feedback: {
    marginTop: spacing.huge,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: colors.tint.teal.bg,
  },
  feedbackIncorrect: {
    backgroundColor: colors.tint.orange.bg,
  },
  feedbackText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['5xl'],
  },
  feedbackTextCorrect: {
    color: colors.tint.teal.text,
  },
  feedbackTextIncorrect: {
    color: colors.tint.orange.text,
  },
  completeContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.formX,
    paddingVertical: spacing.huge,
  },
  completeBadge: {
    width: 88,
    height: 88,
    borderRadius: radii.circle,
    backgroundColor: colors.tint.teal.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.huge,
  },
  completeBadgeGlyph: {
    fontFamily: fontFamily.black,
    fontSize: 40,
    color: colors.tint.teal.text,
  },
  completeTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['6xl'],
    color: colors.text,
    textAlign: 'center',
  },
  completeScore: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.huge,
  },
  completeButton: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
});
