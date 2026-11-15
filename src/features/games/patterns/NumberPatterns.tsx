import { m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import { Button } from '@/components/ui';
import { getPatterns, tx } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { randomSeed, seededRandom, shuffle } from '@/lib/random';
import { GameShell } from '../GameShell';

const ROUNDS = 3;

function PatternRound({ onAgain }: { onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const [items] = useState(() =>
    shuffle(getPatterns(), seededRandom(randomSeed())).slice(0, ROUNDS),
  );
  const [pi, setPi] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [right, setRight] = useState(false);
  const item = items[pi];

  function choose(value: number) {
    if (!item || right) return;
    if (value === item.answer) {
      setRight(true);
      chime();
      window.setTimeout(() => {
        setRight(false);
        setWrong([]);
        setPi((i) => i + 1);
      }, 900);
    } else setWrong((w) => [...w, value]);
  }

  return (
    <GameShell
      gameId="patterns"
      howTo="patterns.how"
      hintText={item ? tx(item.hint, settings.textLang) : undefined}
      finished={pi >= items.length}
      onPlayAgain={onAgain}
    >
      {item && (
        <>
          <p className="text-text-muted text-center text-sm">
            {pi + 1} / {items.length}
          </p>
          <p className="text-center text-lg font-bold">{t('patterns.question')}</p>
          <div className="flex flex-wrap justify-center gap-2" aria-live="polite">
            {[...item.sequence, right ? item.answer : '?'].map((n, i) => (
              <m.span
                key={`${pi}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-soft shadow-soft flex h-14 min-w-14 items-center justify-center px-2 text-xl font-bold ${n === '?' ? 'bg-secondary text-on-fill' : right && i === item.sequence.length ? 'bg-calm text-on-fill' : 'bg-surface'}`}
              >
                {n}
              </m.span>
            ))}
          </div>
          {wrong.length > 0 && !right && (
            <p role="status" className="rounded-soft bg-calm/60 p-3 text-center">
              💡 {tx(item.hint, settings.textLang)}
            </p>
          )}
          <div className="flex justify-center gap-3">
            {item.options.map((o) => (
              <m.div key={o} animate={wrong.includes(o) ? { x: [0, -6, 6, 0], opacity: 0.4 } : {}}>
                <Button
                  size="lg"
                  variant="accent"
                  onClick={() => choose(o)}
                  disabled={wrong.includes(o)}
                >
                  {o}
                </Button>
              </m.div>
            ))}
          </div>
        </>
      )}
    </GameShell>
  );
}

export default function NumberPatterns() {
  const [round, setRound] = useState(0);
  return <PatternRound key={round} onAgain={() => setRound((r) => r + 1)} />;
}
