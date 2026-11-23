/** Shabd Khoj: a gentle word search. Words run left→right or top→bottom only. */
import { shuffle } from '@/lib/random';

export interface Placement {
  word: string;
  row: number;
  col: number;
  dir: 'h' | 'v';
}

export interface Puzzle {
  size: number;
  grid: string[][];
  placements: Placement[];
}

export interface Cell {
  row: number;
  col: number;
}

const FILL = 'AABCDEEGHIIJKLMNOOPRSTUUY';

export function cellsOf(p: Placement): Cell[] {
  return Array.from(p.word, (_, i) => ({
    row: p.row + (p.dir === 'v' ? i : 0),
    col: p.col + (p.dir === 'h' ? i : 0),
  }));
}

export function buildPuzzle(words: string[], size: number, rand: () => number): Puzzle {
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const placements: Placement[] = [];
  // Longest first places most reliably.
  const sorted = [...words].map((w) => w.toUpperCase()).sort((a, b) => b.length - a.length);
  for (const word of sorted) {
    if (word.length > size) continue;
    const options: Placement[] = [];
    for (const dir of ['h', 'v'] as const)
      for (let row = 0; row < size; row++)
        for (let col = 0; col < size; col++) {
          const p: Placement = { word, row, col, dir };
          const cells = cellsOf(p);
          if (cells.some((c) => c.row >= size || c.col >= size)) continue;
          if (
            cells.every((c, i) => grid[c.row]?.[c.col] == null || grid[c.row]?.[c.col] === word[i])
          )
            options.push(p);
        }
    const choice = shuffle(options, rand)[0];
    if (!choice) continue;
    cellsOf(choice).forEach((c, i) => {
      const row = grid[c.row];
      if (row) row[c.col] = word[i] ?? '';
    });
    placements.push(choice);
  }
  const filled = grid.map((r) =>
    r.map((ch) => ch ?? FILL.charAt(Math.floor(rand() * FILL.length))),
  );
  return { size, grid: filled, placements };
}

/** She tapped the first and last letter (either order). Which word, if any? */
export function matchSelection(
  placements: Placement[],
  a: Cell,
  b: Cell,
  found: ReadonlySet<string>,
): Placement | undefined {
  return placements.find((p) => {
    if (found.has(p.word)) return false;
    const cells = cellsOf(p);
    const s = cells[0];
    const e = cells[cells.length - 1];
    if (!s || !e) return false;
    const same = (x: Cell, y: Cell) => x.row === y.row && x.col === y.col;
    return (same(s, a) && same(e, b)) || (same(s, b) && same(e, a));
  });
}

export const cellKey = (c: Cell) => `${c.row}-${c.col}`;
