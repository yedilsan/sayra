import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ChildState {
  activeChildId: string | null;
  hasHydrated: boolean;
  setActiveChildId: (id: string | null) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useChildStore = create<ChildState>()(
  persist(
    (set) => ({
      activeChildId: null,
      hasHydrated: false,
      setActiveChildId: (id) => set({ activeChildId: id }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'sayra_active_child',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ activeChildId: state.activeChildId }),
      onRehydrateStorage: () => () => {
        useChildStore.getState().setHasHydrated(true);
      },
    },
  ),
);
