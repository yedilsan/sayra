import type { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export type FontWeightToken = keyof typeof fontFamily;

export const fontSize = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 15,
  '2xl': 16,
  '3xl': 17,
  '4xl': 18,
  '5xl': 20,
  '6xl': 22,
  '7xl': 24,
  '8xl': 26,
  '9xl': 28,
  '10xl': 34,
} as const;

export function textStyle(weight: FontWeightToken, size: number, extra?: TextStyle): TextStyle {
  return {
    fontFamily: fontFamily[weight],
    fontSize: size,
    ...extra,
  };
}
