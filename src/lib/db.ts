/**
 * Local database (IndexedDB via Dexie). Nothing ever leaves the device.
 *
 * MIGRATIONS: never edit an existing version block. To change the schema, add
 * a new `this.version(n + 1).stores({...})` with an `.upgrade()` if data must
 * be transformed. Dexie keeps her data across updates this way.
 *
 * If IndexedDB is unavailable (some private modes), `kvGet`/`kvSet` fall back
 * to memory and `isStorageAvailable()` returns false so the UI can show a banner.
 */
import Dexie, { type Table } from 'dexie';

export interface KvRow {
  key: string;
  value: unknown;
}

export interface ErrorLogRow {
  id?: number;
  ts: string; // ISO timestamp (this one is fine as UTC: it is a log, not a calendar date)
  version: string;
  route: string;
  message: string;
  stack?: string;
  source: 'boundary' | 'window' | 'promise' | 'caught';
}

export interface CompletionRow {
  id?: number;
  date: string; // local YYYY-MM-DD
  kind: string; // 'shloka' | 'story' | 'game' | 'raga' | 'talk' | 'tablet' | …
  refId?: string;
  createdAt: number;
}

export class GarbhDB extends Dexie {
  kv!: Table<KvRow, string>;
  errors!: Table<ErrorLogRow, number>;
  completions!: Table<CompletionRow, number>;

  constructor(name = 'garbh-saathi') {
    super(name);
    this.version(1).stores({
      kv: 'key',
      errors: '++id, ts',
      completions: '++id, date, kind, [date+kind]',
    });
  }
}

export const db = new GarbhDB();

let available: boolean | null = null;
const memory = new Map<string, unknown>();

/** Opens the DB once. Resolves to false (never throws) if IndexedDB can't be used. */
export async function initStorage(): Promise<boolean> {
  if (available !== null) return available;
  try {
    if (typeof indexedDB === 'undefined') throw new Error('IndexedDB missing');
    await db.open();
    available = true;
  } catch (err) {
    console.warn('[db] IndexedDB unavailable, using memory only', err);
    available = false;
  }
  return available;
}

export function isStorageAvailable(): boolean {
  return available !== false;
}

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  if (available === false) return memory.has(key) ? (memory.get(key) as T) : fallback;
  try {
    const row = await db.kv.get(key);
    return row ? (row.value as T) : fallback;
  } catch (err) {
    console.warn('[db] kvGet failed', key, err);
    return memory.has(key) ? (memory.get(key) as T) : fallback;
  }
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  memory.set(key, value);
  if (available === false) return;
  try {
    await db.kv.put({ key, value });
  } catch (err) {
    console.warn('[db] kvSet failed', key, err);
  }
}

/** Test helper: reset the availability flag and memory store. */
export function __resetStorageForTests(): void {
  available = null;
  memory.clear();
}
