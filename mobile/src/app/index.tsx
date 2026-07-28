import { Redirect } from 'expo-router';

import { useAppGate } from '@/hooks/useAppGate';
import { useAuthStore } from '@/store/auth-store';
import { useLanguageStore } from '@/store/language-store';

/**
 * Entry route. Sends `/` to a screen that the root layout's `Stack.Protected` guards
 * will actually render — redirecting an authed-but-not-onboarded user straight to /aac
 * lands on a guarded-off route and renders a blank screen.
 */
export default function Index() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const preferredLang = useLanguageStore((state) => state.preferredLang);
  const gate = useAppGate(!!accessToken);

  if (gate.status === 'onboarding') {
    return (
      <Redirect
        href={gate.screen === 'who-is-practicing' ? '/who-is-practicing' : '/add-child'}
      />
    );
  }

  if (gate.status === 'ready') {
    return <Redirect href="/aac" />;
  }

  if (gate.status === 'unauthed') {
    return <Redirect href={preferredLang === null ? '/choose-language' : '/login'} />;
  }

  // loading / error — the root layout renders its own spinner or retry screen.
  return null;
}
