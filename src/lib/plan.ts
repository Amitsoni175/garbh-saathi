/**
 * The daily plan: which shloka, story, game, raga and prompt she gets each day.
 *
 * 1. If src/content/dailyPlan.json has an entry for today's day number (1–280)
 *    and its IDs exist, those are used.
 * 2. Otherwise content rotates deterministically, counted from the day she
 *    started using the app. So everyone's first story is #1 (Abhimanyu), story
 *    series (Gita Week 1-2-3) arrive on consecutive days, and every day has
 *    something, even past day 280.
 */
import type { DailyPlanEntry, RagaSlot } from './content';

export const GAME_IDS = [
  'memory',
  'bubbleMaths',
  'storyQuiz',
  'wordGarden',
  'babySize',
  'paheli',
  'sudoku',
  'patterns',
  'rangoli',
  'sanjhi',
  'shlokaFill',
  'sargam',
  'shabdKhoj',
] as const;
export type GameId = (typeof GAME_IDS)[number];

export function isGameId(x: unknown): x is GameId {
  return typeof x === 'string' && (GAME_IDS as readonly string[]).includes(x);
}

export interface DayPlan {
  storyId: string | undefined;
  shlokaId: string | undefined;
  gameType: GameId;
  /** null = choose the raga by the clock. */
  ragaSlot: RagaSlot | null;
  promptId: string | undefined;
  papaPromptId: string | undefined;
  journalPromptId: string | undefined;
}

export interface PlanContext {
  storyIds: string[];
  shlokaIds: string[];
  promptIds: string[];
  papaIds: string[];
  journalIds: string[];
  gameIds?: readonly GameId[];
  explicit?: Record<string, DailyPlanEntry>;
}

/** Positive modulo, so negative offsets (debug dates before she started) still work. */
export function rotate<T>(list: readonly T[], index: number): T | undefined {
  if (list.length === 0) return undefined;
  return list[((index % list.length) + list.length) % list.length];
}

/**
 * Story, shloka and thought follow the pregnancy day (counted from the last period), so the same
 * day of pregnancy always brings the same story, however often the app is set up again, and the
 * website's calendar shows the same thing. Day 1 → item 1, day 2 → item 2, and round again.
 */
export function contentIndexForDay(pregnancyDay: number, length: number): number {
  if (length <= 0) return 0;
  return (((pregnancyDay - 1) % length) + length) % length;
}

/**
 * @param dayNumber  pregnancy day 1–280 (for explicit entries)
 * @param offset     days since she started using the app (0 on her first day)
 * @param contentDay pregnancy day without the 280 cap (keeps changing after the due date);
 *                   picks the story and shloka
 */
export function getDailyPlan(
  dayNumber: number,
  offset: number,
  ctx: PlanContext,
  contentDay = dayNumber,
): DayPlan {
  const games = ctx.gameIds ?? GAME_IDS;
  const plan: DayPlan = {
    storyId: ctx.storyIds[contentIndexForDay(contentDay, ctx.storyIds.length)],
    shlokaId: ctx.shlokaIds[contentIndexForDay(contentDay, ctx.shlokaIds.length)],
    gameType: rotate(games, offset) ?? 'memory',
    ragaSlot: null,
    promptId: rotate(ctx.promptIds, offset),
    papaPromptId: rotate(ctx.papaIds, offset),
    journalPromptId: rotate(ctx.journalIds, offset),
  };

  const entry = ctx.explicit?.[String(dayNumber)];
  if (entry) {
    // Only accept IDs that exist; a typo falls back to the rotation.
    if (entry.storyId && ctx.storyIds.includes(entry.storyId)) plan.storyId = entry.storyId;
    if (entry.shlokaId && ctx.shlokaIds.includes(entry.shlokaId)) plan.shlokaId = entry.shlokaId;
    if (isGameId(entry.gameType) && games.includes(entry.gameType)) plan.gameType = entry.gameType;
    if (entry.ragaSlot && ['morning', 'afternoon', 'evening', 'night'].includes(entry.ragaSlot))
      plan.ragaSlot = entry.ragaSlot;
    if (entry.promptId && ctx.promptIds.includes(entry.promptId)) plan.promptId = entry.promptId;
  }
  return plan;
}

/**
 * Story IDs unlocked so far: every story the calendar has offered from her first
 * day up to today (plus anything she opened herself, added by the caller).
 * @param contentDay today's pregnancy day (see getDailyPlan)
 */
export function unlockedStoryIds(
  offset: number,
  storyIds: string[],
  contentDay = Math.max(0, offset) + 1,
): string[] {
  const n = storyIds.length;
  const span = Math.max(0, offset) + 1;
  if (span >= n) return [...storyIds];
  const seen = new Set<string>();
  for (let i = 0; i < span; i++) {
    const id = storyIds[contentIndexForDay(contentDay - i, n)];
    if (id) seen.add(id);
  }
  return storyIds.filter((id) => seen.has(id));
}
