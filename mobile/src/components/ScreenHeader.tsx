import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/theme';

interface ScreenHeaderProps {
  backLabel: string;
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ backLabel, title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
        <Text style={styles.backLabel} numberOfLines={1}>
          {'‹ '}
          {backLabel}
        </Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.huge,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  backLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['6xl'],
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    marginTop: 2,
  },
});
