import { AnimatePresence, m } from 'motion/react';
import { useEffect, useId, useRef, type ReactNode } from 'react';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
}

/** Slides up from the bottom. Close by tapping outside, swiping down, Escape or the ✕. */
export function BottomSheet({ open, onClose, title, closeLabel, children }: BottomSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <m.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="rounded-t-softer bg-surface shadow-soft relative max-h-[85dvh] w-full max-w-md overflow-y-auto px-5 pt-3 pb-[max(1.5rem,var(--gs-bottom-inset))] outline-none"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="bg-secondary mx-auto mb-3 h-1.5 w-12 rounded-full" aria-hidden="true" />
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id={titleId} className="text-lg font-bold">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="text-text-muted flex min-h-12 min-w-12 items-center justify-center rounded-full"
              >
                ✕
              </button>
            </div>
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
