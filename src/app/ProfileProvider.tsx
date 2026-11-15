import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { db, kvGet, kvSet } from '@/lib/db';
import { logError } from '@/lib/logger';
import { normaliseProfile, ProfileContext, type Profile } from './profile';

const KEY = 'profile';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  // Latest profile for async callbacks (state updaters run later, so we can't read them back).
  const current = useRef<Profile | null>(null);
  const apply = useCallback((next: Profile | null) => {
    current.current = next;
    setProfile(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    kvGet<unknown>(KEY, null)
      .then((stored) => {
        if (!cancelled) apply(normaliseProfile(stored));
      })
      .catch((err: unknown) => void logError(err))
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    // Restoring a backup rewrites the kv table: pick the new profile up.
    const onRestore = () => {
      void kvGet<unknown>(KEY, null).then((stored) => apply(normaliseProfile(stored)));
    };
    window.addEventListener('gs:data-restored', onRestore);
    return () => {
      cancelled = true;
      window.removeEventListener('gs:data-restored', onRestore);
    };
  }, [apply]);

  const save = useCallback(
    async (next: Profile) => {
      apply(next);
      await kvSet(KEY, next);
    },
    [apply],
  );

  const update = useCallback(
    async (patch: Partial<Profile>) => {
      if (!current.current) return;
      const next = { ...current.current, ...patch };
      apply(next);
      await kvSet(KEY, next);
    },
    [apply],
  );

  const clear = useCallback(async () => {
    apply(null);
    try {
      await db.kv.delete(KEY);
    } catch (err) {
      void logError(err);
    }
  }, [apply]);

  const value = useMemo(
    () => ({ profile, ready, save, update, clear }),
    [profile, ready, save, update, clear],
  );
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
