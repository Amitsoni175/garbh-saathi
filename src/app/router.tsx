import { createHashRouter } from 'react-router';
import CalendarScreen from '@/features/calendar/CalendarScreen';
import PlayScreen from '@/features/games/PlayScreen';
import TodayScreen from '@/features/home/TodayScreen';
import MeScreen from '@/features/settings/MeScreen';
import { AppLayout } from './AppLayout';
import { RouteErrorFallback } from './ErrorBoundary';
import { LazyDebugPanel } from './LazyScreens';

/**
 * Hash routing (#/calendar) so the app works on any static host, including
 * GitHub Pages, and offline, with no server rewrites needed.
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <TodayScreen /> },
      { path: 'calendar', element: <CalendarScreen /> },
      { path: 'play', element: <PlayScreen /> },
      { path: 'me', element: <MeScreen /> },
      { path: 'me/debug', element: <LazyDebugPanel /> },
      { path: '*', element: <TodayScreen /> },
    ],
  },
]);
