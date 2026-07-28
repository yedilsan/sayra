import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii } from '@/theme';

export type RecordPhase = 'idle' | 'recording' | 'analyzing' | 'result';

interface RecordButtonProps {
  phase: RecordPhase;
  onPress: () => void;
}

function PulsingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: delay }),
        withTiming(1, { duration: 400 }),
        withTiming(0.25, { duration: 400 }),
      ),
      -1,
      false,
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function RecordButton({ phase, onPress }: RecordButtonProps) {
  const disabled = phase === 'analyzing' || phase === 'result';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        phase === 'recording' && styles.buttonRecording,
        phase === 'result' && styles.buttonDimmed,
      ]}
    >
      {phase === 'analyzing' ? (
        <View style={styles.dotsRow}>
          <PulsingDot delay={0} />
          <PulsingDot delay={150} />
          <PulsingDot delay={300} />
        </View>
      ) : phase === 'recording' ? (
        <View style={styles.stopGlyph} />
      ) : (
        <View style={styles.recordGlyph} />
      )}
    </Pressable>
  );
}

const SIZE = 64;

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: radii.circle,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRecording: {
    backgroundColor: colors.error,
  },
  buttonDimmed: {
    opacity: 0.35,
  },
  recordGlyph: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    backgroundColor: colors.white,
  },
  stopGlyph: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.circle,
    backgroundColor: colors.white,
  },
});
