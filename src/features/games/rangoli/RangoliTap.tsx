import { m } from 'motion/react';
import { useState } from 'react';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { ChipGroup } from '@/components/ui';
import { chime } from '@/lib/feedback';
import { rotate } from '@/lib/plan';
import { GameShell } from '../GameShell';
import { linesIn, RANGOLI_PATTERNS } from './patterns';

type Colour = 'primary' | 'accent' | 'calm' | 'secondary';

function RangoliRound({ index, onAgain }: { index: number; onAgain: () => void }) {
  const t = useT();
  const pattern = rotate(RANGOLI_PATTERNS, index) ?? RANGOLI_PATTERNS[0];
  const [step, setStep] = useState(0);
  const [nudge, setNudge] = useState(0);
  const [colour, setColour] = useState<Colour>('primary');
  const [done, setDone] = useState(false);
  if (!pattern) return null;
  const total = pattern.path.length;
  const nextDot = pattern.path[step];
  const complete = step >= total;

  function tapDot(i: number) {
    if (complete) return;
    if (i !== nextDot) {
      setNudge((n) => n + 1); // never wrong: just guide her eye to the glowing dot
      return;
    }
    const next = step + 1;
    setStep(next);
    if (next >= total) {
      chime();
      window.setTimeout(() => setDone(true), 1400);
    }
  }

  const stroke = `var(--color-${colour})`;
  const drawn = pattern.path.slice(0, step);

  return (
    <GameShell gameId="rangoli" howTo="rangoli.how" finished={done} onPlayAgain={onAgain}>
      <ChipGroup<Colour>
        label={t('rangoli.colour')}
        value={colour}
        onChange={setColour}
        options={(['primary', 'accent', 'calm', 'secondary'] as const).map((c) => ({
          value: c,
          label: c === 'primary' ? '🌸' : c === 'accent' ? '🍑' : c === 'calm' ? '🌿' : '💜',
        }))}
      />
      <p className="text-text-muted text-center text-sm" role="status">
        {t('rangoli.progress', { done: Math.max(0, step - 1), total: linesIn(pattern) })}
      </p>
      <svg
        viewBox="0 0 100 100"
        className="rounded-softer bg-surface shadow-soft mx-auto aspect-square w-full max-w-sm"
      >
        {complete && (
          <polygon
            points={pattern.path
              .map((i) => `${pattern.dots[i]?.x},${pattern.dots[i]?.y}`)
              .join(' ')}
            fill={stroke}
            opacity={0.35}
          />
        )}
        {drawn.slice(1).map((dotIndex, k) => {
          const a = pattern.dots[drawn[k] as number];
          const b = pattern.dots[dotIndex];
          if (!a || !b) return null;
          return (
            <m.line
              key={k}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={stroke}
              strokeWidth={2.4}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          );
        })}
        {pattern.dots.map((d, i) => {
          const isNext = i === nextDot && !complete;
          return (
            <g
              key={i}
              role="button"
              tabIndex={0}
              aria-label={t('rangoli.dot', { n: i + 1 })}
              onClick={() => tapDot(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && tapDot(i)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={d.x} cy={d.y} r={7.5} fill="transparent" />
              {isNext && (
                <m.circle
                  key={nudge}
                  cx={d.x}
                  cy={d.y}
                  r={4}
                  fill={stroke}
                  opacity={0.5}
                  animate={{ r: [4, nudge ? 9 : 7, 4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
              <circle
                cx={d.x}
                cy={d.y}
                r={isNext ? 3.2 : 2.4}
                fill={isNext ? stroke : 'var(--color-text-muted)'}
              />
            </g>
          );
        })}
      </svg>
    </GameShell>
  );
}

export default function RangoliTap() {
  const [round, setRound] = useState(0);
  const { dayNumber } = useTodayPlan();
  return (
    <RangoliRound key={round} index={dayNumber + round} onAgain={() => setRound((r) => r + 1)} />
  );
}
