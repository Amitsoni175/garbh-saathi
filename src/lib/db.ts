/**
 * Local database (IndexedDB via Dexie). Nothing ever leaves the device.
 *
 * MIGRATIONS: never edit an existing version block. To change the schema, add
 * a new `this.version(n + 1).stores({...})` with an `.upgrade()` if data must
 * be transformed. Dexie keeps her data across updates this way.
 *
 * If real IndexedDB can't be opened (some private modes), we switch to an
 * in-memory IndexedDB (fake-indexeddb) so the whole app still works for the
 * session, and `isStorageAvailable()` returns false so the UI shows a banner.
 *
 * `db` is assigned by initStorage(), which main.tsx awaits before rendering.
 */
import Dexie, { type Table } from 'dexie';

export interface KvRow {
  key: string;
  value: unknown;
}

export interface ErrorLogRow {
  id?: number;
  ts: string; // ISO timestamp (a log time, not a calendar date)
  version: string;
  route: string;
  message: string;
  stack?: string;
  source: 'boundary' | 'window' | 'promise' | 'caught';
}

export type CompletionKind =
  | 'shloka'
  | 'story'
  | 'game'
  | 'raga'
  | 'talk'
  | 'tablet'
  | 'mood'
  | 'journal'
  | 'kicks'
  | 'photo'
  | 'mantra'
  | 'breathe'
  | 'song'
  | 'papa'
  | 'yoga'
  | 'thought';

export interface CompletionRow {
  id?: number;
  date: string; // local YYYY-MM-DD
  kind: CompletionKind;
  refId?: string;
  createdAt: number;
}

export type RecordingKind = 'story' | 'song' | 'journal' | 'talk' | 'reflection';

export interface RecordingRow {
  id?: number;
  /** What this recording belongs to, e.g. "story:abhimanyu", "song:my-lori", "journal:12". */
  refId: string;
  kind: RecordingKind;
  /** Who is speaking or singing: mummy, papa, dadi, nani, or a free label. */
  who: string;
  label?: string;
  blob: Blob;
  mime: string;
  durationMs: number;
  createdAt: number;
}

export type JournalKind = 'letter' | 'reflection' | 'talk' | 'godhBharai';

export interface JournalRow {
  id?: number;
  date: string;
  kind: JournalKind;
  text?: string;
  recordingId?: number;
  prompt?: string;
  refId?: string;
  createdAt: number;
}

export interface KickRow {
  id?: number;
  date: string;
  startedAt: number;
  seconds: number;
  count: number;
}

export type PhotoKind = 'belly' | 'godhBharai' | 'sanjhi';

export interface PhotoRow {
  id?: number;
  date: string;
  week: number;
  kind: PhotoKind;
  blob: Blob;
  mime: string;
  note?: string;
  createdAt: number;
}

export interface DailyRow {
  date: string;
  water?: number;
  mood?: number;
  moodNote?: string;
}

export type EventKind = 'doctor' | 'scan' | 'godhBharai' | 'other';

export interface EventRow {
  id?: number;
  date: string;
  time?: string; // HH:MM
  title: string;
  kind: EventKind;
  reminder: boolean;
  notes?: string;
  createdAt: number;
}

export const TABLE_NAMES = [
  'kv',
  'errors',
  'completions',
  'recordings',
  'journal',
  'kicks',
  'photos',
  'daily',
  'events',
] as const;
export type TableName = (typeof TABLE_NAMES)[number];

export class GarbhDB extends Dexie {
  kv!: Table<KvRow, string>;
  errors!: Table<ErrorLogRow, number>;
  completions!: Table<CompletionRow, number>;
  recordings!: Table<RecordingRow, number>;
  journal!: Table<JournalRow, number>;
  kicks!: Table<KickRow, number>;
  photos!: Table<PhotoRow, number>;
  daily!: Table<DailyRow, string>;
  events!: Table<EventRow, number>;

  constructor(name = 'garbh-saathi', options?: ConstructorParameters<typeof Dexie>[1]) {
    super(name, options);
    // v1: Phase 1
    this.version(1).stores({
      kv: 'key',
      errors: '++id, ts',
      completions: '++id, date, kind, [date+kind]',
    });
    // v2: Phases 2–8 (stories, bonding, wellness, calendar). Adds tables only.
    this.version(2).stores({
      recordings: '++id, refId, kind, createdAt',
      journal: '++id, date, kind, createdAt',
      kicks: '++id, date',
      photos: '++id, date, kind',
      daily: 'date',
      events: '++id, date',
    });
  }
}

// Reassigned once by initStorage() if we must fall back to memory.
export let db: GarbhDB = new GarbhDB();

let available: boolean | null = null;
let initPromise: Promise<boolean> | null = null;

async function openInMemory(): Promise<void> {
  const fake = await import('fake-indexeddb');
  db = new GarbhDB('garbh-saathi-memory', {
    indexedDB: fake.indexedDB,
    IDBKeyRange: fake.IDBKeyRange,
  });
  await db.open();
}

/** Opens the DB once. Resolves to false (never throws) if only memory storage is possible. */
export function initStorage(): Promise<boolean> {
  initPromise ??= (async () => {
    try {
      if (typeof indexedDB === 'undefined') throw new Error('IndexedDB missing');
      await db.open();
      available = true;
    } catch (err) {
      console.warn('[db] IndexedDB unavailable, using memory only', err);
      available = false;
      try {
        await openInMemory();
      } catch (memErr) {
        console.error('[db] memory fallback failed', memErr);
      }
    }
    return available;
  })();
  return initPromise;
}

export function isStorageAvailable(): boolean {
  return available !== false;
}

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.kv.get(key);
    return row ? (row.value as T) : fallback;
  } catch (err) {
    console.warn('[db] kvGet failed', key, err);
    return fallback;
  }
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  try {
    await db.kv.put({ key, value });
  } catch (err) {
    console.warn('[db] kvSet failed', key, err);
  }
}
