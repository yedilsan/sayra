import { api } from './client';
import type { Child } from '@/types';

export interface CreateChildPayload {
  name: string;
  age: number;
  avatarUrl?: string;
}

export type UpdateChildPayload = Partial<CreateChildPayload>;

export async function getChildren(): Promise<Child[]> {
  const { data } = await api.get<Child[]>('/children');
  return data;
}

export async function getChild(id: string): Promise<Child> {
  const { data } = await api.get<Child>(`/children/${id}`);
  return data;
}

export async function createChild(payload: CreateChildPayload): Promise<Child> {
  const { data } = await api.post<Child>('/children', payload);
  return data;
}

export async function updateChild(id: string, payload: UpdateChildPayload): Promise<Child> {
  const { data } = await api.patch<Child>(`/children/${id}`, payload);
  return data;
}

export async function deleteChild(id: string): Promise<void> {
  await api.delete(`/children/${id}`);
}
