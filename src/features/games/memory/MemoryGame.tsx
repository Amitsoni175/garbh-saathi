import { m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { useAllCompletions } from '@/lib/activity';
import { getMemorySets, tx } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { rotate } from '@/lib/plan';
import { randomSeed, seededRandom } from '@/lib/random';
import { GameShell } from '../GameShell';
import { buildDeck, isMatch, memoryLevel, type MemoryCard } from './logic';

function MemoryRound({ timesPlayed, onAgain }: { timesPlayed: number; onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const { dayNumber } = useTodayPlan();
  const { pairs, cols, level } = memoryLevel(timesPlayed);
  const set = rotate(getMemorySets(), dayNumber);
  const [deck] = useState<MemoryCard[]>(() =>
    buildDeck(
      (set?.items ?? []).map((i) => ({ emoji: i.emoji, label: tx(i.label, settings.textLang) })),
      pairs,
      seededRandom(randomSeed()),
    ),
  );
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [hintPair, setHintPair] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const total = Math.min(pairs, deck.length / 2);

  function tap(card: MemoryCard) {
    if (busy || matched.has(card.pairKey) || open.includes(card.id)) return;
    const next = [...open, card.id];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next.map((id) => deck.find((c) => c.id === id));
    if (isMatch(a, b) && a) {
      setMatched((prev) => new Set(prev).add(a.pairKey));
      setOpen([]);
      chime();
    } else {
      setBusy(true);
      window.setTimeout(() => {
        setOpen([]);
        setBusy(false);
      }, 900);
    }
  }

  function hint() {
    const card = deck.find((c) => !matched.has(c.pairKey));
    if (!card) return;
    setHintPair(card.pairKey);
    window.setTimeout(() => setHintPair(null), 1600);
  }

  return (
    <GameShell
      gameId="memory"
      howTo="memory.how"
      hintText={t('memory.hintText')}
      onHint={hint}
      finished={total > 0 && matched.size === total}
      onPlayAgain={onAgain}
    >
      <p className="text-text-muted text-center text-sm" role="status">
        {t('memory.level', { level })} · {t('memory.pairs', { found: matched.size, total })}
      </p>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {deck.map((card, i) => {
          const faceUp = open.includes(card.id) || matched.has(card.pairKey);
          const isMatched = matched.has(card.pairKey);
          const wiggle = hintPair === card.pairKey || isMatched;
          return (
            <m.button
              key={card.id}
              type="button"
              onClick={() => tap(card)}
              aria-label={faceUp ? card.label : t('memory.card', { n: i + 1 })}
              aria-pressed={faceUp}
              className={`rounded-soft shadow-soft flex aspect-square flex-col items-center justify-center transition-colors duration-300 ${isMatched ? 'bg-calm' : faceUp ? 'bg-surface' : 'bg-secondary'}`}
              animate={wiggle ? { rotate: [0, -6, 6, -4, 0] } : { rotate: 0 }}
              transition={{ duration: 0.6 }}
              whileTap={{ scale: 0.94 }}
            >
              {faceUp ? (
                <>
                  <span className="text-3xl" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <span className="text-text-muted mt-0.5 line-clamp-1 px-1 text-[0.65rem]">
                    {card.label}
                  </span>
                </>
              ) : (
                <span className="text-2xl opacity-70" aria-hidden="true">
                  🌸
                </span>
              )}
            </m.button>
          );
        })}
      </div>
    </GameShell>
  );
}

export default function MemoryGame() {
  const [round, setRound] = useState(0);
  const completions = useAllCompletions();
  if (!completions) return null;
  const timesPlayed = completions.filter((c) => c.kind === 'game' && c.refId === 'memory').length;
  return (
    <MemoryRound key={round} timesPlayed={timesPlayed} onAgain={() => setRound((r) => r + 1)} />
  );
}
