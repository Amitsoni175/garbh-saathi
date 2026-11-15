import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { RouterProvider } from 'react-router';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { router } from './router';
import { SettingsProvider } from './SettingsProvider';
import { useT } from './useT';

function LocalisedToasts({ children }: { children: ReactNode }) {
  const t = useT();
  return <ToastProvider dismissLabel={t('ui.dismiss')}>{children}</ToastProvider>;
}

const loadMotionFeatures = () => import('./motionFeatures').then((mod) => mod.default);

export default function App() {
  return (
    // `strict` makes sure nobody uses the heavy `motion.*` components: use `m.*`.
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <SettingsProvider>
          <LocalisedToasts>
            <RouterProvider router={router} />
          </LocalisedToasts>
        </SettingsProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
