import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, radii } from '@/theme';
import { getAvatarColor } from '@/utils/avatar-color';

interface AacCategoryChipProps {
  id: string;
  label: string;
  imageUrl: string;
  active: boolean;
  onPress: () => void;
}

export function AacCategoryChip({ id, label, imageUrl, active, onPress }: AacCategoryChipProps) {
  const tint = getAvatarColor(id);

  return (
    <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: tint }]}>
      <View style={[styles.iconCircle, { backgroundColor: active ? colors.white : tint }]}>
        <Image source={{ uri: imageUrl }} style={styles.icon} contentFit="cover" />
      </View>
      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
    paddingRight: 14,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.chipInactiveBg,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.white,
  },
});
