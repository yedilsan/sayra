import { useQuery } from '@tanstack/react-query';

import * as aacApi from '@/api/aac';
import { useAuthStore } from '@/store/auth-store';

export function useAacCategories() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['aac', 'categories'],
    queryFn: aacApi.getCategories,
    enabled: !!accessToken,
  });
}

export function useAacCoreCards() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['aac', 'core-cards'],
    queryFn: aacApi.getCoreCards,
    enabled: !!accessToken,
  });
}

export function useAacCategoryCards(categoryId: string | null) {
  return useQuery({
    queryKey: ['aac', 'category-cards', categoryId],
    queryFn: () => aacApi.getCategoryCards(categoryId as string),
    enabled: !!categoryId,
  });
}
