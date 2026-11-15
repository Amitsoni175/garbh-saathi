import { useMemo } from 'react';
import { useNow } from '@/app/useClock';
import { useCompletionsOn } from '@/lib/activity';
import { toLocalISO } from '@/lib/pregnancy';
import { waterGoal } from '@/lib/season';
import { useDaily } from '@/lib/wellness';

/** Today's tablet / water / mood state. */
export function useCare() {
  const now = useNow();
  const today = toLocalISO(now);
  const daily = useDaily(today);
  const done = useCompletionsOn(today);
  return useMemo(
    () => ({
      today,
      tablet: (done ?? []).some((c) => c.kind === 'tablet'),
      water: daily?.water ?? 0,
      goal: waterGoal(now.getMonth() + 1),
      mood: daily?.mood,
      moodNote: daily?.moodNote,
      month: now.getMonth() + 1,
    }),
    [today, done, daily, now],
  );
}
