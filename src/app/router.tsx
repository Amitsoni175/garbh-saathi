import { createHashRouter, type RouteObject } from 'react-router';
import TodayScreen from '@/features/home/TodayScreen';
import { AppLayout, Splash } from './AppLayout';
import { RouteErrorFallback } from './ErrorBoundary';

/** Lazy screen: loaded the first time she opens it (keeps the first load small). */
const lazyScreen =
  (load: () => Promise<{ default: React.ComponentType }>): RouteObject['lazy'] =>
  async () => ({ Component: (await load()).default });

/**
 * Hash routing (#/calendar) so the app works on any static host, including
 * GitHub Pages, and offline, with no server rewrites needed.
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    hydrateFallbackElement: <Splash />,
    children: [
      { index: true, element: <TodayScreen /> },
      {
        path: 'onboarding',
        lazy: lazyScreen(() => import('@/features/onboarding/OnboardingScreen')),
      },
      { path: 'shloka/:id?', lazy: lazyScreen(() => import('@/features/home/ShlokaScreen')) },
      { path: 'stories', lazy: lazyScreen(() => import('@/features/stories/StoryLibraryScreen')) },
      {
        path: 'stories/:id',
        lazy: lazyScreen(() => import('@/features/stories/StoryPlayerScreen')),
      },
      { path: 'talk', lazy: lazyScreen(() => import('@/features/bonding/TalkScreen')) },
      { path: 'garden', lazy: lazyScreen(() => import('@/features/garden/GardenScreen')) },
      { path: 'calendar', lazy: lazyScreen(() => import('@/features/calendar/CalendarScreen')) },
      { path: 'play', lazy: lazyScreen(() => import('@/features/games/PlayScreen')) },
      { path: 'play/:gameId', lazy: lazyScreen(() => import('@/features/games/GameScreen')) },
      { path: 'me', lazy: lazyScreen(() => import('@/features/settings/MeScreen')) },
      { path: 'me/debug', lazy: lazyScreen(() => import('@/features/settings/DebugPanel')) },
      { path: '*', element: <TodayScreen /> },
    ],
  },
]);
