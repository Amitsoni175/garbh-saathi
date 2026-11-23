import { describe, expect, it } from 'vitest';
import { AUTO_REFRESH_MS, isRefreshDue, isSafeToReload } from './autoRefresh';

describe('auto refresh', () => {
  it('is due every 6 hours', () => {
    expect(AUTO_REFRESH_MS).toBe(6 * 3600 * 1000);
    expect(isRefreshDue(null, 1000)).toBe(true);
    expect(isRefreshDue(0, AUTO_REFRESH_MS - 1)).toBe(false);
    expect(isRefreshDue(0, AUTO_REFRESH_MS)).toBe(true);
    expect(isRefreshDue(5000, 1000)).toBe(true); // clock went back
    expect(isRefreshDue(Number.NaN, 1000)).toBe(true);
  });

  it('only reloads at a quiet moment', () => {
    expect(isSafeToReload({ hidden: true, route: '#/stories/x', audioBusy: true })).toBe(true);
    expect(isSafeToReload({ hidden: false, route: '#/', audioBusy: false })).toBe(true);
    expect(isSafeToReload({ hidden: false, route: '#/', audioBusy: true })).toBe(false);
    expect(isSafeToReload({ hidden: false, route: '#/stories/x', audioBusy: false })).toBe(false);
  });
});
