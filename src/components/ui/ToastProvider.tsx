import { AnimatePresence, m } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastOptions } from './toastContext';

interface ActiveToast extends ToastOptions {
  id: number;
}

/** Soft toast that floats above the tab bar. One at a time; a new one replaces the old. */
export function ToastProvider({
  children,
  dismissLabel,
}: {
  children: ReactNode;
  dismissLabel: string;
}) {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const nextId = useRef(1);

  const show = useCallback((options: ToastOptions) => {
    setToast({ ...options, id: nextId.current++ });
  }, []);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (toast && toast.duration !== 0) {
      timer.current = window.setTimeout(() => setToast(null), toast.duration ?? 3500);
    }
    return () => window.clearTimeout(timer.current);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+var(--gs-bottom-inset))] z-50 flex justify-center px-4"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          {toast && (
            <m.div
              key={toast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="rounded-soft bg-surface shadow-soft pointer-events-auto flex max-w-md items-center gap-3 px-4 py-3"
            >
              {toast.emoji && <span aria-hidden="true">{toast.emoji}</span>}
              <span className="flex-1">{toast.message}</span>
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    setToast(null);
                  }}
                  className="bg-primary text-on-fill min-h-11 rounded-full px-4 font-semibold"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label={dismissLabel}
                className="text-text-muted flex min-h-11 min-w-11 items-center justify-center rounded-full"
              >
                ✕
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
