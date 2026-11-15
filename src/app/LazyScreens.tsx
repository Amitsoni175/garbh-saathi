import { lazy, Suspense } from 'react';

const DebugPanel = lazy(() => import('@/features/settings/DebugPanel'));

function Loading() {
  return (
    <div className="p-10 text-center text-2xl" aria-hidden="true">
      🌸
    </div>
  );
}

/** Screens loaded only when opened, to keep the first load small. */
export function LazyDebugPanel() {
  return (
    <Suspense fallback={<Loading />}>
      <DebugPanel />
    </Suspense>
  );
}
