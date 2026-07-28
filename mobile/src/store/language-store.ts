import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Lang } from '@/types';

interface LanguageState {
  /** Language chosen on the first-launch picker. Null until the user picks one. */
  preferredLang: Lang | null;
  hasHydrated: boolean;
  setPreferredLang: (lang: Lang) => void;
  setHasHydrated: (value: boolean) => void;
}

/**
 * Holds the pre-auth language choice. Once signed in, `user.language` from the API is the
 * source of truth — this only seeds the UI before there's an account, and supplies the
 * `language` field sent to POST /auth/register.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      preferredLang: null,
      hasHydrated: false,
      setPreferredLang: (lang) => set({ preferredLang: lang }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'sayra_preferred_language',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preferredLang: state.preferredLang }),
      onRehydrateStorage: () => () => {
        useLanguageStore.getState().setHasHydrated(true);
      },
    },
  ),
);
