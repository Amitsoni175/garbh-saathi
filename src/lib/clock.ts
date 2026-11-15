/**
 * The app's single source of "now". Never call `new Date()` for app logic:
 * use getToday() / getNow() so the debug panel can pretend it is any day or time.
 *
 * The override lives in localStorage (not IndexedDB) because it must be read
 * synchronously at startup.
 */
import { parseLocalDate, toLocalISO } from './pregnancy';

const DATE_KEY = 'gs.debug.dateOverride'; // "YYYY-MM-DD"
const TIME_KEY = 'gs.debug.timeOverride'; // "HH:MM"
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode): the override simply won't persist.
  }
}

function emit(): void {
  version += 1;
  listeners.forEach((l) => l());
}

export interface ClockOverride {
  date: string | null;
  time: string | null;
}

export function getClockOverride(): ClockOverride {
  const date = readStorage(DATE_KEY);
  const time = readStorage(TIME_KEY);
  return {
    date: date && parseLocalDate(date) ? date : null,
    time: time && TIME_RE.test(time) ? time : null,
  };
}

/** Pass null to clear. Invalid values are ignored. */
export function setDateOverride(date: string | null): void {
  if (date !== null && !parseLocalDate(date)) return;
  writeStorage(DATE_KEY, date);
  emit();
}

export function setTimeOverride(time: string | null): void {
  if (time !== null && !TIME_RE.test(time)) return;
  writeStorage(TIME_KEY, time);
  emit();
}

/** Current date and time, honouring any debug override. */
export function getNow(real: Date = new Date()): Date {
  const { date, time } = getClockOverride();
  const now = new Date(real);
  if (date) {
    const d = parseLocalDate(date);
    if (d) now.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (time) {
    const [h, m] = time.split(':').map(Number);
    now.setHours(h ?? 0, m ?? 0, 0, 0);
  }
  return now;
}

/** Today at local midnight, honouring any debug override. */
export function getToday(real: Date = new Date()): Date {
  const now = getNow(real);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getTodayISO(): string {
  return toLocalISO(getToday());
}

/** For useSyncExternalStore: changes whenever the override changes. */
export function subscribeClock(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getClockVersion(): number {
  return version;
}
