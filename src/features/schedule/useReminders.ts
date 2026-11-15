import { useLiveQuery } from 'dexie-react-hooks';
import { useSettings } from '@/app/settings';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { useNow } from '@/app/useClock';
import { db } from '@/lib/db';
import { toLocalISO } from '@/lib/pregnancy';
import { remindersForDay, type Reminder } from '@/lib/schedule';

/** Today's reminders (schedule + her events), plus a gentle label for each. */
export function useTodayReminders(): { all: Reminder[]; label: (r: Reminder) => string } {
  const t = useT();
  const { settings } = useSettings();
  const state = usePregnancy();
  const today = toLocalISO(useNow());
  const events = useLiveQuery(() => db.events.where('date').equals(today).toArray(), [today]) ?? [];
  const all = remindersForDay(settings.schedule, state?.weeks ?? 0, events);
  const label = (r: Reminder) =>
    r.kind === 'event' ? t('remind.event', { title: r.title ?? '' }) : t(`remind.${r.kind}`);
  return { all, label };
}
