import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  type CompletionRow,
  type DailyRow,
  type EventRow,
  type JournalRow,
  type KickRow,
  type PhotoRow,
} from '@/lib/db';

export interface DayData {
  completions: CompletionRow[];
  journal: JournalRow[];
  kicks: KickRow[];
  photos: PhotoRow[];
  daily?: DailyRow;
  events: EventRow[];
}

function group<T extends { date: string }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const r of rows) map.set(r.date, [...(map.get(r.date) ?? []), r]);
  return map;
}

/** Everything that happened between two local dates, grouped by date. */
export function useRangeData(from: string, to: string): ((date: string) => DayData) | undefined {
  return useLiveQuery(async () => {
    const between = <T>(table: {
      where: (i: string) => {
        between: (a: string, b: string, x: boolean, y: boolean) => { toArray: () => Promise<T[]> };
      };
    }) => table.where('date').between(from, to, true, true).toArray();
    const [completions, journal, kicks, photos, daily, events] = await Promise.all([
      between<CompletionRow>(db.completions),
      between<JournalRow>(db.journal),
      between<KickRow>(db.kicks),
      between<PhotoRow>(db.photos),
      between<DailyRow>(db.daily),
      between<EventRow>(db.events),
    ]);
    const g = {
      completions: group(completions),
      journal: group(journal),
      kicks: group(kicks),
      photos: group(photos),
      events: group(events),
    };
    const dailyMap = new Map(daily.map((d) => [d.date, d]));
    return (date: string): DayData => ({
      completions: g.completions.get(date) ?? [],
      journal: g.journal.get(date) ?? [],
      kicks: g.kicks.get(date) ?? [],
      photos: g.photos.get(date) ?? [],
      daily: dailyMap.get(date),
      events: g.events.get(date) ?? [],
    });
  }, [from, to]);
}
