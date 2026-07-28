import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarCircle } from '@/components/AvatarCircle';
import { colors, fontFamily, fontSize } from '@/theme';
import type { Child } from '@/types';

interface TopChildBarProps {
  activeChild: Child | undefined;
  onPress: () => void;
}

export function TopChildBar({ activeChild, onPress }: TopChildBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { height: insets.top + 56 }]}>
      <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
      <Pressable
        onPress={onPress}
        style={[styles.row, { paddingTop: insets.top }]}
        disabled={!activeChild}
      >
        {activeChild ? (
          <>
            <AvatarCircle id={activeChild.id} name={activeChild.name} photoUrl={activeChild.avatarUrl} size={28} />
            <Text style={styles.name}>{activeChild.name}</Text>
            <Text style={styles.chevron}>{'▾'}</Text>
          </>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  name: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  chevron: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});
