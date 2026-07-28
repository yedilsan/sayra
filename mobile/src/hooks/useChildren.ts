import { useQuery, useQueryClient } from '@tanstack/react-query';

import * as childrenApi from '@/api/children';
import { useAuthStore } from '@/store/auth-store';

export const childrenQueryKey = ['children'] as const;

export function useChildren() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: childrenQueryKey,
    queryFn: childrenApi.getChildren,
    enabled: !!accessToken,
  });
}

export function useInvalidateChildren() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: childrenQueryKey });
}
