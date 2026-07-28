import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { analyzePronunciation } from '@/api/pronunciation';
import { Button } from '@/components/Button';
import { RecordButton, type RecordPhase } from '@/components/RecordButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import {
  getPronunciationItems,
  type PronunciationTypeId,
} from '@/content/pronunciation-word-bank';
import { useAuthStore } from '@/store/auth-store';
import { useChildStore } from '@/store/child-store';
import { colors, fontFamily, fontSize, radii, spacing } from '@/theme';
import type { PronunciationFeedback } from '@/types';

export default function PronunciationSessionScreen() {
  const { t } = useTranslation();
  const { type } = useLocalSearchParams<{ type: PronunciationTypeId }>();
  const lang = useAuthStore((state) => state.user?.language ?? 'EN');
  const activeChildId = useChildStore((state) => state.activeChildId);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const isMounted = useRef(true);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<RecordPhase>('idle');
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const typeId: PronunciationTypeId = type ?? 'sounds';
  const items = getPronunciationItems(typeId, lang);
  const item = items[index % items.length];
  const isPictureType = typeId === 'picture';

  const typeLabels: Record<PronunciationTypeId, string> = {
    sounds: t('pronunciation.typeSounds'),
    words: t('pronunciation.typeWords'),
    picture: t('pronunciation.typePicture'),
  };

  async function startRecording() {
    setError(null);
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) {
      setError(t('pronunciation.permissionDenied'));
      return;
    }

    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setPhase('recording');
  }

  async function stopAndAnalyze() {
    setPhase('analyzing');
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri || !activeChildId) {
        throw new Error('Missing recording or active child');
      }

      const session = await analyzePronunciation({
        childId: activeChildId,
        targetWord: item.word,
        language: lang,
        audioUri: uri,
        audioName: 'recording.m4a',
        audioMimeType: 'audio/m4a',
      });

      if (!isMounted.current) {
        return;
      }

      const parsed = session.aiFeedback
        ? (JSON.parse(session.aiFeedback) as PronunciationFeedback)
        : null;
      setFeedback(parsed);
      setPhase('result');
    } catch {
      if (!isMounted.current) {
        return;
      }
      setError(t('pronunciation.analyzeFailed'));
      setPhase('idle');
    }
  }

  function handleRecordPress() {
    if (phase === 'idle') {
      void startRecording();
    } else if (phase === 'recording') {
      void stopAndAnalyze();
    }
  }

  function handleNext() {
    setIndex((prev) => (prev + 1) % items.length);
    setFeedback(null);
    setError(null);
    setPhase('idle');
  }

  const recordLabel =
    phase === 'recording'
      ? t('pronunciation.listening')
      : phase === 'analyzing'
        ? t('pronunciation.checking')
        : phase === 'result'
          ? t('pronunciation.done')
          : t('pronunciation.tapToRecord');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader backLabel={typeLabels[typeId]} title={typeLabels[typeId]} />

      <View style={styles.promptCard}>
        {isPictureType ? (
          <>
            <Text style={styles.promptLabel}>{t('pronunciation.whatIsThis')}</Text>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.promptImage} contentFit="cover" />
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.promptLabel}>{t('pronunciation.say')}</Text>
            <Text style={styles.promptWord}>{item.word}</Text>
          </>
        )}
      </View>

      <View style={styles.recordArea}>
        <RecordButton phase={phase} onPress={handleRecordPress} />
        <Text style={styles.recordLabel}>{recordLabel}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      {phase === 'result' ? (
        <View style={styles.resultCard}>
          <Text
            style={[
              styles.resultHeadline,
              feedback?.isCorrect ? styles.resultHeadlineGood : styles.resultHeadlinePractice,
            ]}
          >
            {feedback?.isCorrect ? t('pronunciation.resultGreat') : t('pronunciation.resultPractice')}
          </Text>

          {typeof feedback?.accuracy === 'number' ? (
            <Text style={styles.resultAccuracy}>
              {t('pronunciation.accuracy', { accuracy: Math.round(feedback.accuracy) })}
            </Text>
          ) : null}

          {feedback?.feedback ? <Text style={styles.resultText}>{feedback.feedback}</Text> : null}
          {feedback?.tips ? <Text style={styles.resultTips}>{feedback.tips}</Text> : null}

          <Button label={t('pronunciation.next')} onPress={handleNext} style={styles.nextButton} />
        </View>
      ) : null}
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
  promptCard: {
    backgroundColor: colors.tint.orange.bg,
    borderRadius: radii.xxl,
    padding: spacing.huge,
    alignItems: 'center',
  },
  promptLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.tint.orange.text,
  },
  promptWord: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['10xl'],
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  promptImage: {
    width: 110,
    height: 110,
    borderRadius: radii.huge,
    marginTop: spacing.lg,
    backgroundColor: colors.borderLight,
  },
  recordArea: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.huge * 1.5,
  },
  recordLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  error: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.error,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.huge,
    gap: spacing.md,
  },
  resultHeadline: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['5xl'],
    textAlign: 'center',
  },
  resultHeadlineGood: {
    color: colors.tint.teal.text,
  },
  resultHeadlinePractice: {
    color: colors.tint.orange.text,
  },
  resultAccuracy: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    textAlign: 'center',
  },
  resultText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  resultTips: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: spacing.md,
  },
});
