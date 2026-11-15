import { m } from 'motion/react';
import { useNavigate } from 'react-router';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import type { CompletionKind } from '@/lib/db';
import type { StringKey } from '@/lib/i18n';

export interface Stone {
  kind: Extract<CompletionKind, 'shloka' | 'story' | 'game' | 'raga' | 'talk'>;
  emoji: string;
  title: string;
  to: string;
}

const NAME_KEY: Record<Stone['kind'], StringKey> = {
  shloka: 'journey.shloka',
  story: 'journey.story',
  game: 'journey.game',
  raga: 'journey.raga',
  talk: 'journey.talk',
};

const ROW = 104; // px per stone

/** A soft winding path of five stones. Tap one to open it; finished stones glow. */
export function JourneyPath({ stones, done }: { stones: Stone[]; done: Set<string> }) {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  void settings;
  const height = stones.length * ROW;
  // Zig-zag points at 22% / 78% of the width.
  const pts = stones.map((_, i) => ({ x: i % 2 === 0 ? 22 : 78, y: i * ROW + ROW / 2 }));
  const d = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1] ?? p;
      const midY = (prev.y + p.y) / 2;
      return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
    })
    .join(' ');

  return (
    <div className="relative" style={{ height }}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={d}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="2 12"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ol className="relative">
        {stones.map((stone, i) => {
          const isDone = done.has(stone.kind);
          const left = i % 2 === 0;
          const name = t(NAME_KEY[stone.kind]);
          return (
            <li
              key={stone.kind}
              className="absolute inset-x-0 flex items-center"
              style={{ top: i * ROW, height: ROW }}
            >
              <m.button
                type="button"
                onClick={() => void navigate(stone.to)}
                aria-label={`${t('journey.stoneLabel', { name, title: stone.title })}${isDone ? `, ${t('journey.done')}` : ''}`}
                className={`absolute flex items-center gap-3 ${left ? 'left-[22%] -translate-x-9 flex-row' : 'right-[22%] translate-x-9 flex-row-reverse text-right'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileTap={{ scale: 0.94 }}
              >
                <m.span
                  key={isDone ? 'done' : 'todo'}
                  className={`shadow-soft relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full text-3xl ${isDone ? 'bg-calm' : 'bg-surface'}`}
                  initial={isDone ? { scale: 0.7 } : false}
                  animate={
                    isDone
                      ? {
                          scale: 1,
                          boxShadow: [
                            '0 0 0 0 rgba(205,235,221,0.9)',
                            '0 0 0 14px rgba(205,235,221,0)',
                            '0 0 0 0 rgba(205,235,221,0)',
                          ],
                        }
                      : { scale: 1 }
                  }
                  transition={isDone ? { duration: 2.2, repeat: Infinity } : { duration: 0.3 }}
                >
                  <span aria-hidden="true">{stone.emoji}</span>
                  {isDone && (
                    <span
                      className="bg-primary text-on-fill absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full text-sm"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </m.span>
                <span className="max-w-[9.5rem]">
                  <span className="block font-bold">{name}</span>
                  <span className="text-text-muted line-clamp-2 block text-sm">{stone.title}</span>
                </span>
              </m.button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
