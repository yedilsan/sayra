import { api } from './client';
import type { AuthResponse, Lang } from '@/types';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  /** Seeds the account's interface language; the backend defaults to RU when omitted. */
  language?: Lang;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
