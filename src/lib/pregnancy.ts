/**
 * ALL pregnancy date maths lives here. Every function is pure and takes an
 * explicit `today`, so it can be unit-tested and overridden from the debug panel.
 *
 * Dates are stored as local "YYYY-MM-DD" strings, never UTC timestamps.
 * Always use parseLocalDate / toLocalISO; never `new Date('2026-01-01')`
 * (that parses as UTC) or `date.toISOString()` (that converts to UTC, which
 * shows yesterday's date between 00:00 and 05:30 in IST).
 */
import { addDays, differenceInCalendarDays, isValid } from 'date-fns';

export const PREGNANCY_DAYS = 280;
const MAX_LMP_AGE_DAYS = 300;
const MAX_EDD_AHEAD_DAYS = 300;
const MAX_EDD_PAST_DAYS = 30;

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse "YYYY-MM-DD" as a local calendar date (midnight local time). Returns null if invalid. */
export function parseLocalDate(value: string): Date | null {
  const m = ISO_RE.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  // Reject roll-overs such as 2026-02-31 → 3 March.
  if (
    !isValid(date) ||
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

/** Format a Date as a local "YYYY-MM-DD" string (uses local fields, not UTC). */
export function toLocalISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Naegele's rule: EDD = LMP + 280 days. */
export function eddFromLmp(lmp: string): string {
  const date = parseLocalDate(lmp);
  if (!date) throw new Error(`Invalid LMP date: ${lmp}`);
  return toLocalISO(addDays(date, PREGNANCY_DAYS));
}

/** Naegele's rule reversed: LMP = EDD − 280 days. */
export function lmpFromEdd(edd: string): string {
  const date = parseLocalDate(edd);
  if (!date) throw new Error(`Invalid EDD date: ${edd}`);
  return toLocalISO(addDays(date, -PREGNANCY_DAYS));
}

export type DateKind = 'lmp' | 'edd';

export type DateInputError =
  'invalidDate' | 'lmpInFuture' | 'lmpTooOld' | 'eddTooFarAhead' | 'eddTooFarPast';

export type DateInputResult =
  { ok: true; lmp: string; edd: string } | { ok: false; error: DateInputError };

/**
 * Check what she entered and turn it into an LMP + EDD pair.
 * Error codes map to gentle messages in i18n.ts (`dateError.<code>`).
 */
export function resolveDateInput(kind: DateKind, value: string, today: Date): DateInputResult {
  const date = parseLocalDate(value);
  if (!date) return { ok: false, error: 'invalidDate' };

  const diff = differenceInCalendarDays(date, today); // positive = in the future

  if (kind === 'lmp') {
    if (diff > 0) return { ok: false, error: 'lmpInFuture' };
    if (-diff > MAX_LMP_AGE_DAYS) return { ok: false, error: 'lmpTooOld' };
    return { ok: true, lmp: toLocalISO(date), edd: eddFromLmp(toLocalISO(date)) };
  }

  if (diff > MAX_EDD_AHEAD_DAYS) return { ok: false, error: 'eddTooFarAhead' };
  if (-diff > MAX_EDD_PAST_DAYS) return { ok: false, error: 'eddTooFarPast' };
  return { ok: true, lmp: lmpFromEdd(toLocalISO(date)), edd: toLocalISO(date) };
}

export type Trimester = 1 | 2 | 3;

/**
 * - `early`:   before the LMP date (only possible if a scan-revised EDD is > 280 days away)
 * - `normal`:  weeks 0–39
 * - `anyDay`:  40 completed weeks or more → "Any day now 💛"
 * - `overdue`: 42 completed weeks or more → "Has your little one arrived?"
 */
export type PregnancyStage = 'early' | 'normal' | 'anyDay' | 'overdue';

export interface PregnancyState {
  lmp: string;
  edd: string;
  /** Days since LMP. Can be negative only in the `early` stage. */
  gestationalDays: number;
  /** Completed weeks (never below 0). Shown as "Week {weeks} · Day {days}". */
  weeks: number;
  /** Days into the current week, 0–6. */
  days: number;
  /** The week she is currently in, 1–42. Used to pick weekly content. */
  contentWeek: number;
  trimester: Trimester;
  /** Days until the EDD, never below 0. */
  daysToGo: number;
  /** 0–100, rounded to one decimal. */
  percent: number;
  /** Day of the journey, 1–280. Used to pick the daily plan. */
  dayNumber: number;
  stage: PregnancyStage;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function trimesterForWeeks(weeks: number): Trimester {
  if (weeks <= 13) return 1;
  if (weeks <= 27) return 2;
  return 3;
}

/** Compute everything the screens need from a stored LMP and "today". */
export function computePregnancy(lmp: string, today: Date): PregnancyState {
  const lmpDate = parseLocalDate(lmp);
  if (!lmpDate) throw new Error(`Invalid LMP date: ${lmp}`);

  const gestationalDays = differenceInCalendarDays(today, lmpDate);
  const safeDays = Math.max(0, gestationalDays);
  const weeks = Math.floor(safeDays / 7);
  const days = safeDays % 7;
  const edd = eddFromLmp(lmp);

  let stage: PregnancyStage = 'normal';
  if (gestationalDays < 0) stage = 'early';
  else if (weeks >= 42) stage = 'overdue';
  else if (weeks >= 40) stage = 'anyDay';

  return {
    lmp,
    edd,
    gestationalDays,
    weeks,
    days,
    contentWeek: clamp(weeks + 1, 1, 42),
    trimester: trimesterForWeeks(weeks),
    daysToGo: Math.max(0, PREGNANCY_DAYS - gestationalDays),
    percent: Math.round(clamp((safeDays / PREGNANCY_DAYS) * 100, 0, 100) * 10) / 10,
    dayNumber: clamp(safeDays + 1, 1, PREGNANCY_DAYS),
    stage,
  };
}

/** For the debug "Jump to week" slider: the date on which she would be at `week` weeks + `day` days. */
export function dateForWeek(lmp: string, week: number, day = 0): string {
  const lmpDate = parseLocalDate(lmp);
  if (!lmpDate) throw new Error(`Invalid LMP date: ${lmp}`);
  return toLocalISO(addDays(lmpDate, week * 7 + day));
}
