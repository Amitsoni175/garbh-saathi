/**
 * Auto refresh: every 6 hours the app looks for a new version (new stories,
 * games, fixes). If one is found it is applied quietly at a safe moment:
 * when the app is in the background, when she comes back to it, or while
 * she is on the Today screen with nothing playing. Never mid-story.
 */
export const AUTO_REFRESH_MS = 6 * 60 * 60 * 1000;
const KEY = 'gs:lastAutoRefresh';

export function isRefreshDue(
  last: number | null,
  now: number,
  interval = AUTO_REFRESH_MS,
): boolean {
  if (last === null || !Number.isFinite(last)) return true;
  // A clock that went backwards (or a bad value) also counts as due.
  return now - last >= interval || now < last;
}

export function getLastRefresh(): number | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

export function markRefreshed(now: number): void {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {
    // storage blocked: we will simply check again next time
  }
}

/** Is this a quiet moment to reload the app? */
export function isSafeToReload(opts: {
  hidden: boolean;
  route: string;
  audioBusy: boolean;
}): boolean {
  if (opts.hidden) return true;
  const onToday = opts.route === '' || opts.route === '#' || opts.route === '#/';
  return onToday && !opts.audioBusy;
}
