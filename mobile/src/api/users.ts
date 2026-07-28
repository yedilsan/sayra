import { api } from './client';
import type { Lang, User } from '@/types';

export interface UpdateUserPayload {
  name?: string;
  avatarUrl?: string;
  language?: Lang;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function updateMe(payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
}
