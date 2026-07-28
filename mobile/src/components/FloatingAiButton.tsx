import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, shadows } from '@/theme';

interface FloatingAiButtonProps {
  onPress: () => void;
  bottom: number;
}

export function FloatingAiButton({ onPress, bottom }: FloatingAiButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.wrapper, { bottom }]}>
      <LinearGradient colors={colors.gradient} style={styles.button}>
        <View style={styles.plusHorizontal} />
        <View style={styles.plusVertical} />
      </LinearGradient>
    </Pressable>
  );
}

const SIZE = 56;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 30,
    ...shadows.floatingButton,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
});
