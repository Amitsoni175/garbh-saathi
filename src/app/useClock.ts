import { useEffect, useState, useSyncExternalStore } from 'react';
import { getClockVersion, getNow, subscribeClock } from '@/lib/clock';

/**
 * The current (possibly overridden) time, re-rendering every minute and
 * whenever the debug override changes. Use this in components instead of new Date().
 */
export function useNow(): Date {
  const version = useSyncExternalStore(subscribeClock, getClockVersion, getClockVersion);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') setTick((n) => n + 1);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // `version` and `tick` are only here to recompute when they change.
  void version;
  void tick;
  return getNow();
}
