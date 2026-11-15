import { getRagas } from './content';
import { ragaForMoment } from './raga';
import { isHotMonth, ragaSlotForHour, seasonForMonth, waterGoal } from './season';
import { flowerPosition, gardenStage, milestonesReached, summarise } from './garden';

describe('season selector', () => {
  it.each([
    [1, 'fog'],
    [2, 'spring'],
    [4, 'spring'],
    [5, 'heat'],
    [6, 'heat'],
    [7, 'monsoon'],
    [9, 'monsoon'],
    [10, 'autumn'],
    [11, 'autumn'],
    [12, 'fog'],
  ] as const)('month %i is %s', (m, s) => {
    expect(seasonForMonth(m)).toBe(s);
  });

  it('raises the water goal in hot months', () => {
    expect(isHotMonth(5)).toBe(true);
    expect(waterGoal(5)).toBeGreaterThan(waterGoal(12));
  });
});

describe('raga by time', () => {
  it.each([
    [4, 'morning'],
    [10, 'morning'],
    [11, 'afternoon'],
    [16, 'afternoon'],
    [17, 'evening'],
    [20, 'evening'],
    [21, 'night'],
    [2, 'night'],
  ] as const)('hour %i → %s', (h, slot) => {
    expect(ragaSlotForHour(h)).toBe(slot);
  });

  it('picks morning ragas in the morning and evening Yaman in the evening', () => {
    expect(['bhairav', 'ahir-bhairav']).toContain(ragaForMoment(7, 1)?.id);
    expect(ragaForMoment(18, 1)?.id).toBe('yaman');
    expect(ragaForMoment(14, 1)?.id).toBe('bhimpalasi');
    expect(['bageshree', 'darbari']).toContain(ragaForMoment(23, 1)?.id);
  });

  it('honours a plan slot override', () => {
    expect(ragaForMoment(7, 1, 'evening')?.id).toBe('yaman');
  });

  it('every slot has a raga', () => {
    const slots = new Set(getRagas().map((r) => r.slot));
    expect([...slots].sort()).toEqual(['afternoon', 'evening', 'morning', 'night']);
  });
});

describe('garden', () => {
  it('grows through stages and never goes back', () => {
    const stages = [0, 8, 14, 20, 28, 37, 41].map(gardenStage);
    expect(stages).toEqual(['seed', 'sprout', 'sapling', 'young', 'tree', 'bloom', 'bloom']);
  });

  it('adds milestones as weeks pass', () => {
    expect(milestonesReached(7)).toHaveLength(0);
    expect(milestonesReached(20).map((m) => m.id)).toContain('sparrow');
  });

  it('places flowers deterministically within the box', () => {
    const p = flowerPosition(7);
    expect(flowerPosition(7)).toEqual(p);
    expect(p.x).toBeGreaterThanOrEqual(0);
    expect(p.x).toBeLessThan(1);
  });

  it('summarises a week', () => {
    expect(
      summarise([{ kind: 'story' }, { kind: 'game' }, { kind: 'journal' }, { kind: 'tablet' }]),
    ).toEqual({
      stories: 1,
      games: 1,
      letters: 1,
      other: 1,
      total: 4,
    });
  });
});
