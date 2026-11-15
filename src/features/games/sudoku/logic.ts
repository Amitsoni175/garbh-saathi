import { shuffle } from '@/lib/random';

export type Grid = (number | 0)[][];

/** Box shape: 4×4 → 2×2 boxes; 6×6 → 2 rows × 3 columns. */
export function boxDims(size: 4 | 6): { rows: number; cols: number } {
  return size === 4 ? { rows: 2, cols: 2 } : { rows: 2, cols: 3 };
}

/** A valid solved grid, built from a base pattern and shuffled rows/cols/digits. */
export function generateSolution(size: 4 | 6, rand: () => number): number[][] {
  const { rows: br, cols: bc } = boxDims(size);
  const pattern = (r: number, c: number) => (bc * (r % br) + Math.floor(r / br) + c) % size;
  const bandsR = shuffle([...Array(size / br).keys()], rand);
  const rowsIdx = bandsR.flatMap((b) =>
    shuffle([...Array(br).keys()], rand).map((r) => b * br + r),
  );
  const stacks = shuffle([...Array(size / bc).keys()], rand);
  const colsIdx = stacks.flatMap((s) =>
    shuffle([...Array(bc).keys()], rand).map((c) => s * bc + c),
  );
  const digits = shuffle(
    [...Array(size).keys()].map((d) => d + 1),
    rand,
  );
  return rowsIdx.map((r) => colsIdx.map((c) => digits[pattern(r, c)] as number));
}

/** Remove `holes` cells (0 = empty). */
export function makePuzzle(solution: number[][], holes: number, rand: () => number): Grid {
  const size = solution.length;
  const cells = shuffle([...Array(size * size).keys()], rand).slice(
    0,
    Math.min(holes, size * size - 1),
  );
  const grid = solution.map((row) => [...row]);
  for (const i of cells) {
    const row = grid[Math.floor(i / size)];
    if (row) row[i % size] = 0;
  }
  return grid;
}

/** Cells (as "r,c") whose value clashes with another in the same row, column or box. */
export function conflicts(grid: Grid, size: 4 | 6): Set<string> {
  const { rows: br, cols: bc } = boxDims(size);
  const out = new Set<string>();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = grid[r]?.[c];
      if (!v) continue;
      for (let r2 = 0; r2 < size; r2++) {
        for (let c2 = 0; c2 < size; c2++) {
          if (r2 === r && c2 === c) continue;
          const same =
            r2 === r ||
            c2 === c ||
            (Math.floor(r2 / br) === Math.floor(r / br) &&
              Math.floor(c2 / bc) === Math.floor(c / bc));
          if (same && grid[r2]?.[c2] === v) out.add(`${r},${c}`);
        }
      }
    }
  }
  return out;
}

/** True when every row, column and box has 1..size exactly once. */
export function isSolved(grid: Grid, size: 4 | 6): boolean {
  if (grid.length !== size || grid.some((row) => row.length !== size || row.some((v) => !v)))
    return false;
  return conflicts(grid, size).size === 0;
}
