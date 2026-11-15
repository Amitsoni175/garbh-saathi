/** Letters to baby, reflections and talk recordings (the journal table). */
import { useLiveQuery } from 'dexie-react-hooks';
import { getTodayISO } from './clock';
import { db, type JournalKind, type JournalRow } from './db';
import { logError } from './logger';

export async function addJournalEntry(entry: {
  kind: JournalKind;
  text?: string;
  recordingId?: number;
  prompt?: string;
  refId?: string;
  date?: string;
}): Promise<number | null> {
  try {
    return await db.journal.add({
      date: entry.date ?? getTodayISO(),
      createdAt: Date.now(),
      ...entry,
    });
  } catch (err) {
    void logError(err);
    return null;
  }
}

export function useJournal(kind?: JournalKind): JournalRow[] | undefined {
  return useLiveQuery(async () => {
    const rows = kind
      ? await db.journal.where('kind').equals(kind).toArray()
      : await db.journal.toArray();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  }, [kind]);
}
