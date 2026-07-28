import type { Lang } from '@/types';

export type PronunciationTypeId = 'sounds' | 'words' | 'picture';

export interface PronunciationItem {
  /** The text actually sent to the backend as `targetWord` and shown to the child. */
  word: string;
  /** Only used by the `picture` type — the image the child names. */
  imageUrl?: string;
}

/**
 * The backend has no endpoint for pronunciation practice targets (unlike AAC cards and
 * exercises, which are seeded server-side), so this curated per-language set ships with
 * the client. Keep the three type ids stable — they drive the picker UI.
 */
const WORD_BANK: Record<PronunciationTypeId, Record<Lang, string[]>> = {
  sounds: {
    EN: ['r', 'sh', 'l', 's', 'th'],
    RU: ['р', 'ш', 'л', 'с', 'ж'],
    KZ: ['р', 'ш', 'л', 'с', 'қ'],
    JA: ['ら', 'し', 'る', 'す', 'つ'],
  },
  words: {
    EN: ['rabbit', 'sunshine', 'lamp', 'fish', 'yellow'],
    RU: ['ракета', 'солнце', 'лампа', 'рыба', 'жёлтый'],
    KZ: ['қоян', 'күн', 'шам', 'балық', 'сары'],
    JA: ['うさぎ', 'たいよう', 'ランプ', 'さかな', 'きいろ'],
  },
  picture: {
    EN: ['cat', 'ball', 'banana', 'car', 'shoe'],
    RU: ['кошка', 'мяч', 'банан', 'машина', 'ботинок'],
    KZ: ['мысық', 'доп', 'банан', 'машина', 'аяқкиім'],
    JA: ['ねこ', 'ボール', 'バナナ', 'くるま', 'くつ'],
  },
};

/** Stable image seeds so the picture type shows the same image regardless of language. */
const PICTURE_SEEDS = ['cat', 'ball', 'banana', 'car', 'shoe'];

export function getPronunciationItems(type: PronunciationTypeId, lang: Lang): PronunciationItem[] {
  const words = WORD_BANK[type][lang] ?? WORD_BANK[type].EN;

  return words.map((word, index) => ({
    word,
    imageUrl:
      type === 'picture' ? `https://picsum.photos/seed/${PICTURE_SEEDS[index]}/300` : undefined,
  }));
}

export const PRONUNCIATION_TYPE_IDS: PronunciationTypeId[] = ['sounds', 'words', 'picture'];
