import { m } from 'motion/react';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  emoji: string;
  title: string;
  text?: string;
  action?: ReactNode;
}

/** A soft, friendly placeholder for "nothing here yet". Never sounds like a warning. */
export function EmptyState({ emoji, title, text, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <m.span
        className="text-5xl"
        aria-hidden="true"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </m.span>
      <h2 className="text-xl font-bold">{title}</h2>
      {text && <p className="text-text-muted max-w-xs">{text}</p>}
      {action}
    </div>
  );
}
