import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStoreAdapter } from './storage/secure-store-adapter';
import type { AuthTokens, User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setSession: (user: User, tokens: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  updateUser: (user: User) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setSession: (user, tokens) =>
        set({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      setTokens: (tokens) =>
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      updateUser: (user) => set({ user }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'sayra_auth_session',
      storage: createJSONStorage(() => secureStoreAdapter),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      // Always flip the flag, even when rehydration fails — otherwise a storage
      // error leaves the app stuck on a blank screen instead of the login screen.
      onRehydrateStorage: () => () => {
        useAuthStore.getState().setHasHydrated(true);
      },
    },
  ),
);
