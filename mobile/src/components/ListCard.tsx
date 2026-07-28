import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';

interface ListCardIcon {
  glyph: string;
  bg: string;
  color: string;
}

interface ListCardProps {
  title: string;
  subtitle?: string;
  icon?: ListCardIcon;
  trailingText?: string;
  trailing?: ReactNode;
  showChevron?: boolean;
  onPress: () => void;
}

export function ListCard({
  title,
  subtitle,
  icon,
  trailingText,
  trailing,
  showChevron = true,
  onPress,
}: ListCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
          <Text style={[styles.iconGlyph, { color: icon.color }]}>{icon.glyph}</Text>
        </View>
      ) : null}

      <View style={styles.textStack}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailingText ? <Text style={styles.trailingText}>{trailingText}</Text> : null}
      {trailing}
      {showChevron ? <Text style={styles.chevron}>{'›'}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    gap: spacing.xl,
    ...shadows.card,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['5xl'],
  },
  textStack: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  trailingText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    color: colors.textFaint,
  },
  chevron: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['5xl'],
    color: colors.placeholder,
  },
});
