/**
 * Local error log: the last 200 errors with time, app version, route and message.
 * Viewable, copyable and clearable from the debug panel. Never sent anywhere.
 */
import { db, isStorageAvailable, type ErrorLogRow } from './db';

export const MAX_LOG_ENTRIES = 200;
const memoryLog: ErrorLogRow[] = [];

function currentRoute(): string {
  try {
    return window.location.hash || '#/';
  } catch {
    return 'unknown';
  }
}

function toMessage(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) return { message: error.message || error.name, stack: error.stack };
  if (typeof error === 'string') return { message: error };
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

export async function logError(
  error: unknown,
  source: ErrorLogRow['source'] = 'caught',
): Promise<void> {
  const { message, stack } = toMessage(error);
  const row: ErrorLogRow = {
    ts: new Date().toISOString(),
    version: __APP_VERSION__,
    route: currentRoute(),
    message,
    stack,
    source,
  };
  if (import.meta.env.DEV) console.error('[logger]', source, error);
  try {
    if (!isStorageAvailable()) throw new Error('no storage');
    await db.errors.add(row);
    const count = await db.errors.count();
    if (count > MAX_LOG_ENTRIES) {
      const extra = await db.errors
        .orderBy('id')
        .limit(count - MAX_LOG_ENTRIES)
        .primaryKeys();
      await db.errors.bulkDelete(extra);
    }
  } catch {
    memoryLog.push(row);
    if (memoryLog.length > MAX_LOG_ENTRIES) memoryLog.shift();
  }
}

/** Newest first. */
export async function getErrorLog(): Promise<ErrorLogRow[]> {
  try {
    if (!isStorageAvailable()) throw new Error('no storage');
    const rows = await db.errors.orderBy('id').reverse().toArray();
    return [...rows, ...[...memoryLog].reverse()];
  } catch {
    return [...memoryLog].reverse();
  }
}

export async function clearErrorLog(): Promise<void> {
  memoryLog.length = 0;
  try {
    await db.errors.clear();
  } catch {
    // nothing to clear
  }
}

export function formatErrorLog(rows: ErrorLogRow[]): string {
  return rows
    .map(
      (r) =>
        `[${r.ts}] v${r.version} ${r.route} (${r.source})\n${r.message}${r.stack ? `\n${r.stack}` : ''}`,
    )
    .join('\n\n');
}

let installed = false;

/** Catch anything that slips past try/catch and the ErrorBoundaries. */
export function installGlobalErrorHandlers(): void {
  if (installed) return;
  installed = true;
  window.addEventListener('error', (event) => {
    void logError(event.error ?? event.message, 'window');
  });
  window.addEventListener('unhandledrejection', (event) => {
    void logError(event.reason, 'promise');
  });
}
