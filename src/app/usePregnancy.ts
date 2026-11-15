import { differenceInCalendarDays } from 'date-fns';
import { useMemo } from 'react';
import { getExplicitPlan, getPrompts, getShlokas } from '@/lib/content';
import { getDailyPlan, type DayPlan } from '@/lib/plan';
import { computePregnancy, parseLocalDate, toLocalISO, type PregnancyState } from '@/lib/pregnancy';
import { useProfile } from './profile';
import { useNow } from './useClock';

/** Pregnancy state for "today" (honours the debug clock), or null before onboarding. */
export function usePregnancy(): PregnancyState | null {
  const { profile } = useProfile();
  const now = useNow();
  const todayISO = toLocalISO(now);
  return useMemo(() => {
    if (!profile) return null;
    const today = parseLocalDate(todayISO);
    return today ? computePregnancy(profile.lmp, today) : null;
  }, [profile, todayISO]);
}

/** Days since she started (0 on her first day). */
export function useJourneyOffset(): number {
  const { profile } = useProfile();
  const todayISO = toLocalISO(useNow());
  if (!profile) return 0;
  const start = parseLocalDate(profile.startDate);
  const today = parseLocalDate(todayISO);
  return start && today ? differenceInCalendarDays(today, start) : 0;
}

export function planFor(dayNumber: number, offset: number, storyIds: string[]): DayPlan {
  const prompts = getPrompts();
  return getDailyPlan(dayNumber, offset, {
    storyIds,
    shlokaIds: getShlokas().map((s) => s.id),
    promptIds: prompts.talk.map((p) => p.id),
    papaIds: prompts.papa.map((p) => p.id),
    journalIds: prompts.journal.map((p) => p.id),
    explicit: getExplicitPlan(),
  });
}
