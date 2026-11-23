import { useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '@/components/ui/toastContext';
import { player } from '@/lib/audio';
import {
  AUTO_REFRESH_MS,
  getLastRefresh,
  isRefreshDue,
  isSafeToReload,
  markRefreshed,
} from '@/lib/autoRefresh';
import { logError } from '@/lib/logger';
import { useSettings } from './settings';
import { useT } from './useT';

const CHECK_EVERY = 15 * 60 * 1000; // look at the clock every 15 min; refresh when 6 h have passed

/**
 * Registers the service worker, shows "A new version is ready ✨ Refresh",
 * and (if Auto refresh is on) checks for a new version every 6 hours and
 * applies it quietly at a safe moment.
 */
export function PwaUpdater() {
  const t = useT();
  const toast = useToast();
  const { settings } = useSettings();
  const reg = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const autoApply = useRef(false);
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      reg.current = registration;
    },
    onRegisterError(error) {
      void logError(error);
    },
  });

  // Pull-to-refresh and "Refresh app" also check for updates.
  useEffect(() => {
    const check = () => void reg.current?.update().catch(() => undefined);
    window.addEventListener('gs:check-update', check);
    return () => window.removeEventListener('gs:check-update', check);
  }, []);

  // Auto refresh every 6 hours (checked on a timer and whenever she reopens the app).
  useEffect(() => {
    if (!settings.autoRefresh) {
      autoApply.current = false;
      return;
    }
    const tick = () => {
      const now = Date.now();
      if (!isRefreshDue(getLastRefresh(), now, AUTO_REFRESH_MS)) return;
      markRefreshed(now);
      autoApply.current = true;
      // Today, baby size and the daily plan are recomputed from the clock.
      window.dispatchEvent(new Event('gs:auto-refresh'));
      void reg.current?.update().catch(() => undefined);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    tick();
    const id = window.setInterval(tick, CHECK_EVERY);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [settings.autoRefresh]);

  // A new version is waiting: apply it quietly (auto) or offer it (toast).
  useEffect(() => {
    if (!needRefresh) return;
    if (settings.autoRefresh && autoApply.current) {
      const tryApply = () => {
        const s = player.getState().status;
        if (
          isSafeToReload({
            hidden: document.visibilityState === 'hidden',
            route: window.location.hash,
            audioBusy: s === 'playing' || s === 'loading',
          })
        ) {
          void updateServiceWorker(true);
          return true;
        }
        return false;
      };
      if (tryApply()) return;
      const id = window.setInterval(tryApply, 30_000);
      document.addEventListener('visibilitychange', tryApply);
      window.addEventListener('hashchange', tryApply);
      return () => {
        window.clearInterval(id);
        document.removeEventListener('visibilitychange', tryApply);
        window.removeEventListener('hashchange', tryApply);
      };
    }
    toast({
      message: t('update.ready'),
      duration: 0,
      action: { label: t('update.refresh'), onClick: () => void updateServiceWorker(true) },
    });
  }, [needRefresh, toast, t, updateServiceWorker, settings.autoRefresh]);

  useEffect(() => {
    if (!offlineReady) return;
    toast({ message: t('update.offlineReady') });
    setOfflineReady(false);
  }, [offlineReady, setOfflineReady, toast, t]);

  return null;
}
