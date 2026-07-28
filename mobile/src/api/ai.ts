import { api } from './client';

export async function sendChatMessage(message: string): Promise<string> {
  const { data } = await api.post<{ reply: string }>('/ai/chat', { message });
  return data.reply;
}
