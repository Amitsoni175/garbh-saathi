import { shuffle } from '@/lib/random';

export interface MemoryCard {
  /** Unique per card. */
  id: number;
  /** Same for both cards of a pair. */
  pairKey: string;
  emoji: string;
  label: string;
}

/** Build a shuffled deck with `pairs` pairs from the item list. */
export function buildDeck(
  items: { emoji: string; label: string }[],
  pairs: number,
  rand: () => number,
): MemoryCard[] {
  const chosen = shuffle(items, rand).slice(0, pairs);
  const cards = chosen.flatMap((item, i) => [
    { pairKey: `p${i}`, emoji: item.emoji, label: item.label },
    { pairKey: `p${i}`, emoji: item.emoji, label: item.label },
  ]);
  return shuffle(cards, rand).map((c, id) => ({ ...c, id }));
}

export function isMatch(a: MemoryCard | undefined, b: MemoryCard | undefined): boolean {
  return !!a && !!b && a.id !== b.id && a.pairKey === b.pairKey;
}

/** Level 1 = 3×4 (6 pairs); level 2 = 4×4 (8 pairs) once she has played a couple of times. */
export function memoryLevel(timesPlayed: number): { level: 1 | 2; pairs: number; cols: number } {
  return timesPlayed >= 2 ? { level: 2, pairs: 8, cols: 4 } : { level: 1, pairs: 6, cols: 3 };
}
