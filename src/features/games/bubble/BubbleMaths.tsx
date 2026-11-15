import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { getVedicTricks, tx } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { rotate } from '@/lib/plan';
import { randomSeed, seededRandom } from '@/lib/random';
import { GameShell } from '../GameShell';
import { makeQuestion } from './logic';

const QUESTIONS = 5;
const COLOURS = ['bg-primary', 'bg-secondary', 'bg-calm'];

function BubbleRound({ onAgain, skipLearn }: { onAgain: () => void; skipLearn: boolean }) {
  const t = useT();
  const { settings } = useSettings();
  const { dayNumber } = useTodayPlan();
  const trick = rotate(getVedicTricks(), dayNumber);
  const kind = trick?.kind ?? 'add9';
  const [questions] = useState(() => {
    const rand = seededRandom(randomSeed());
    return Array.from({ length: QUESTIONS }, () => makeQuestion(kind, rand));
  });
  const [phase, setPhase] = useState<'learn' | 'play'>(skipLearn || !trick ? 'play' : 'learn');
  const [stepsShown, setStepsShown] = useState(1);
  const [qi, setQi] = useState(0);
  const [popped, setPopped] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const q = questions[qi];

  function tap(value: number) {
    if (!q || popped !== null) return;
    if (value === q.answer) {
      setPopped(value);
      chime();
      window.setTimeout(() => {
        setPopped(null);
        setWrong([]);
        setQi((i) => i + 1);
      }, 650);
    } else {
      setWrong((w) => [...w, value]);
    }
  }

  return (
    <GameShell
      gameId="bubbleMaths"
      howTo="bubble.how"
      hintText={q ? t('bubble.hintText', { hint: q.hint }) : undefined}
      finished={qi >= QUESTIONS}
      onPlayAgain={onAgain}
    >
      {phase === 'learn' && trick ? (
        <Card tone="secondary">
          <p className="text-sm font-semibold">✨ {t('bubble.trickTitle')}</p>
          <h2 className="text-lg font-bold">{tx(trick.name, settings.textLang)}</h2>
          <p className="text-sm italic">{trick.sutra}</p>
          <ol className="mt-3 flex flex-col gap-2">
            {trick.steps.slice(0, stepsShown).map((s, i) => (
              <m.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-soft bg-surface text-text p-3"
              >
                <span className="font-bold">{i + 1}.</span> {tx(s, settings.textLang)}
              </m.li>
            ))}
          </ol>
          <div className="mt-4 flex justify-end">
            {stepsShown < trick.steps.length ? (
              <Button onClick={() => setStepsShown((n) => n + 1)}>{t('bubble.nextStep')} →</Button>
            ) : (
              <Button breathe onClick={() => setPhase('play')}>
                {t('bubble.letsPlay')} 🫧
              </Button>
            )}
          </div>
        </Card>
      ) : (
        q && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-text-muted text-sm">
              {t('bubble.question', { n: qi + 1, total: QUESTIONS })}
            </p>
            <p className="text-4xl font-bold" aria-live="polite">
              {q.text} = ?
            </p>
            {wrong.length > 0 && (
              <p role="status" className="text-text-muted">
                {t('shell.niceTry')}
              </p>
            )}
            <div className="rounded-softer from-background to-secondary/40 relative h-72 w-full overflow-hidden bg-gradient-to-b">
              <AnimatePresence>
                {q.options.map((value, i) => {
                  const isWrong = wrong.includes(value);
                  const isPopped = popped === value;
                  return (
                    <m.button
                      key={`${qi}-${value}`}
                      type="button"
                      onClick={() => tap(value)}
                      aria-label={t('bubble.answer', { value })}
                      className={`text-on-fill shadow-soft absolute flex h-24 w-24 items-center justify-center rounded-full text-xl font-bold ${COLOURS[i % 3]}`}
                      style={{ left: `${6 + i * 32}%` }}
                      initial={{ top: '100%', opacity: 0 }}
                      animate={
                        isPopped
                          ? { scale: 1.5, opacity: 0 }
                          : isWrong
                            ? { top: '-10%', opacity: 0.3 }
                            : { top: ['100%', `${18 + (i % 2) * 22}%`], opacity: 1, y: [0, -8, 0] }
                      }
                      transition={
                        isPopped
                          ? { duration: 0.4 }
                          : isWrong
                            ? { duration: 1.6 }
                            : {
                                top: { duration: 1.2, delay: i * 0.2 },
                                opacity: { duration: 0.6 },
                                y: { duration: 2.6, repeat: Infinity, delay: 1.4 },
                              }
                      }
                    >
                      {value}
                    </m.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )
      )}
    </GameShell>
  );
}

export default function BubbleMaths() {
  const [round, setRound] = useState(0);
  return <BubbleRound key={round} skipLearn={round > 0} onAgain={() => setRound((r) => r + 1)} />;
}
