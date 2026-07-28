import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as exercisesApi from '@/api/exercises';
import { useAuthStore } from '@/store/auth-store';
import { useChildStore } from '@/store/child-store';

export function useExerciseTypes() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['exercises', 'types'],
    queryFn: exercisesApi.getTypes,
    enabled: !!accessToken,
  });
}

export function useExercisesByType(typeSlug: string | undefined) {
  return useQuery({
    queryKey: ['exercises', 'list', typeSlug],
    queryFn: () => exercisesApi.getExercises(typeSlug as string),
    enabled: !!typeSlug,
  });
}

export function useCompleteExercise() {
  const activeChildId = useChildStore((state) => state.activeChildId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, durationSeconds }: { exerciseId: string; durationSeconds: number }) => {
      if (!activeChildId) {
        throw new Error('No active child selected');
      }
      return exercisesApi.completeExercise(exerciseId, { childId: activeChildId, durationSeconds });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['progress', activeChildId] });
    },
  });
}
