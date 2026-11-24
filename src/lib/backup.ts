/**
 * Backup & restore: one .json file with everything (photos and recordings are
 * base64-encoded inside it). Restoring validates first, shows a summary, and
 * only then replaces the data in one transaction (all or nothing).
 */
import { db, kvGet, kvSet, TABLE_NAMES, type TableName } from './db';
import { logError } from './logger';

export const BACKUP_FORMAT = 1;
/** New backups say 'wombtales'; backups made before the rename say 'garbh-saathi'. */
const APP_ID = 'wombtales';
const OLD_APP_IDS: readonly string[] = ['garbh-saathi'];
/** The error log stays on the device; everything else is backed up. */
const BACKUP_TABLES = TABLE_NAMES.filter((t) => t !== 'errors') as Exclude<TableName, 'errors'>[];

export interface EncodedBlob {
  __blob: string; // data URL
  type: string;
}

export interface BackupFile {
  app: string;
  format: number;
  appVersion: string;
  exportedAt: string;
  tables: Partial<Record<TableName, unknown[]>>;
}

export interface BackupSummary {
  exportedAt: string;
  journal: number;
  photos: number;
  recordings: number;
  completions: number;
  events: number;
  kicks: number;
}

// ---------- Blob <-> data URL ----------

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('read failed'));
    reader.readAsDataURL(blob);
  });
}

export function dataUrlToBlob(dataUrl: string, type?: string): Blob {
  // The type can contain parameters, e.g. data:audio/webm;codecs=opus;base64,....
  const match = /^data:([^,]*?)(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('Not a data URL');
  const mime = type || match[1] || 'application/octet-stream';
  const payload = match[3] ?? '';
  if (!match[2]) return new Blob([decodeURIComponent(payload)], { type: mime });
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

const isEncodedBlob = (x: unknown): x is EncodedBlob =>
  typeof x === 'object' && x !== null && typeof (x as EncodedBlob).__blob === 'string';

async function encodeRow(row: Record<string, unknown>): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] =
      v instanceof Blob
        ? ({ __blob: await blobToDataUrl(v), type: v.type } satisfies EncodedBlob)
        : v;
  }
  return out;
}

function decodeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row))
    out[k] = isEncodedBlob(v) ? dataUrlToBlob(v.__blob, v.type) : v;
  return out;
}

// ---------- Export ----------

export async function createBackup(appVersion: string, now = new Date()): Promise<BackupFile> {
  const tables: BackupFile['tables'] = {};
  for (const name of BACKUP_TABLES) {
    const rows = (await db.table(name).toArray()) as Record<string, unknown>[];
    tables[name] = await Promise.all(rows.map(encodeRow));
  }
  return { app: APP_ID, format: BACKUP_FORMAT, appVersion, exportedAt: now.toISOString(), tables };
}

export function backupFileName(localDate: string): string {
  return `wombtales-backup-${localDate}.json`;
}

export async function markBackedUp(now = new Date()): Promise<void> {
  await kvSet('lastBackupAt', now.toISOString());
}

export async function lastBackupAt(): Promise<string | null> {
  return kvGet<string | null>('lastBackupAt', null);
}

// ---------- Validate + restore ----------

export type ParseResult =
  { ok: true; file: BackupFile; summary: BackupSummary } | { ok: false; reason: string };

export function parseBackup(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'not JSON' };
  }
  if (typeof data !== 'object' || data === null) return { ok: false, reason: 'not an object' };
  const f = data as Partial<BackupFile>;
  if (f.app !== APP_ID && !OLD_APP_IDS.includes(f.app ?? ''))
    return { ok: false, reason: 'not a Wombtales backup' };
  if (typeof f.format !== 'number' || f.format > BACKUP_FORMAT)
    return { ok: false, reason: 'made by a newer version of the app' };
  if (typeof f.tables !== 'object' || f.tables === null) return { ok: false, reason: 'no tables' };
  for (const [name, rows] of Object.entries(f.tables)) {
    if (!(TABLE_NAMES as readonly string[]).includes(name))
      return { ok: false, reason: `unknown table ${name}` };
    if (!Array.isArray(rows) || rows.some((r) => typeof r !== 'object' || r === null))
      return { ok: false, reason: `bad rows in ${name}` };
  }
  const count = (t: TableName) => (f.tables?.[t] as unknown[] | undefined)?.length ?? 0;
  return {
    ok: true,
    file: f as BackupFile,
    summary: {
      exportedAt: f.exportedAt ?? '',
      journal: count('journal'),
      photos: count('photos'),
      recordings: count('recordings'),
      completions: count('completions'),
      events: count('events'),
      kicks: count('kicks'),
    },
  };
}

/** Replace the current data with the backup, in one transaction (all or nothing). */
export async function restoreBackup(file: BackupFile): Promise<boolean> {
  try {
    const decoded = Object.fromEntries(
      Object.entries(file.tables).map(([name, rows]) => [
        name,
        (rows as Record<string, unknown>[]).map(decodeRow),
      ]),
    ) as Partial<Record<TableName, Record<string, unknown>[]>>;
    const tables = BACKUP_TABLES.map((n) => db.table(n));
    await db.transaction('rw', tables, async () => {
      for (const name of BACKUP_TABLES) {
        const rows = decoded[name];
        if (!rows) continue; // a table missing from the file is left as it is
        await db.table(name).clear();
        if (rows.length) await db.table(name).bulkAdd(rows);
      }
    });
    window.dispatchEvent(new Event('gs:data-restored'));
    return true;
  } catch (err) {
    void logError(err);
    return false;
  }
}

/** Wipe everything (debug panel only, after double confirmation). */
export async function wipeAllData(): Promise<void> {
  await db.transaction(
    'rw',
    TABLE_NAMES.map((n) => db.table(n)),
    async () => {
      for (const name of TABLE_NAMES) await db.table(name).clear();
    },
  );
}
