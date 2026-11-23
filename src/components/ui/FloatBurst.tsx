import { AnimatePresence, m } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  delay: number;
}

/**
 * Little emoji that float up and fade (hearts, flowers…). Returns a `burst`
 * function and the layer to render inside a `relative` container.
 */
export function useFloatBurst() {
  const [items, setItems] = useState<Particle[]>([]);
  const next = useRef(0);

  const burst = useCallback((emoji: string | string[], count = 5) => {
    const list = Array.isArray(emoji) ? emoji : [emoji];
    const created: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: next.current++,
      emoji: list[i % list.length] ?? '💛',
      x: (i - (count - 1) / 2) * 22 + (i % 2 ? 6 : -6),
      delay: i * 0.05,
    }));
    setItems((cur) => [...cur, ...created]);
    const ids = new Set(created.map((c) => c.id));
    window.setTimeout(() => setItems((cur) => cur.filter((c) => !ids.has(c.id))), 1500);
  }, []);

  const layer = (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {items.map((p) => (
          <m.span
            key={p.id}
            className="absolute bottom-1/2 left-1/2 text-2xl"
            initial={{ opacity: 0, x: p.x, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -110, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, delay: p.delay, ease: 'easeOut' }}
          >
            {p.emoji}
          </m.span>
        ))}
      </AnimatePresence>
    </div>
  );

  return { burst, layer };
}
