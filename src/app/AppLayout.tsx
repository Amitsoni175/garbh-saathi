import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { isStorageAvailable } from '@/lib/db';
import { BottomTabBar } from './BottomTabBar';
import { ErrorBoundary } from './ErrorBoundary';
import { HindiVoiceNotice, MiniPlayer } from './MiniPlayer';
import { ReminderScheduler } from './ReminderScheduler';
import { useProfile } from './profile';
import { useSettings } from './settings';
import { TopBar } from './TopBar';
import { useT } from './useT';

function StorageBanner() {
  const t = useT();
  if (isStorageAvailable()) return null;
  return (
    <p role="status" className="rounded-soft bg-accent text-on-fill mx-4 mt-4 p-4 text-sm">
      💛 {t('storage.unavailable')}
    </p>
  );
}

export function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-5xl" aria-hidden="true">
      <span className="animate-breathe">🌸</span>
    </div>
  );
}

/** Shell around every screen: onboarding gate, storage banner, error boundary, mini-player, tabs. */
export function AppLayout() {
  const { pathname } = useLocation();
  const { profile, ready } = useProfile();
  const { ready: settingsReady } = useSettings();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  if (!ready || !settingsReady) return <Splash />;
  const onOnboarding = pathname === '/onboarding';
  if (!profile && !onOnboarding) return <Navigate to="/onboarding" replace />;
  if (profile && onOnboarding) return <Navigate to="/" replace />;

  if (onOnboarding) {
    return (
      <ErrorBoundary>
        <StorageBanner />
        <Outlet />
      </ErrorBoundary>
    );
  }

  return (
    <>
      {/* Website menu: on the home screen everywhere, on every screen on wider screens. */}
      <TopBar className={pathname === '/' ? 'flex' : 'hidden sm:flex'} />
      <div
        className={`mx-auto min-h-dvh max-w-md pb-[calc(9rem+var(--gs-bottom-inset))] ${pathname === '/' ? '' : 'pt-[env(safe-area-inset-top)] sm:pt-0'}`}
      >
        <StorageBanner />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      <MiniPlayer />
      <HindiVoiceNotice />
      <ReminderScheduler />
      <BottomTabBar />
    </>
  );
}
