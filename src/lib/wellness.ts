/** Wellness helpers: mood scale, daily row access, low-mood check. */
import { useLiveQuery } from 'dexie-react-hooks';
import { addDays } from 'date-fns';
import { db, type DailyRow } from './db';
import { logError } from './logger';
import { parseLocalDate, toLocalISO } from './pregnancy';

/** 1 = very low … 5 = very happy. */
export const MOODS = [
  { value: 1, emoji: '😢' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
] as const;

export const moodEmoji = (v: number | undefined) => MOODS.find((m) => m.value === v)?.emoji;

export async function updateDaily(date: string, patch: Partial<DailyRow>): Promise<void> {
  try {
    const existing = await db.daily.get(date);
    await db.daily.put({ ...(existing ?? { date }), ...patch, date });
  } catch (err) {
    void logError(err);
  }
}

export function useDaily(date: string): DailyRow | undefined | null {
  return useLiveQuery(async () => (await db.daily.get(date)) ?? null, [date]);
}

export function useDailyRange(from: string, to: string): DailyRow[] | undefined {
  return useLiveQuery(
    () => db.daily.where('date').between(from, to, true, true).toArray(),
    [from, to],
  );
}

/**
 * True if mood was low (1 or 2) on each of the last `days` days up to today.
 * Missing days break the streak (we never assume a low mood).
 */
export function hasLowMoodStreak(
  rows: Pick<DailyRow, 'date' | 'mood'>[],
  today: string,
  days = 3,
): boolean {
  const byDate = new Map(rows.map((r) => [r.date, r.mood]));
  const t = parseLocalDate(today);
  if (!t) return false;
  for (let i = 0; i < days; i++) {
    const mood = byDate.get(toLocalISO(addDays(t, -i)));
    if (mood === undefined || mood > 2) return false;
  }
  return true;
}
