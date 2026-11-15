import { differenceInCalendarDays } from 'date-fns';
import { getFestivals, type Festival } from './content';
import { parseLocalDate } from './pregnancy';

export interface FestivalOccurrence {
  festival: Festival;
  date: string;
  daysAway: number;
}

/** Festivals today or within the next `within` days (from festivals.json; never computed). */
export function festivalsAround(today: string, within = 3): FestivalOccurrence[] {
  return upcomingFestivals(today).filter((f) => f.daysAway <= within);
}

/** All festival dates from today onwards, soonest first. */
export function upcomingFestivals(today: string): FestivalOccurrence[] {
  const t = parseLocalDate(today);
  if (!t) return [];
  const { list, dates } = getFestivals();
  const out: FestivalOccurrence[] = [];
  for (const d of dates) {
    const festival = list.find((f) => f.id === d.id);
    const date = parseLocalDate(d.date);
    if (!festival || !date) continue;
    const daysAway = differenceInCalendarDays(date, t);
    if (daysAway >= 0) out.push({ festival, date: d.date, daysAway });
  }
  return out.sort((a, b) => a.daysAway - b.daysAway);
}

/** The next date of one festival from today (or undefined if not in festivals.json). */
export function nextDateOf(id: string, today: string): string | undefined {
  return upcomingFestivals(today).find((f) => f.festival.id === id)?.date;
}
