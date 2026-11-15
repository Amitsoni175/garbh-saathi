import { GAME_IDS, getDailyPlan, rotate, unlockedStoryIds } from './plan';

const ctx = {
  storyIds: ['abhimanyu', 'gita-1', 'gita-2', 'gita-3', 'dhruva'],
  shlokaIds: ['a', 'b', 'c'],
  promptIds: ['p1', 'p2'],
  papaIds: ['x'],
  journalIds: ['j1', 'j2', 'j3'],
};

describe('daily plan', () => {
  it('starts every journey with story #1 (Abhimanyu)', () => {
    expect(getDailyPlan(126, 0, ctx).storyId).toBe('abhimanyu');
    expect(getDailyPlan(10, 0, ctx).storyId).toBe('abhimanyu');
  });

  it('keeps a story series on consecutive days', () => {
    expect([1, 2, 3].map((o) => getDailyPlan(100 + o, o, ctx).storyId)).toEqual([
      'gita-1',
      'gita-2',
      'gita-3',
    ]);
  });

  it('rotates deterministically so every day has content, even past day 280', () => {
    const a = getDailyPlan(280, 400, ctx);
    const b = getDailyPlan(280, 400, ctx);
    expect(a).toEqual(b);
    expect(a.storyId).toBe(ctx.storyIds[400 % 5]);
    expect(GAME_IDS).toContain(a.gameType);
  });

  it('handles negative offsets (debug date before she started)', () => {
    expect(getDailyPlan(1, -1, ctx).storyId).toBe('dhruva');
    expect(rotate(['a', 'b', 'c'], -4)).toBe('c');
  });

  it('uses explicit entries only when their IDs exist', () => {
    const explicit = {
      '50': { storyId: 'dhruva', gameType: 'sudoku', promptId: 'nope', shlokaId: 'c' },
    };
    const plan = getDailyPlan(50, 0, { ...ctx, explicit });
    expect(plan.storyId).toBe('dhruva');
    expect(plan.gameType).toBe('sudoku');
    expect(plan.shlokaId).toBe('c');
    expect(plan.promptId).toBe('p1'); // typo → rotation
  });

  it('ignores an unknown game type', () => {
    expect(getDailyPlan(5, 0, { ...ctx, explicit: { '5': { gameType: 'chess' } } }).gameType).toBe(
      GAME_IDS[0],
    );
  });

  it('returns undefined ids when content is empty instead of crashing', () => {
    expect(getDailyPlan(1, 0, { ...ctx, storyIds: [] }).storyId).toBeUndefined();
  });

  it('unlocks stories day by day', () => {
    expect(unlockedStoryIds(0, ctx.storyIds)).toEqual(['abhimanyu']);
    expect(unlockedStoryIds(2, ctx.storyIds)).toHaveLength(3);
    expect(unlockedStoryIds(99, ctx.storyIds)).toHaveLength(5);
  });
});
