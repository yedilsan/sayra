import { colors } from '@/theme';

const TINTS = [colors.tint.teal, colors.tint.purple, colors.tint.orange, colors.tint.green, colors.tint.blue];

/**
 * Exercise types, pronunciation types, etc. don't carry a color from the backend.
 * Derive a stable tint pair (bg + text) from the entity's id so each one reads
 * distinctly but consistently across renders.
 */
export function getTint(id: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const tint = TINTS[hash % TINTS.length];
  return { bg: tint.bg, text: tint.text };
}
