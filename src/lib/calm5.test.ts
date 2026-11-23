import { describe, expect, it } from 'vitest';
import { CALM_PHASES, CALM_TOTAL, calmStateAt } from './calm5';

describe('5-minute calm', () => {
  it('lasts exactly 5 minutes', () => {
    expect(CALM_TOTAL).toBe(300);
  });

  it('every paced phase fits a whole number of breaths', () => {
    for (const p of CALM_PHASES) {
      if (!p.cycle.length) continue;
      const len = p.cycle.reduce((s, [, n]) => s + n, 0);
      expect(p.seconds % len).toBe(0);
    }
  });

  it('never asks her to hold the breath', () => {
    for (const p of CALM_PHASES)
      for (const [cue] of p.cycle) expect(['in', 'out', 'hum']).toContain(cue);
  });

  it('walks through the phases and cues', () => {
    expect(calmStateAt(0)).toMatchObject({ phaseIndex: 0, cue: 'rest' });
    expect(calmStateAt(30)).toMatchObject({ phaseIndex: 1, cue: 'in', cueLeft: 4 });
    expect(calmStateAt(34)).toMatchObject({ phaseIndex: 1, cue: 'out', cueLeft: 4 });
    expect(calmStateAt(110)).toMatchObject({ phaseIndex: 2, cue: 'in' });
    expect(calmStateAt(115)).toMatchObject({ phaseIndex: 2, cue: 'out', cueLeft: 5 });
    expect(calmStateAt(214)).toMatchObject({ phaseIndex: 3, cue: 'hum' });
    expect(calmStateAt(280)).toMatchObject({ phaseIndex: 4, cue: 'rest' });
    expect(calmStateAt(299).done).toBe(false);
    expect(calmStateAt(300).done).toBe(true);
    expect(calmStateAt(-5).phaseIndex).toBe(0);
  });
});
