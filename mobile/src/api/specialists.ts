import { api } from './client';
import type { Specialist } from '@/types';

export async function getSpecialists(): Promise<Specialist[]> {
  const { data } = await api.get<Specialist[]>('/specialists');
  return data;
}

export async function getSpecialist(id: string): Promise<Specialist> {
  const { data } = await api.get<Specialist>(`/specialists/${id}`);
  return data;
}
