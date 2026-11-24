/**
 * Thought of the Day: one short, hope-giving thought each day (Gita, Ramayana,
 * Mahabharata, Bible, Gurbani, Socrates, Lao Tzu, Aristotle, Roy T. Bennett,
 * The Alchemist and more), in English and Hindi, with a line to say to baby.
 * It opens by itself the first time she opens the app each day.
 */
import raw from '@/content/thoughts.json';
import { rotate } from './plan';

export interface Bilingual {
  en: string;
  hi: string;
}

export interface Thought {
  id: string;
  emoji: string;
  source: Bilingual;
  text: Bilingual;
  say: Bilingual;
  /** The original words (Sanskrit, Awadhi, Gurmukhi in Devanagari…), if any. */
  original?: string;
}

const isBi = (x: unknown): x is Bilingual =>
  typeof x === 'object' &&
  x !== null &&
  typeof (x as Bilingual).en === 'string' &&
  (x as Bilingual).en.trim() !== '' &&
  typeof (x as Bilingual).hi === 'string' &&
  (x as Bilingual).hi.trim() !== '';

export function isThought(x: unknown): x is Thought {
  if (typeof x !== 'object' || x === null) return false;
  const t = x as Thought;
  return (
    typeof t.id === 'string' &&
    typeof t.emoji === 'string' &&
    isBi(t.source) &&
    isBi(t.text) &&
    isBi(t.say) &&
    (t.original === undefined || typeof t.original === 'string')
  );
}

let cache: Thought[] | null = null;

/** Every valid thought; bad entries are skipped (and logged in development). */
export function getThoughts(): Thought[] {
  if (cache) return cache;
  const list = (raw as unknown[]).filter((x) => {
    const ok = isThought(x);
    if (!ok && import.meta.env.DEV) console.warn('[thoughts] skipped invalid entry', x);
    return ok;
  }) as Thought[];
  cache = list;
  return list;
}

/** Day 0 gets thought #1, then one new thought every day. */
export function thoughtForDay(offset: number, list = getThoughts()): Thought | undefined {
  return rotate(list, offset);
}

const EPOCH = Date.UTC(2026, 0, 1);

/**
 * Days since 1 Jan 2026 for a local 'YYYY-MM-DD' date. The thought follows the calendar,
 * so it changes every midnight for everyone, even after setting the app up again.
 */
export function calendarDayIndex(localISO: string): number {
  const [y, m, d] = localISO.split('-').map(Number);
  return Math.round((Date.UTC(y ?? 2026, (m ?? 1) - 1, d ?? 1) - EPOCH) / 86_400_000);
}

export function thoughtForDate(localISO: string, list = getThoughts()): Thought | undefined {
  return thoughtForDay(calendarDayIndex(localISO), list);
}

/** Should the thought open by itself? Only on the first visit of the day. */
export function shouldAutoOpen(lastSeenDate: string | null, today: string): boolean {
  return lastSeenDate !== today;
}

export const THOUGHT_SEEN_KEY = 'thoughtSeenDate';
