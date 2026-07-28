export type Lang = 'RU' | 'KZ' | 'JA' | 'EN';
export type Role = 'USER' | 'ADMIN';
export type MediaType = 'IMAGE' | 'GIF' | 'VIDEO';
export type MessageRole = 'USER' | 'ASSISTANT';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
  language: Lang;
  createdAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AacCategory {
  id: string;
  imageUrl: string;
  order: number;
  nameRu: string | null;
  nameKz: string | null;
  nameJa: string | null;
  nameEn: string | null;
}

export interface AacCard {
  id: string;
  categoryId: string;
  imageUrl: string;
  order: number;
  isCore: boolean;
  textRu: string | null;
  textKz: string | null;
  textJa: string | null;
  textEn: string | null;
}

export interface ExerciseType {
  id: string;
  slug: string;
  icon: string;
  nameRu: string | null;
  nameKz: string | null;
  nameJa: string | null;
  nameEn: string | null;
  descriptionRu: string | null;
  descriptionKz: string | null;
  descriptionJa: string | null;
  descriptionEn: string | null;
}

export interface ExerciseOptionImage {
  imageUrl: string;
  isCorrect: boolean;
  labelRu: string;
  labelKz: string;
  labelJa: string;
  labelEn: string;
}

export interface Exercise {
  id: string;
  typeId: string;
  titleRu: string | null;
  titleKz: string | null;
  titleJa: string | null;
  titleEn: string | null;
  descriptionRu: string | null;
  descriptionKz: string | null;
  descriptionJa: string | null;
  descriptionEn: string | null;
  instructionRu: string | null;
  instructionKz: string | null;
  instructionJa: string | null;
  instructionEn: string | null;
  mediaUrl: string | null;
  mediaType: MediaType;
  durationSeconds: number | null;
  difficulty: number;
  order: number;
  optionImages: ExerciseOptionImage[] | null;
}

export interface ExerciseSession {
  id: string;
  childId: string;
  exerciseId: string;
  completedAt: string;
  durationSeconds: number | null;
}

export interface PronunciationFeedback {
  accuracy: number;
  isCorrect: boolean;
  feedback: string;
  tips: string;
}

export interface PronunciationSession {
  id: string;
  childId: string;
  targetWord: string;
  targetLang: Lang;
  audioUrl: string | null;
  transcript: string | null;
  aiFeedback: string | null;
  createdAt: string;
}

export interface Specialist {
  id: string;
  name: string;
  photoUrl: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  specializations: string[];
  lat: number | null;
  lng: number | null;
}

export interface ProgressSummary {
  exercisesCompleted: number;
  totalPracticeSeconds: number;
  pronunciationAttempts: number;
  averagePronunciationAccuracy: number | null;
}

export type ProgressSession =
  | (ExerciseSession & { type: 'EXERCISE'; occurredAt: string; exercise: Exercise })
  | (PronunciationSession & { type: 'PRONUNCIATION'; occurredAt: string });

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
