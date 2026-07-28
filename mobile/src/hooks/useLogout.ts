import { useQueryClient } from '@tanstack/react-query';

import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { useChildStore } from '@/store/child-store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);
  const setActiveChildId = useChildStore((state) => state.setActiveChildId);

  return async () => {
    try {
      await authApi.logout();
    } catch {
      // Server-side revocation is best-effort — always clear locally regardless.
    }
    clearSession();
    setActiveChildId(null);
    queryClient.clear();
  };
}
