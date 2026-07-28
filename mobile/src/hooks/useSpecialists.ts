import { useQuery } from '@tanstack/react-query';

import * as specialistsApi from '@/api/specialists';
import { useAuthStore } from '@/store/auth-store';

export function useSpecialists() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['specialists'],
    queryFn: specialistsApi.getSpecialists,
    enabled: !!accessToken,
  });
}
