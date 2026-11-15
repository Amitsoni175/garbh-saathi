/**
 * Daily rhythm and reminders (pure functions). Times are local "HH:MM".
 * Wording is always gentle: "Story time with your little one?", never "Task pending".
 */
import { addDays } from 'date-fns';
import type { EventRow } from './db';
import { parseLocalDate, toLocalISO } from './pregnancy';

export type ReminderId = 'shloka' | 'tablet' | 'story' | 'game' | 'night';

export interface ScheduleItem {
  id: ReminderId;
  time: string;
  enabled: boolean;
}

export interface ScheduleSettings {
  items: ScheduleItem[];
  water: { enabled: boolean; everyHours: 2 | 3; from: string; to: string };
  kicks: { enabled: boolean; time: string };
  /** In-app / system notifications (needs permission). The .ics export works without this. */
  notifications: boolean;
}

export const DEFAULT_SCHEDULE: ScheduleSettings = {
  items: [
    { id: 'shloka', time: '07:00', enabled: true },
    { id: 'tablet', time: '09:00', enabled: true },
    { id: 'story', time: '13:00', enabled: true },
    { id: 'game', time: '17:00', enabled: true },
    { id: 'night', time: '21:00', enabled: true },
  ],
  water: { enabled: false, everyHours: 2, from: '08:00', to: '20:00' },
  kicks: { enabled: true, time: '19:00' },
  notifications: false,
};

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const isTime = (x: unknown): x is string => typeof x === 'string' && TIME_RE.test(x);

export function normaliseSchedule(stored: unknown): ScheduleSettings {
  const out: ScheduleSettings = structuredClone(DEFAULT_SCHEDULE);
  if (!stored || typeof stored !== 'object') return out;
  const s = stored as Partial<ScheduleSettings>;
  if (Array.isArray(s.items)) {
    for (const item of out.items) {
      const found = s.items.find((x) => x && x.id === item.id);
      if (found) {
        if (isTime(found.time)) item.time = found.time;
        if (typeof found.enabled === 'boolean') item.enabled = found.enabled;
      }
    }
  }
  if (s.water && typeof s.water === 'object') {
    if (typeof s.water.enabled === 'boolean') out.water.enabled = s.water.enabled;
    if (s.water.everyHours === 2 || s.water.everyHours === 3)
      out.water.everyHours = s.water.everyHours;
    if (isTime(s.water.from)) out.water.from = s.water.from;
    if (isTime(s.water.to)) out.water.to = s.water.to;
  }
  if (s.kicks && typeof s.kicks === 'object') {
    if (typeof s.kicks.enabled === 'boolean') out.kicks.enabled = s.kicks.enabled;
    if (isTime(s.kicks.time)) out.kicks.time = s.kicks.time;
  }
  if (typeof s.notifications === 'boolean') out.notifications = s.notifications;
  return out;
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const fromMinutes = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Water reminder times between `from` and `to`, every N hours. */
export function waterTimes(water: ScheduleSettings['water']): string[] {
  const out: string[] = [];
  const end = toMinutes(water.to);
  for (let m = toMinutes(water.from); m <= end; m += water.everyHours * 60)
    out.push(fromMinutes(m));
  return out;
}

export type ReminderKind = ReminderId | 'water' | 'kicks' | 'event';

export interface Reminder {
  key: string; // unique per day, e.g. "story" or "water-10:00" or "event-12"
  kind: ReminderKind;
  time: string; // HH:MM
  title?: string; // for events
}

/** Kick-count reminders are suggested from week 28. */
export const KICKS_FROM_WEEK = 28;

/** Every reminder for one day, sorted by time. */
export function remindersForDay(
  schedule: ScheduleSettings,
  week: number,
  events: Pick<EventRow, 'id' | 'time' | 'title' | 'reminder'>[] = [],
): Reminder[] {
  const list: Reminder[] = schedule.items
    .filter((i) => i.enabled)
    .map((i) => ({ key: i.id, kind: i.id, time: i.time }));
  if (schedule.water.enabled)
    waterTimes(schedule.water).forEach((time) =>
      list.push({ key: `water-${time}`, kind: 'water', time }),
    );
  if (schedule.kicks.enabled && week >= KICKS_FROM_WEEK)
    list.push({ key: 'kicks', kind: 'kicks', time: schedule.kicks.time });
  for (const e of events) {
    if (!e.reminder) continue;
    // Timed events remind an hour before; all-day events at 08:00.
    const time =
      e.time && isTime(e.time) ? fromMinutes(Math.max(0, toMinutes(e.time) - 60)) : '08:00';
    list.push({ key: `event-${e.id ?? e.title}`, kind: 'event', time, title: e.title });
  }
  return list.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
}

/** "Coming up next": reminders later today (inclusive of the current minute). */
export function upcoming(all: Reminder[], now: Date, limit = 3): Reminder[] {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return all.filter((r) => toMinutes(r.time) >= nowMin).slice(0, limit);
}

/** Reminders whose time is in (afterMinute, nowMinute]: used by the in-app scheduler. */
export function dueBetween(all: Reminder[], afterMinute: number, nowMinute: number): Reminder[] {
  return all.filter((r) => {
    const m = toMinutes(r.time);
    return m > afterMinute && m <= nowMinute;
  });
}

/** Last date the recurring calendar reminders run: two weeks after the due date. */
export function scheduleEndDate(edd: string): string {
  const d = parseLocalDate(edd);
  return d ? toLocalISO(addDays(d, 14)) : edd;
}
