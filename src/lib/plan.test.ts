import { GAME_IDS, contentIndexForDay, getDailyPlan, rotate, unlockedStoryIds } from './plan';

const ctx = {
  storyIds: ['abhimanyu', 'gita-1', 'gita-2', 'gita-3', 'dhruva'],
  shlokaIds: ['a', 'b', 'c'],
  promptIds: ['p1', 'p2'],
  papaIds: ['x'],
  journalIds: ['j1', 'j2', 'j3'],
};

describe('daily plan', () => {
  it('picks the story and shloka by pregnancy day, whenever she set the app up', () => {
    expect(getDailyPlan(1, 0, ctx).storyId).toBe('abhimanyu');
    expect(getDailyPlan(126, 0, ctx).storyId).toBe(ctx.storyIds[125 % 5]);
    expect(getDailyPlan(126, 30, ctx).storyId).toBe(getDailyPlan(126, 0, ctx).storyId);
    expect(getDailyPlan(126, 30, ctx).shlokaId).toBe(ctx.shlokaIds[125 % 3]);
  });

  it('keeps a story series on consecutive days', () => {
    expect([2, 3, 4].map((d) => getDailyPlan(100 + d, d, ctx, d).storyId)).toEqual([
      'gita-1',
      'gita-2',
      'gita-3',
    ]);
  });

  it('rotates deterministically so every day has content, even past day 280', () => {
    const a = getDailyPlan(280, 400, ctx, 300);
    const b = getDailyPlan(280, 400, ctx, 300);
    expect(a).toEqual(b);
    expect(a.storyId).toBe(ctx.storyIds[299 % 5]);
    expect(getDailyPlan(280, 401, ctx, 301).storyId).not.toBe(a.storyId);
    expect(GAME_IDS).toContain(a.gameType);
  });

  it('maps pregnancy days to content positions', () => {
    expect(contentIndexForDay(1, 62)).toBe(0);
    expect(contentIndexForDay(62, 62)).toBe(61);
    expect(contentIndexForDay(63, 62)).toBe(0);
    expect(contentIndexForDay(0, 5)).toBe(4);
    expect(contentIndexForDay(5, 0)).toBe(0);
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

  it('unlocks the stories the calendar offered since she started', () => {
    // Started on pregnancy day 3 (gita-2), today is day 4 (gita-3).
    expect(unlockedStoryIds(1, ctx.storyIds, 4)).toEqual(['gita-2', 'gita-3']);
    expect(unlockedStoryIds(0, ctx.storyIds, 6)).toEqual(['abhimanyu']);
    expect(unlockedStoryIds(-2, ctx.storyIds, 7)).toEqual(['gita-1']);
  });
});
