import { api } from './client';
import type { AacCard, AacCategory } from '@/types';

export async function getCategories(): Promise<AacCategory[]> {
  const { data } = await api.get<AacCategory[]>('/aac/categories');
  return data;
}

export async function getCoreCards(): Promise<AacCard[]> {
  const { data } = await api.get<AacCard[]>('/aac/core-cards');
  return data;
}

export async function getCategoryCards(categoryId: string): Promise<AacCard[]> {
  const { data } = await api.get<AacCard[]>(`/aac/categories/${categoryId}/cards`);
  return data;
}

export async function synthesizeSpeech(text: string, voice?: string): Promise<ArrayBuffer> {
  const { data } = await api.post<ArrayBuffer>(
    '/aac/tts',
    { text, voice },
    { responseType: 'arraybuffer' },
  );
  return data;
}
