import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useAppGate } from '@/hooks/useAppGate';
import { setAppLanguage } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { useLanguageStore } from '@/store/language-store';
import { colors, fontFamily, fontSize } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function FullScreenLoader() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.text} />
    </View>
  );
}

function FullScreenError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={[styles.centered, styles.centeredPadded]}>
      <Text style={styles.errorText}>{t('common.somethingWentWrong')}</Text>
      <Button label={t('common.retry')} onPress={onRetry} style={styles.retryButton} />
    </View>
  );
}

function RootNavigator() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userLanguage = useAuthStore((state) => state.user?.language);
  const preferredLang = useLanguageStore((state) => state.preferredLang);
  const gate = useAppGate(!!accessToken);

  // Once signed in the account's language wins; before that, fall back to the choice
  // made on the first-launch picker.
  useEffect(() => {
    const lang = userLanguage ?? preferredLang;
    if (lang) {
      setAppLanguage(lang);
    }
  }, [userLanguage, preferredLang]);

  if (gate.status === 'loading') {
    return <FullScreenLoader />;
  }

  if (gate.status === 'error') {
    return <FullScreenError onRetry={gate.retry} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={gate.status === 'ready'}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={gate.status === 'onboarding'}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={gate.status === 'unauthed'}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      {/* Distinct path from (onboarding)/add-child — sharing `/add-child` made which
          screen rendered ambiguous, and the modal's router.back() silently no-ops
          during onboarding where there's no history to pop. */}
      <Stack.Protected guard={gate.status !== 'unauthed'}>
        <Stack.Screen name="children/new" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const langHydrated = useLanguageStore((state) => state.hasHydrated);
  // Wait for the language store too, otherwise the picker flashes for returning users.
  const ready = fontsLoaded && hasHydrated && langHydrated;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <RootNavigator />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  centeredPadded: {
    paddingHorizontal: 32,
    gap: 16,
  },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.text,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 160,
  },
});
