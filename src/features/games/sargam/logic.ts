/** Sargam Echo: listen to a short tune on Sa Re Ga Ma Pa and tap it back. */
export interface Note {
  id: string;
  label: string;
  freq: number;
  emoji: string;
}

/** Sa Re Ga Ma Pa (Bilawal / major scale from C4). Five notes keep it easy. */
export const NOTES: Note[] = [
  { id: 'sa', label: 'Sa', freq: 261.63, emoji: '🪷' },
  { id: 're', label: 'Re', freq: 293.66, emoji: '🌼' },
  { id: 'ga', label: 'Ga', freq: 329.63, emoji: '🌸' },
  { id: 'ma', label: 'Ma', freq: 349.23, emoji: '🌺' },
  { id: 'pa', label: 'Pa', freq: 392.0, emoji: '🌻' },
];

export const START_LENGTH = 2;
export const ROUNDS = 4; // tunes of 2, 3, 4 and 5 notes

/** Add one note to the tune; avoid three of the same note in a row. */
export function extendTune(tune: number[], rand: () => number, notes = NOTES.length): number[] {
  for (let tries = 0; tries < 10; tries++) {
    const n = Math.floor(rand() * notes);
    const a = tune[tune.length - 1];
    const b = tune[tune.length - 2];
    if (!(n === a && n === b)) return [...tune, n];
  }
  return [...tune, ((tune[tune.length - 1] ?? 0) + 1) % notes];
}

export function newTune(rand: () => number, length = START_LENGTH): number[] {
  let tune: number[] = [];
  while (tune.length < length) tune = extendTune(tune, rand);
  return tune;
}

export type TapResult = 'continue' | 'complete' | 'again';

/** She has tapped `taps` (including the newest). Is it still right? */
export function checkTaps(tune: number[], taps: number[]): TapResult {
  for (let i = 0; i < taps.length; i++) if (taps[i] !== tune[i]) return 'again';
  return taps.length >= tune.length ? 'complete' : 'continue';
}
