import type { ProgressSession } from '@/types';

export interface WeekdayBucket {
  /** 0 = six days ago … 6 = today. */
  offset: number;
  label: string;
  count: number;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * The backend returns a flat session list rather than a pre-bucketed week (unlike the
 * prototype's hardcoded `week: [...]`), so bucket the last 7 days client-side —
 * today is always the rightmost bar.
 */
export function bucketSessionsByWeekday(sessions: ProgressSession[]): WeekdayBucket[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets: WeekdayBucket[] = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - offset));
    return { offset, label: WEEKDAY_LABELS[day.getDay()], count: 0 };
  });

  sessions.forEach((session) => {
    const occurred = new Date(session.occurredAt);
    occurred.setHours(0, 0, 0, 0);
    const daysAgo = Math.round((today.getTime() - occurred.getTime()) / 86_400_000);
    if (daysAgo >= 0 && daysAgo <= 6) {
      buckets[6 - daysAgo].count += 1;
    }
  });

  return buckets;
}

export function formatPracticeTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
