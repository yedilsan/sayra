import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

/**
 * Tokens live in the OS keychain/keystore on native. expo-secure-store has no web
 * implementation (its web module is an empty stub), so web falls back to AsyncStorage
 * — which is localStorage there. That's weaker storage, but web is a dev/preview
 * target here, and without the fallback every web load hangs on rehydration.
 */
export const secureStoreAdapter: StateStorage = Platform.select({
  web: {
    getItem: (name) => AsyncStorage.getItem(name),
    setItem: (name, value) => AsyncStorage.setItem(name, value),
    removeItem: (name) => AsyncStorage.removeItem(name),
  },
  default: {
    getItem: async (name) => (await SecureStore.getItemAsync(name)) ?? null,
    setItem: async (name, value) => {
      await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name) => {
      await SecureStore.deleteItemAsync(name);
    },
  },
});
