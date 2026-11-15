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
      { path: 'music', lazy: lazyScreen(() => import('@/features/music/MusicScreen')) },
      { path: 'music/raga/:id?', lazy: lazyScreen(() => import('@/features/music/RagaScreen')) },
      {
        path: 'music/mantra/:id?',
        lazy: lazyScreen(() => import('@/features/music/MantraScreen')),
      },
      { path: 'music/breathe', lazy: lazyScreen(() => import('@/features/music/BreathingScreen')) },
      { path: 'music/lokgeet', lazy: lazyScreen(() => import('@/features/music/LokGeetScreen')) },
      { path: 'music/sing/:id', lazy: lazyScreen(() => import('@/features/music/KaraokeScreen')) },
      { path: 'me', lazy: lazyScreen(() => import('@/features/settings/MeScreen')) },
      { path: 'me/profile', lazy: lazyScreen(() => import('@/features/settings/ProfileScreen')) },
      { path: 'me/help', lazy: lazyScreen(() => import('@/features/settings/HelpScreen')) },
      {
        path: 'bonding/kicks',
        lazy: lazyScreen(() => import('@/features/bonding/KickCounterScreen')),
      },
      {
        path: 'bonding/journal',
        lazy: lazyScreen(() => import('@/features/bonding/JournalScreen')),
      },
      {
        path: 'bonding/papa',
        lazy: lazyScreen(() => import('@/features/bonding/PapaCornerScreen')),
      },
      { path: 'bonding/photos', lazy: lazyScreen(() => import('@/features/bonding/PhotosScreen')) },
      { path: 'wellness', lazy: lazyScreen(() => import('@/features/wellness/WellnessScreen')) },
      { path: 'festival/:id', lazy: lazyScreen(() => import('@/features/haryana/FestivalScreen')) },
      {
        path: 'festivals',
        lazy: lazyScreen(() => import('@/features/haryana/FestivalListScreen')),
      },
      {
        path: 'me/godh-bharai',
        lazy: lazyScreen(() => import('@/features/haryana/GodhBharaiScreen')),
      },
      {
        path: 'after-birth',
        lazy: lazyScreen(() => import('@/features/haryana/AfterBirthScreen')),
      },
      { path: 'me/backup', lazy: lazyScreen(() => import('@/features/settings/BackupScreen')) },
      { path: 'me/keepsake', lazy: lazyScreen(() => import('@/features/settings/KeepsakeScreen')) },
      { path: 'me/schedule', lazy: lazyScreen(() => import('@/features/schedule/ScheduleScreen')) },
      { path: 'me/debug', lazy: lazyScreen(() => import('@/features/settings/DebugPanel')) },
      { path: '*', element: <TodayScreen /> },
    ],
  },
]);
