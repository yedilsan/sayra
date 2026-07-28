import type { ColorValue } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/theme';

interface IconPlaceholderProps {
  size: number;
  color: ColorValue;
  shape?: 'circle' | 'square';
  glyph?: string;
  glyphColor?: ColorValue;
}

/**
 * The source prototype has no icon/photo assets — every "icon" is a flat colored
 * block. This stands in for real icon assets until those are supplied.
 */
export function IconPlaceholder({
  size,
  color,
  shape = 'circle',
  glyph,
  glyphColor = '#FFFFFF',
}: IconPlaceholderProps) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: shape === 'circle' ? size / 2 : size * 0.28,
        },
      ]}
    >
      {glyph ? (
        <Text style={[styles.glyph, { color: glyphColor, fontSize: size * 0.42 }]}>{glyph}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontFamily: fontFamily.extraBold,
  },
});
