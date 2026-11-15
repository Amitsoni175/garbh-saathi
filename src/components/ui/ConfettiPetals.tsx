import { m, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';

const PETALS = ['🌸', '🌼', '🍃', '🌺', '💮'];

export interface ConfettiPetalsProps {
  /** Change this number to play the animation again. 0 = nothing shown. */
  burst: number;
  count?: number;
}

/** Soft petals drifting down the screen for ~3 s. Hidden when reduced motion is on. */
export function ConfettiPetals({ burst, count = 18 }: ConfettiPetalsProps) {
  const reduce = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `${burst}-${i}`,
        emoji: PETALS[i % PETALS.length],
        left: (i * 37 + burst * 13) % 100,
        delay: (i % 6) * 0.12,
        drift: ((i % 5) - 2) * 18,
        spin: (i % 2 ? 1 : -1) * (120 + (i % 4) * 40),
        duration: 2.4 + (i % 4) * 0.3,
      })),
    [burst, count],
  );

  if (!burst || reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <m.span
          key={p.id}
          className="absolute -top-8 text-2xl"
          style={{ left: `${p.left}%` }}
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: '110dvh', x: p.drift, opacity: [0, 1, 1, 0], rotate: p.spin }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        >
          {p.emoji}
        </m.span>
      ))}
    </div>
  );
}
