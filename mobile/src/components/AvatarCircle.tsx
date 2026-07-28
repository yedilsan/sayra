import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily } from '@/theme';
import { getAvatarColor } from '@/utils/avatar-color';

interface AvatarCircleProps {
  id: string;
  name: string;
  size: number;
  photoUrl?: string | null;
}

export function AvatarCircle({ id, name, size, photoUrl }: AvatarCircleProps) {
  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: getAvatarColor(id) },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fontFamily.extraBold,
    color: colors.white,
  },
});
