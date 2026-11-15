import { m } from 'motion/react';
import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Stagger the float-in: index × 80 ms. */
  index?: number;
  /** Makes the whole card a button. */
  onClick?: () => void;
  ariaLabel?: string;
  tone?: 'surface' | 'primary' | 'secondary' | 'accent' | 'calm';
}

const tones = {
  surface: 'bg-surface',
  primary: 'bg-primary text-on-fill',
  secondary: 'bg-secondary text-on-fill',
  accent: 'bg-accent text-on-fill',
  calm: 'bg-calm text-on-fill',
} as const;

export function Card({
  children,
  className = '',
  index = 0,
  onClick,
  ariaLabel,
  tone = 'surface',
}: CardProps) {
  const classes = `block w-full rounded-softer p-5 text-left shadow-soft ${tones[tone]} ${className}`;
  const animation = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.08 },
  };

  if (onClick) {
    return (
      <m.button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.98 }}
        className={classes}
        {...animation}
      >
        {children}
      </m.button>
    );
  }
  return (
    <m.section aria-label={ariaLabel} className={classes} {...animation}>
      {children}
    </m.section>
  );
}
