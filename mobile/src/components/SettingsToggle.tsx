import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme';

interface SettingsToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsToggle({ value, onChange }: SettingsToggleProps) {
  return (
    <Pressable onPress={() => onChange(!value)} style={[styles.track, value && styles.trackOn]}>
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 26,
    borderRadius: radii.pill,
    backgroundColor: colors.disabled,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: {
    backgroundColor: colors.tabs.aac,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: radii.circle,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
});
