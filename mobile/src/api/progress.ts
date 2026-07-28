import { api } from './client';
import type { ProgressSession, ProgressSummary } from '@/types';

export async function getSummary(childId: string): Promise<ProgressSummary> {
  const { data } = await api.get<ProgressSummary>(`/progress/${childId}`);
  return data;
}

export async function getSessions(childId: string): Promise<ProgressSession[]> {
  const { data } = await api.get<ProgressSession[]>(`/progress/${childId}/sessions`);
  return data;
}
