import { addDays } from 'date-fns';
import { useMemo } from 'react';
import { usePregnancy } from '@/app/usePregnancy';
import { useAllCompletions } from '@/lib/activity';
import { getFestivals } from '@/lib/content';
import { FESTIVAL_ITEMS, gardenStage, milestonesReached, summarise } from '@/lib/garden';
import { getToday } from '@/lib/clock';
import { toLocalISO } from '@/lib/pregnancy';

/** Everything the garden needs, derived from completions and the current week. */
export function useGarden() {
  const state = usePregnancy();
  const rows = useAllCompletions();
  return useMemo(() => {
    const week = state?.weeks ?? 0;
    const list = rows ?? [];
    const today = getToday();
    const weekStart = toLocalISO(addDays(today, -(state?.days ?? 0)));
    const todayISO = toLocalISO(today);
    const thisWeek = list.filter((r) => r.date >= weekStart && r.date <= todayISO);
    const activeDates = new Set(list.map((r) => r.date));
    const festivalTreasures = getFestivals()
      .dates.filter((f) => activeDates.has(f.date) && FESTIVAL_ITEMS[f.id])
      .map((f) => ({ id: `${f.id}-${f.date}`, emoji: FESTIVAL_ITEMS[f.id] as string }));
    return {
      loading: rows === undefined,
      week,
      stage: gardenStage(week),
      completions: list,
      count: list.length,
      milestones: milestonesReached(week),
      festivalTreasures,
      weekSummary: summarise(thisWeek),
    };
  }, [rows, state]);
}
