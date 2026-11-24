/**
 * .ics calendar export: recurring daily reminders with alarms (VALARM) and her
 * own events. Importing this into Google Calendar / iPhone Calendar is the most
 * reliable way to get reminders, because web apps can't schedule alarms while closed.
 */
import { parseLocalDate, toLocalISO } from './pregnancy';
import { isTime, type ScheduleSettings, waterTimes } from './schedule';

export interface IcsEvent {
  uid: string;
  summary: string;
  description?: string;
  /** Local date YYYY-MM-DD. */
  date: string;
  /** Local HH:MM, or undefined for an all-day event. */
  time?: string;
  durationMinutes?: number;
  /** Repeat daily until this local date (inclusive). */
  repeatUntil?: string;
  /** Minutes before the start for the alarm; undefined = no alarm. */
  alarmMinutesBefore?: number;
}

const TZID = 'Asia/Kolkata';

/** Escape text per RFC 5545. */
export function escapeText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Fold lines longer than 75 octets (UTF-8 bytes), never splitting a character. */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = encoder.encode(ch).length;
    if (bytes + b > limit) {
      parts.push(current);
      current = '';
      bytes = 0;
      limit = 74; // continuation lines start with a space
    }
    current += ch;
    bytes += b;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

const compactDate = (iso: string) => iso.replace(/-/g, '');
const compactTime = (hhmm: string) => `${hhmm.replace(':', '')}00`;

function utcStamp(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/** Local IST date at 23:59:59 as a UTC UNTIL value (IST is UTC+5:30 all year). */
function untilUtc(localDate: string): string {
  const d = parseLocalDate(localDate);
  if (!d) return `${compactDate(localDate)}T182959Z`;
  return `${compactDate(localDate)}T182959Z`;
}

function nextDay(iso: string): string {
  const d = parseLocalDate(iso);
  if (!d) return iso;
  return toLocalISO(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
}

export function buildIcs(events: IcsEvent[], now: Date = new Date()): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wombtales//Pregnancy companion//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Wombtales',
    `X-WR-TIMEZONE:${TZID}`,
    'BEGIN:VTIMEZONE',
    `TZID:${TZID}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
  const stamp = utcStamp(now);
  for (const e of events) {
    lines.push('BEGIN:VEVENT', `UID:${e.uid}`, `DTSTAMP:${stamp}`);
    if (e.time && isTime(e.time)) {
      lines.push(
        `DTSTART;TZID=${TZID}:${compactDate(e.date)}T${compactTime(e.time)}`,
        `DURATION:PT${e.durationMinutes ?? 10}M`,
      );
    } else {
      lines.push(
        `DTSTART;VALUE=DATE:${compactDate(e.date)}`,
        `DTEND;VALUE=DATE:${compactDate(nextDay(e.date))}`,
      );
    }
    if (e.repeatUntil) lines.push(`RRULE:FREQ=DAILY;UNTIL=${untilUtc(e.repeatUntil)}`);
    lines.push(`SUMMARY:${escapeText(e.summary)}`);
    if (e.description) lines.push(`DESCRIPTION:${escapeText(e.description)}`);
    if (e.alarmMinutesBefore !== undefined) {
      const trigger = e.alarmMinutesBefore === 0 ? 'PT0M' : `-PT${e.alarmMinutesBefore}M`;
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(e.summary)}`,
        `TRIGGER:${trigger}`,
        'END:VALARM',
      );
    }
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

export interface ScheduleIcsInput {
  schedule: ScheduleSettings;
  labels: Record<string, string>; // reminder id → gentle text
  startDate: string; // today
  endDate: string; // EDD + 14 days
  kicksStartDate: string; // week 28 date (or today if later)
  events: {
    id?: number;
    date: string;
    time?: string;
    title: string;
    notes?: string;
    reminder: boolean;
  }[];
}

/** Turn her schedule + own events into .ics events. */
export function scheduleToIcsEvents(input: ScheduleIcsInput): IcsEvent[] {
  const out: IcsEvent[] = [];
  const { schedule, labels } = input;
  for (const item of schedule.items) {
    if (!item.enabled) continue;
    out.push({
      uid: `gs-${item.id}@garbh-saathi`,
      summary: labels[item.id] ?? item.id,
      date: input.startDate,
      time: item.time,
      repeatUntil: input.endDate,
      alarmMinutesBefore: 0,
    });
  }
  if (schedule.water.enabled) {
    for (const time of waterTimes(schedule.water)) {
      out.push({
        uid: `gs-water-${time.replace(':', '')}@garbh-saathi`,
        summary: labels.water ?? 'Water',
        date: input.startDate,
        time,
        durationMinutes: 5,
        repeatUntil: input.endDate,
        alarmMinutesBefore: 0,
      });
    }
  }
  if (schedule.kicks.enabled && input.kicksStartDate <= input.endDate) {
    out.push({
      uid: 'gs-kicks@garbh-saathi',
      summary: labels.kicks ?? 'Kick count',
      date: input.kicksStartDate,
      time: schedule.kicks.time,
      durationMinutes: 30,
      repeatUntil: input.endDate,
      alarmMinutesBefore: 0,
    });
  }
  for (const e of input.events) {
    out.push({
      uid: `gs-event-${e.id ?? e.title}-${e.date}@garbh-saathi`,
      summary: e.title,
      description: e.notes,
      date: e.date,
      time: e.time,
      durationMinutes: 60,
      alarmMinutesBefore: e.reminder ? (e.time ? 60 : 15 * 60) : undefined,
    });
  }
  return out;
}
