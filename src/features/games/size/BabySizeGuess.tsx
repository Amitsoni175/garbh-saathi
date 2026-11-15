import { m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { babySizeForWeek, tx, type BabySize } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { randomSeed, seededRandom, shuffle } from '@/lib/random';
import { GameShell } from '../GameShell';

function SizeRound({ week, onAgain }: { week: number; onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const right = babySizeForWeek(week);
  const [choices] = useState<BabySize[]>(() => {
    if (!right) return [];
    const rand = seededRandom(randomSeed());
    const far = week < 22 ? week + 8 + Math.floor(rand() * 6) : week - 8 - Math.floor(rand() * 6);
    let other = babySizeForWeek(far);
    if (!other || other.name.en === right.name.en) other = babySizeForWeek(week < 22 ? 40 : 6);
    return shuffle([right, ...(other ? [other] : [])], rand);
  });
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  if (!right) return null;

  return (
    <GameShell gameId="babySize" howTo="sizeGuess.how" finished={done} onPlayAgain={onAgain}>
      <p className="text-center text-xl font-bold">{t('sizeGuess.question')}</p>
      <div className="flex items-center justify-center gap-3">
        {choices.map((c, i) => {
          const isRight = c.week === right.week;
          const revealed = picked !== null;
          return (
            <div key={c.week} className="contents">
              {i === 1 && <span className="text-text-muted">{t('sizeGuess.or')}</span>}
              <m.button
                type="button"
                onClick={() => {
                  if (picked) return;
                  setPicked(c.name.en);
                  chime();
                }}
                className={`rounded-softer shadow-soft flex w-36 flex-col items-center gap-1 p-4 transition-colors duration-500 ${revealed ? (isRight ? 'bg-calm' : 'bg-surface opacity-60') : 'bg-surface'}`}
                animate={revealed && isRight ? { scale: [1, 1.12, 1.05] } : { scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-6xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="font-bold first-letter:uppercase">{tx(c.name, lang)}</span>
              </m.button>
            </div>
          );
        })}
      </div>
      {picked && (
        <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card tone="primary">
            <p className="text-lg font-bold" role="status">
              {t('sizeGuess.reveal', { name: tx(right.name, lang), emoji: right.emoji })}
            </p>
            {right.development[0] && <p className="mt-1">🌱 {tx(right.development[0], lang)}</p>}
            <div className="mt-3 flex justify-end">
              <Button onClick={() => setDone(true)}>{t('shell.done')} 🌸</Button>
            </div>
          </Card>
        </m.div>
      )}
    </GameShell>
  );
}

export default function BabySizeGuess() {
  const [round, setRound] = useState(0);
  const state = usePregnancy();
  return (
    <SizeRound key={round} week={state?.contentWeek ?? 20} onAgain={() => setRound((r) => r + 1)} />
  );
}
