import { m, useMotionValue, useTransform } from 'motion/react';
import { useRef, useState, type ReactNode } from 'react';
import { useT } from '@/app/useT';

const THRESHOLD = 72;

/** Pull down from the top of the page to recompute today (and check for app updates). */
export function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => void;
  children: ReactNode;
}) {
  const t = useT();
  const startY = useRef<number | null>(null);
  const pull = useMotionValue(0);
  const opacity = useTransform(pull, [0, THRESHOLD], [0, 1]);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div
      onTouchStart={(e) => {
        startY.current = window.scrollY <= 0 ? (e.touches[0]?.clientY ?? null) : null;
      }}
      onTouchMove={(e) => {
        if (startY.current === null) return;
        const dy = (e.touches[0]?.clientY ?? 0) - startY.current;
        const v = Math.max(0, Math.min(110, dy * 0.5));
        pull.set(v);
        setReady(v >= THRESHOLD);
      }}
      onTouchEnd={() => {
        if (startY.current !== null && pull.get() >= THRESHOLD) {
          setRefreshing(true);
          onRefresh();
          window.dispatchEvent(new Event('gs:check-update'));
          window.setTimeout(() => setRefreshing(false), 700);
        }
        startY.current = null;
        pull.set(0);
        setReady(false);
      }}
    >
      <m.div
        style={{ height: pull, opacity }}
        className="text-text-muted flex items-end justify-center overflow-hidden text-sm"
        aria-hidden={!refreshing}
      >
        <span className="pb-2">🌸 {ready ? t('today.pullHint') : ''}</span>
      </m.div>
      {refreshing && (
        <p role="status" className="text-text-muted py-2 text-center text-sm">
          {t('today.refreshing')}
        </p>
      )}
      {children}
    </div>
  );
}
