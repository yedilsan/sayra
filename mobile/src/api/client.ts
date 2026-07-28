import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/auth-store';
import type { AuthResponse } from '@/types';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

let refreshPromise: Promise<AuthResponse> | null = null;

async function performRefresh(): Promise<AuthResponse> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<AuthResponse>(
    `${baseURL}/auth/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );
  return response.data;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retried || isAuthEndpoint) {
      throw error;
    }

    originalRequest._retried = true;

    try {
      refreshPromise ??= performRefresh();
      const { user, ...tokens } = await refreshPromise;
      useAuthStore.getState().setSession(user, tokens);
      originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      throw refreshError;
    } finally {
      refreshPromise = null;
    }
  },
);
