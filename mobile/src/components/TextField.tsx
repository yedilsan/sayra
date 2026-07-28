import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/theme';

interface TextFieldProps extends TextInputProps {
  /** Inline validation message shown under the field; also puts it in the error state. */
  error?: string | null;
}

export function TextField({ error, style, ...props }: TextFieldProps) {
  return (
    <View>
      <TextInput
        placeholderTextColor={colors.placeholder}
        accessibilityHint={error ?? undefined}
        style={[styles.base, !!error && styles.errorBorder, style]}
        {...props}
      />
      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.xxl,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xxs,
  },
});
