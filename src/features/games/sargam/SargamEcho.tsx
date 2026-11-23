import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/app/useT';
import { Button } from '@/components/ui';
import { chime } from '@/lib/feedback';
import { playNote } from '@/lib/feedback';
import { randomSeed, seededRandom } from '@/lib/random';
import { GameShell } from '../GameShell';
import { NOTES, ROUNDS, START_LENGTH, checkTaps, extendTune, newTune } from './logic';

const PAD_COLORS = ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-calm', 'bg-primary/60'];
const STEP_MS = 650;

type Phase = 'ready' | 'listen' | 'play' | 'again' | 'nice';

function SargamRound({ onAgain }: { onAgain: () => void }) {
  const t = useT();
  const [rand] = useState(() => seededRandom(randomSeed()));
  const [tune, setTune] = useState<number[]>(() => newTune(rand, START_LENGTH));
  const [taps, setTaps] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('ready');
  const [lit, setLit] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function playTune(notes: number[]) {
    clearTimers();
    setTaps([]);
    setPhase('listen');
    notes.forEach((n, i) => {
      later(
        () => {
          setLit(n);
          playNote(NOTES[n]?.freq ?? 261.63, 0.55);
        },
        400 + i * STEP_MS,
      );
      later(() => setLit(null), 400 + i * STEP_MS + STEP_MS * 0.7);
    });
    later(() => setPhase('play'), 400 + notes.length * STEP_MS);
  }

  function tap(n: number) {
    if (phase !== 'play') return;
    playNote(NOTES[n]?.freq ?? 261.63, 0.45);
    setLit(n);
    later(() => setLit(null), 250);
    const next = [...taps, n];
    setTaps(next);
    const result = checkTaps(tune, next);
    if (result === 'again') {
      setPhase('again');
      later(() => playTune(tune), 1200);
    } else if (result === 'complete') {
      setPhase('nice');
      chime();
      if (round >= ROUNDS) {
        later(() => setFinished(true), 900);
      } else {
        const longer = extendTune(tune, rand);
        later(() => {
          setTune(longer);
          setRound((r) => r + 1);
          playTune(longer);
        }, 1300);
      }
    }
  }

  const message =
    phase === 'ready'
      ? t('sargam.ready')
      : phase === 'listen'
        ? t('sargam.listen')
        : phase === 'play'
          ? t('sargam.yourTurn', { n: tune.length - taps.length })
          : phase === 'again'
            ? t('sargam.again')
            : t('sargam.nice');

  return (
    <GameShell
      gameId="sargam"
      howTo="sargam.how"
      hintText={t('sargam.hintText', {
        note: NOTES[tune[taps.length] ?? 0]?.label ?? 'Sa',
      })}
      finished={finished}
      onPlayAgain={onAgain}
    >
      <p className="text-text-muted text-center text-sm">
        {t('sargam.round', { n: round, total: ROUNDS })}
      </p>
      <div className="flex justify-center gap-1.5" aria-hidden="true">
        {tune.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full ${i < taps.length && phase !== 'again' ? 'bg-primary' : 'bg-secondary'}`}
          />
        ))}
      </div>
      <p role="status" className="min-h-14 text-center text-lg font-semibold">
        {message}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {NOTES.map((note, i) => (
          <m.button
            key={note.id}
            type="button"
            onClick={() => tap(i)}
            disabled={phase !== 'play'}
            animate={{ scale: lit === i ? 1.12 : 1, opacity: lit === null || lit === i ? 1 : 0.6 }}
            transition={{ duration: 0.15 }}
            className={`${PAD_COLORS[i]} text-on-fill shadow-soft flex aspect-square flex-col items-center justify-center rounded-full text-lg font-bold ${i === 3 ? 'col-start-1 translate-x-1/2' : ''} ${i === 4 ? 'translate-x-1/2' : ''} ${lit === i ? 'ring-4 ring-white' : ''}`}
            aria-label={note.label}
          >
            <span className="text-3xl" aria-hidden="true">
              {note.emoji}
            </span>
            {note.label}
          </m.button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {phase === 'ready' ? (
          <Button size="lg" breathe onClick={() => playTune(tune)}>
            🎶 {t('sargam.start')}
          </Button>
        ) : (
          <Button variant="ghost" disabled={phase === 'listen'} onClick={() => playTune(tune)}>
            🔁 {t('sargam.replay')}
          </Button>
        )}
      </div>
    </GameShell>
  );
}

export default function SargamEcho() {
  const [round, setRound] = useState(0);
  return <SargamRound key={round} onAgain={() => setRound((r) => r + 1)} />;
}
