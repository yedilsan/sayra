import { api } from './client';
import type { Lang, PronunciationSession } from '@/types';

export interface AnalyzePronunciationPayload {
  childId: string;
  targetWord: string;
  language: Lang;
  audioUri: string;
  audioName: string;
  audioMimeType: string;
}

export async function analyzePronunciation({
  childId,
  targetWord,
  language,
  audioUri,
  audioName,
  audioMimeType,
}: AnalyzePronunciationPayload): Promise<PronunciationSession> {
  const form = new FormData();
  form.append('childId', childId);
  form.append('targetWord', targetWord);
  form.append('language', language);
  // React Native's FormData accepts this {uri, name, type} shape for file parts.
  form.append('audio', {
    uri: audioUri,
    name: audioName,
    type: audioMimeType,
  } as unknown as Blob);

  const { data } = await api.post<PronunciationSession>('/pronunciation/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
