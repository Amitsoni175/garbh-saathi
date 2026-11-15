import type { VedicKind } from '@/lib/content';
import { randInt, shuffle } from '@/lib/random';

export interface BubbleQuestion {
  text: string;
  answer: number;
  options: number[];
  /** A short worked hint using the trick. */
  hint: string;
}

function options(answer: number, deltas: number[], rand: () => number): number[] {
  const set = new Set<number>([answer]);
  for (const d of shuffle(deltas, rand)) {
    const v = answer + d;
    if (v > 0) set.add(v);
    if (set.size === 3) break;
  }
  let extra = 1;
  while (set.size < 3) set.add(answer + extra++);
  return shuffle([...set], rand);
}

/** One practice question for a Vedic maths trick. */
export function makeQuestion(kind: VedicKind, rand: () => number): BubbleQuestion {
  switch (kind) {
    case 'squareEnding5': {
      const tens = randInt(1, 9, rand);
      const n = tens * 10 + 5;
      const answer = n * n;
      return {
        text: `${n} × ${n}`,
        answer,
        options: options(answer, [100, -100, 10, 200], rand),
        hint: `${tens} × ${tens + 1} = ${tens * (tens + 1)}, then 25`,
      };
    }
    case 'times11': {
      const n = randInt(12, 99, rand);
      const answer = n * 11;
      const a = Math.floor(n / 10);
      const b = n % 10;
      return {
        text: `${n} × 11`,
        answer,
        options: options(answer, [10, -10, 11, -11, 100], rand),
        hint: `${a} _ ${b} → ${a} + ${b} = ${a + b} in the middle`,
      };
    }
    case 'near100': {
      const a = randInt(91, 99, rand);
      const b = randInt(91, 99, rand);
      const answer = a * b;
      return {
        text: `${a} × ${b}`,
        answer,
        options: options(answer, [100, -100, 10, -10], rand),
        hint: `${a} − ${100 - b} = ${a - (100 - b)}, and ${100 - a} × ${100 - b} = ${String((100 - a) * (100 - b)).padStart(2, '0')}`,
      };
    }
    case 'times5': {
      const n = randInt(6, 49, rand) * 2;
      const answer = n * 5;
      return {
        text: `${n} × 5`,
        answer,
        options: options(answer, [5, -5, 10, -10, 50], rand),
        hint: `${n} ÷ 2 = ${n / 2}, then × 10`,
      };
    }
    case 'add9':
    default: {
      const n = randInt(11, 89, rand);
      const answer = n + 9;
      return {
        text: `${n} + 9`,
        answer,
        options: options(answer, [1, -1, 10, -10], rand),
        hint: `${n} + 10 = ${n + 10}, then − 1`,
      };
    }
  }
}
