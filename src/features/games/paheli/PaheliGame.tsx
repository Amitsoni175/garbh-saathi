import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/app/settings';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { getPahelis, tx } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { rotate } from '@/lib/plan';
import { GameShell } from '../GameShell';

/** A canvas "scratch card" over the answer. Scratching ~45% reveals it. */
function ScratchCard({ label, onReveal }: { label: string; onReveal: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const moves = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const styles = getComputedStyle(document.documentElement);
    ctx.fillStyle = styles.getPropertyValue('--gs-secondary').trim() || '#D8CCF0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = styles.getPropertyValue('--gs-on-fill').trim() || '#5A4A5E';
    ctx.font = `${18 * dpr}px Nunito, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  }, [label]);

  function scratch(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr, 22 * dpr, 0, Math.PI * 2);
    ctx.fill();
    moves.current += 1;
    if (moves.current % 8 === 0) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] === 0) clear++;
      if (clear / (data.length / 16) > 0.45) onReveal();
    }
  }

  return (
    <canvas
      ref={ref}
      className="rounded-soft absolute inset-0 h-full w-full touch-none"
      onPointerDown={scratch}
      onPointerMove={scratch}
      aria-hidden="true"
    />
  );
}

function PaheliRound({ index, onAgain }: { index: number; onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const paheli = rotate(getPahelis(), index);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  if (!paheli) return null;
  const answer = tx(paheli.answer, lang);

  function reveal() {
    if (revealed) return;
    setRevealed(true);
    chime();
  }

  return (
    <GameShell
      gameId="paheli"
      howTo="paheli.how"
      hintText={t('paheli.hintText', {
        letter: answer
          .replace(/^(a|an|the|your)\s+/i, '')
          .charAt(0)
          .toUpperCase(),
      })}
      finished={done}
      onPlayAgain={onAgain}
    >
      <Card tone="accent">
        <p className="text-sm font-semibold">🧩 {t('game.paheli.name')}</p>
        <p className="mt-2 text-xl leading-snug font-bold">{tx(paheli.riddle, lang)}</p>
      </Card>
      <div
        className="rounded-soft bg-surface shadow-soft relative flex h-32 items-center justify-center"
        aria-live="polite"
      >
        {revealed ? (
          <m.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold"
          >
            {paheli.emoji} {answer}
          </m.p>
        ) : (
          <>
            <span className="text-2xl font-bold" aria-hidden="true">
              {paheli.emoji} {answer}
            </span>
            <ScratchCard label={t('paheli.scratch')} onReveal={reveal} />
          </>
        )}
      </div>
      <div className="flex justify-center gap-2">
        {revealed ? (
          <Button onClick={() => setDone(true)}>{t('shell.done')} 🌸</Button>
        ) : (
          <Button variant="secondary" onClick={reveal}>
            {t('paheli.reveal')}
          </Button>
        )}
      </div>
    </GameShell>
  );
}

export default function PaheliGame() {
  const [round, setRound] = useState(0);
  const { dayNumber } = useTodayPlan();
  return (
    <PaheliRound key={round} index={dayNumber + round} onAgain={() => setRound((r) => r + 1)} />
  );
}
