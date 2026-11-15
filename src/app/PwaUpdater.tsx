import { useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '@/components/ui/toastContext';
import { logError } from '@/lib/logger';
import { useT } from './useT';

const HOUR = 60 * 60 * 1000;

/** Registers the service worker and shows "A new version is ready ✨ Refresh". */
export function PwaUpdater() {
  const t = useT();
  const toast = useToast();
  const reg = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      reg.current = registration;
      // Check for a new version every hour while the app is open.
      if (registration)
        window.setInterval(() => void registration.update().catch(() => undefined), HOUR);
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

  useEffect(() => {
    if (!needRefresh) return;
    toast({
      message: t('update.ready'),
      duration: 0,
      action: { label: t('update.refresh'), onClick: () => void updateServiceWorker(true) },
    });
  }, [needRefresh, toast, t, updateServiceWorker]);

  useEffect(() => {
    if (!offlineReady) return;
    toast({ message: t('update.offlineReady') });
    setOfflineReady(false);
  }, [offlineReady, setOfflineReady, toast, t]);

  return null;
}
