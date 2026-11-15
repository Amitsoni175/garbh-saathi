import { shuffle } from '@/lib/random';

/** Scrambled letters, never (if avoidable) in the original order. */
export function scramble(word: string, rand: () => number): string[] {
  const letters = word.split('');
  if (new Set(letters).size < 2) return letters;
  for (let i = 0; i < 10; i++) {
    const s = shuffle(letters, rand);
    if (s.join('') !== word) return s;
  }
  return [...letters].reverse();
}

export function checkWord(attempt: string[], word: string): boolean {
  return attempt.join('').toUpperCase() === word.toUpperCase();
}

/** Index (in the tile list) of a tile that is the next correct letter, for hints. */
export function nextHintTile(
  tiles: { letter: string; used: boolean }[],
  word: string,
  placed: number,
): number {
  const needed = word[placed];
  return tiles.findIndex((t) => !t.used && t.letter === needed);
}
