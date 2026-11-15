import { shuffle } from '@/lib/random';

export interface FillRound {
  shlokaId: string;
  words: string[];
  blankIndex: number;
  answer: string;
  options: string[];
}

/** Blank out one longer word of a shloka and offer it with two words from other shlokas. */
export function makeFillRound(
  shloka: { id: string; simple: string },
  others: { simple: string }[],
  rand: () => number,
): FillRound | null {
  const words = shloka.simple.split(/\s+/).filter(Boolean);
  const candidates = words.map((w, i) => ({ w, i })).filter(({ w }) => w.length >= 4);
  const chosen = shuffle(candidates, rand)[0];
  if (!chosen) return null;
  const pool = [
    ...new Set(
      others
        .flatMap((o) => o.simple.split(/\s+/))
        .filter(
          (w) => w.length >= 4 && w.toLowerCase() !== chosen.w.toLowerCase() && !words.includes(w),
        ),
    ),
  ];
  const distractors = shuffle(pool, rand).slice(0, 2);
  if (distractors.length < 2) return null;
  return {
    shlokaId: shloka.id,
    words,
    blankIndex: chosen.i,
    answer: chosen.w,
    options: shuffle([chosen.w, ...distractors], rand),
  };
}
