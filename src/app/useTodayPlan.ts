import { useMemo } from 'react';
import { getShlokas } from '@/lib/content';
import type { DayPlan } from '@/lib/plan';
import { ragaForMoment } from '@/lib/raga';
import { planFor, useJourneyOffset, usePregnancy } from './usePregnancy';
import { useNow } from './useClock';
import { useStories } from './useStories';

/** Today's plan (story, shloka, game, raga, prompt). Story ids fill in once stories load. */
export function useTodayPlan(dayShift = 0): {
  plan: DayPlan | null;
  offset: number;
  dayNumber: number;
} {
  const pregnancy = usePregnancy();
  const offset = useJourneyOffset() + dayShift;
  const stories = useStories();
  const storyIds = useMemo(() => (stories ?? []).map((s) => s.id), [stories]);
  const dayNumber = Math.max(1, (pregnancy?.dayNumber ?? 1) + dayShift);
  const plan = useMemo(
    () => (pregnancy ? planFor(dayNumber, offset, storyIds) : null),
    [pregnancy, dayNumber, offset, storyIds],
  );
  return { plan, offset, dayNumber };
}

export function useRagaNow(dayNumber: number, slot: DayPlan['ragaSlot'] = null) {
  const hour = useNow().getHours();
  return ragaForMoment(hour, dayNumber, slot);
}

export function shlokaById(id: string | undefined) {
  return getShlokas().find((s) => s.id === id);
}
