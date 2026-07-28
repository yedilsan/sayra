import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, radii } from '@/theme';
import { getAvatarColor } from '@/utils/avatar-color';

interface AacTileProps {
  id: string;
  label: string;
  imageUrl: string;
  onPress: () => void;
}

const TILE_SIZE = 100;

/**
 * Width of one tile, and the full height it occupies including its label —
 * `TILE_SIZE` + the 4px gap + the label's line box. Verified against the rendered
 * layout; keep in sync if the label's font size changes.
 */
export const AAC_TILE_SIZE = TILE_SIZE;
export const AAC_TILE_ROW_HEIGHT = 120;

export function AacTile({ id, label, imageUrl, onPress }: AacTileProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={[styles.imageWrapper, { backgroundColor: getAvatarColor(id) }]}>
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: TILE_SIZE,
    alignItems: 'center',
    gap: 4,
  },
  imageWrapper: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.text,
    textAlign: 'center',
  },
});
