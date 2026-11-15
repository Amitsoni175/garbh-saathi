/**
 * Recording what she did. Every completion adds a flower to the garden.
 * Completions are never deleted (the garden never shrinks).
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { getTodayISO } from './clock';
import { db, type CompletionKind, type CompletionRow } from './db';
import { logError } from './logger';

export async function recordCompletion(kind: CompletionKind, refId?: string): Promise<boolean> {
  try {
    await db.completions.add({ date: getTodayISO(), kind, refId, createdAt: Date.now() });
    return true;
  } catch (err) {
    void logError(err);
    return false;
  }
}

/** Record only if this kind (and refId, if given) isn't already done today. */
export async function recordOncePerDay(kind: CompletionKind, refId?: string): Promise<boolean> {
  try {
    const today = getTodayISO();
    const existing = await db.completions.where({ date: today, kind }).toArray();
    if (existing.some((r) => refId === undefined || r.refId === refId)) return false;
    return recordCompletion(kind, refId);
  } catch (err) {
    void logError(err);
    return false;
  }
}

/** Live list of completions for one date. */
export function useCompletionsOn(date: string): CompletionRow[] | undefined {
  return useLiveQuery(() => db.completions.where('date').equals(date).toArray(), [date]);
}

export function useCompletionCount(): number | undefined {
  return useLiveQuery(() => db.completions.count(), []);
}

export function useAllCompletions(): CompletionRow[] | undefined {
  return useLiveQuery(() => db.completions.toArray(), []);
}

export function useCompletionsBetween(from: string, to: string): CompletionRow[] | undefined {
  return useLiveQuery(
    () => db.completions.where('date').between(from, to, true, true).toArray(),
    [from, to],
  );
}
