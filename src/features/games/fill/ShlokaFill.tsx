import { m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { useAllCompletions } from '@/lib/activity';
import { getShlokas, tx, type Shloka } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { randomSeed, seededRandom, shuffle } from '@/lib/random';
import { GameShell } from '../GameShell';
import { makeFillRound, type FillRound } from './logic';

const ROUNDS = 3;

function FillGame({ pool, onAgain }: { pool: Shloka[]; onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const all = getShlokas();
  const [rounds] = useState<FillRound[]>(() => {
    const rand = seededRandom(randomSeed());
    return shuffle(pool, rand)
      .map((s) =>
        makeFillRound(
          s,
          all.filter((o) => o.id !== s.id),
          rand,
        ),
      )
      .filter((r): r is FillRound => r !== null)
      .slice(0, ROUNDS);
  });
  const [ri, setRi] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [right, setRight] = useState(false);
  const round = rounds[ri];
  const shloka = all.find((s) => s.id === round?.shlokaId);

  function choose(word: string) {
    if (!round || right) return;
    if (word === round.answer) {
      setRight(true);
      chime();
      window.setTimeout(() => {
        setRight(false);
        setWrong([]);
        setRi((i) => i + 1);
      }, 1100);
    } else setWrong((w) => [...w, word]);
  }

  return (
    <GameShell
      gameId="shlokaFill"
      howTo="fill.how"
      hintText={
        shloka ? t('fill.hintText', { meaning: tx(shloka.meaning, settings.textLang) }) : undefined
      }
      finished={ri >= rounds.length}
      onPlayAgain={onAgain}
    >
      {round && shloka && (
        <>
          <p className="text-text-muted text-center text-sm">
            {ri + 1} / {rounds.length} · {tx(shloka.title, settings.textLang)}
          </p>
          <Card>
            <p className="text-lg leading-loose italic" aria-live="polite">
              {round.words.map((w, i) =>
                i === round.blankIndex ? (
                  <m.span
                    key={i}
                    className={`rounded-soft mx-1 inline-block px-2 font-bold not-italic ${right ? 'bg-calm text-on-fill' : 'bg-secondary text-on-fill'}`}
                    animate={right ? { scale: [1, 1.2, 1] } : {}}
                  >
                    {right ? w : '____'}
                  </m.span>
                ) : (
                  <span key={i}>{w} </span>
                ),
              )}
            </p>
          </Card>
          {wrong.length > 0 && !right && (
            <p role="status" className="rounded-soft bg-calm/60 p-3">
              💡 {t('fill.hintText', { meaning: tx(shloka.meaning, settings.textLang) })}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {round.options.map((o) => (
              <Button
                key={o}
                variant="accent"
                onClick={() => choose(o)}
                disabled={wrong.includes(o)}
              >
                {o}
              </Button>
            ))}
          </div>
        </>
      )}
    </GameShell>
  );
}

export default function ShlokaFill() {
  const [round, setRound] = useState(0);
  const completions = useAllCompletions();
  if (!completions) return null;
  const heard = new Set(completions.filter((c) => c.kind === 'shloka').map((c) => c.refId));
  const all = getShlokas();
  const pool = all.filter((s) => heard.has(s.id));
  return (
    <FillGame
      key={round}
      pool={
        pool.length >= 1
          ? [...pool, ...all.filter((s) => !heard.has(s.id))].slice(0, Math.max(3, pool.length))
          : all
      }
      onAgain={() => setRound((r) => r + 1)}
    />
  );
}
