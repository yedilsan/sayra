import { Stack } from 'expo-router';

import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/theme';

export default function AuthLayout() {
  const preferredLang = useLanguageStore((state) => state.preferredLang);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      {/* First launch: pick a language before anything else, so the auth screens are readable. */}
      <Stack.Protected guard={preferredLang === null}>
        <Stack.Screen name="choose-language" />
      </Stack.Protected>
      <Stack.Protected guard={preferredLang !== null}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
