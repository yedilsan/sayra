import { colors } from '@/theme';

const PALETTE = [
  colors.tabs.aac,
  colors.tabs.exercises,
  colors.tabs.pronunciation,
  colors.tabs.therapists,
  colors.tabs.profile,
];

/**
 * The backend only stores an optional photo `avatarUrl` for a child, not a color choice.
 * Rather than fighting that with a fake URL, every avatar swatch in the app is derived
 * deterministically from the child's id so it's stable and consistent everywhere without
 * needing its own storage.
 */
export function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
