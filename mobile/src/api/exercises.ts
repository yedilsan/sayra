import { api } from './client';
import type { Exercise, ExerciseSession, ExerciseType } from '@/types';

export async function getTypes(): Promise<ExerciseType[]> {
  const { data } = await api.get<ExerciseType[]>('/exercises/types');
  return data;
}

export async function getExercises(typeSlug: string): Promise<Exercise[]> {
  const { data } = await api.get<Exercise[]>('/exercises', { params: { typeSlug } });
  return data;
}

export async function getExercise(id: string): Promise<Exercise> {
  const { data } = await api.get<Exercise>(`/exercises/${id}`);
  return data;
}

export interface CompleteExercisePayload {
  childId: string;
  durationSeconds: number;
}

export async function completeExercise(
  id: string,
  payload: CompleteExercisePayload,
): Promise<ExerciseSession> {
  const { data } = await api.post<ExerciseSession>(`/exercises/${id}/complete`, payload);
  return data;
}
