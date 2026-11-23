import { describe, expect, it } from 'vitest';
import { seededRandom } from '@/lib/random';
import { buildPuzzle, cellsOf, matchSelection } from './khoj/logic';
import { KHOJ_THEMES } from './khoj/themes';
import { NOTES, checkTaps, extendTune, newTune } from './sargam/logic';

describe('Sargam Echo', () => {
  it('builds tunes of the right length from the five notes', () => {
    const rand = seededRandom(7);
    const tune = newTune(rand, 3);
    expect(tune).toHaveLength(3);
    expect(tune.every((n) => n >= 0 && n < NOTES.length)).toBe(true);
    expect(extendTune(tune, rand)).toHaveLength(4);
  });

  it('never repeats one note three times in a row', () => {
    for (let seed = 0; seed < 50; seed++) {
      const tune = newTune(seededRandom(seed), 8);
      for (let i = 2; i < tune.length; i++)
        expect(tune[i] === tune[i - 1] && tune[i] === tune[i - 2]).toBe(false);
    }
  });

  it('checks taps gently', () => {
    expect(checkTaps([0, 2, 4], [0])).toBe('continue');
    expect(checkTaps([0, 2, 4], [0, 2, 4])).toBe('complete');
    expect(checkTaps([0, 2, 4], [0, 1])).toBe('again');
  });
});

describe('Shabd Khoj', () => {
  it('places every word so it can be read in the grid', () => {
    for (let seed = 0; seed < 40; seed++) {
      const words = ['PYAAR', 'MAA', 'LORI', 'CHAND'];
      const pz = buildPuzzle(words, 6, seededRandom(seed));
      expect(pz.placements.map((p) => p.word).sort()).toEqual([...words].sort());
      for (const p of pz.placements) {
        const read = cellsOf(p)
          .map((c) => pz.grid[c.row]?.[c.col])
          .join('');
        expect(read).toBe(p.word);
      }
      expect(pz.grid.flat().every((ch) => /^[A-Z]$/.test(ch))).toBe(true);
    }
  });

  it('matches a tap on the first and last letter, in either order', () => {
    const pz = buildPuzzle(['LORI'], 6, seededRandom(3));
    const p = pz.placements[0];
    if (!p) throw new Error('not placed');
    const cells = cellsOf(p);
    const [s, e] = [cells[0], cells[cells.length - 1]];
    if (!s || !e) throw new Error('no cells');
    expect(matchSelection(pz.placements, s, e, new Set())?.word).toBe('LORI');
    expect(matchSelection(pz.placements, e, s, new Set())?.word).toBe('LORI');
    expect(matchSelection(pz.placements, s, s, new Set())).toBeUndefined();
    expect(matchSelection(pz.placements, s, e, new Set(['LORI']))).toBeUndefined();
  });

  it('theme words fit the grid', () => {
    for (const th of KHOJ_THEMES)
      for (const lang of ['en', 'hinglish'] as const) {
        expect(th.words[lang].length).toBeGreaterThanOrEqual(4);
        for (const w of th.words[lang]) expect(w).toMatch(/^[A-Z]{3,6}$/);
      }
  });
});
