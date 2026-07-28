import { Stack } from 'expo-router';

import { useAppGate } from '@/hooks/useAppGate';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/theme';

export default function OnboardingLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const gate = useAppGate(!!accessToken);

  // The gate already decides which onboarding step applies; without guards this stack
  // just rendered its first route, so a parent with several children could land on
  // Add Child instead of the "Who's practicing?" picker.
  const screen = gate.status === 'onboarding' ? gate.screen : null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={screen === 'add-child'}>
        <Stack.Screen name="add-child" />
      </Stack.Protected>
      <Stack.Protected guard={screen === 'who-is-practicing'}>
        <Stack.Screen name="who-is-practicing" />
      </Stack.Protected>
    </Stack>
  );
}
