import { useQuery } from '@tanstack/react-query';

import * as progressApi from '@/api/progress';

export function useProgressSummary(childId: string | null) {
  return useQuery({
    queryKey: ['progress', childId, 'summary'],
    queryFn: () => progressApi.getSummary(childId as string),
    enabled: !!childId,
  });
}

export function useProgressSessions(childId: string | null) {
  return useQuery({
    queryKey: ['progress', childId, 'sessions'],
    queryFn: () => progressApi.getSessions(childId as string),
    enabled: !!childId,
  });
}
