import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { initStorage } from '@/lib/db';
import { BottomTabBar } from './BottomTabBar';
import { ErrorBoundary } from './ErrorBoundary';
import { useT } from './useT';

function StorageBanner() {
  const t = useT();
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    void initStorage().then((ok) => setUnavailable(!ok));
  }, []);
  if (!unavailable) return null;
  return (
    <p role="status" className="rounded-soft bg-accent text-on-fill mx-4 mt-4 p-4 text-sm">
      💛 {t('storage.unavailable')}
    </p>
  );
}

/** Shell around every tab: storage banner, error boundary per screen, bottom tabs. */
export function AppLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <div className="mx-auto min-h-dvh max-w-md pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <StorageBanner />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      <BottomTabBar />
    </>
  );
}
