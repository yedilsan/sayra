import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows } from '@/theme';

interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: [SegmentedControlOption<T>, SegmentedControlOption<T>];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.borderLight,
    borderRadius: radii.lg,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.card,
    ...shadows.card,
  },
  label: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.text,
  },
});
