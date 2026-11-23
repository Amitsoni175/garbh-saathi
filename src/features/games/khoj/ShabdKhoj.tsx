import { m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { tx } from '@/lib/content';
import { celebrate, vibrate } from '@/lib/feedback';
import { rotate } from '@/lib/plan';
import { randomSeed, seededRandom, shuffle } from '@/lib/random';
import { GameShell } from '../GameShell';
import { buildPuzzle, cellKey, cellsOf, matchSelection, type Cell } from './logic';
import { KHOJ_THEMES } from './themes';

const SIZE = 6;
const WORDS_PER_ROUND = 4;
const FOUND_COLORS = ['bg-primary', 'bg-calm', 'bg-accent', 'bg-secondary'];

function KhojRound({ themeIndex, onAgain }: { themeIndex: number; onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const theme = rotate(KHOJ_THEMES, themeIndex) ?? KHOJ_THEMES[0];
  const [puzzle] = useState(() => {
    const rand = seededRandom(randomSeed());
    const words = shuffle(theme?.words[lang] ?? [], rand).slice(0, WORDS_PER_ROUND);
    return buildPuzzle(words, SIZE, rand);
  });
  const [found, setFound] = useState<string[]>([]);
  const [first, setFirst] = useState<Cell | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [miss, setMiss] = useState(0);

  // Which cells belong to found words (and in which colour).
  const colorOf = new Map<string, string>();
  puzzle.placements.forEach((p) => {
    const idx = found.indexOf(p.word);
    if (idx >= 0)
      cellsOf(p).forEach((c) =>
        colorOf.set(cellKey(c), FOUND_COLORS[idx % FOUND_COLORS.length] ?? ''),
      );
  });

  function tap(cell: Cell) {
    setHint(null);
    if (!first) {
      setFirst(cell);
      vibrate(10);
      return;
    }
    if (first.row === cell.row && first.col === cell.col) {
      setFirst(null);
      return;
    }
    const hit = matchSelection(puzzle.placements, first, cell, new Set(found));
    setFirst(null);
    if (hit) {
      celebrate();
      setFound((f) => [...f, hit.word]);
    } else {
      setMiss((n) => n + 1);
      // Treat the second tap as a fresh start, so she never has to "undo".
      setFirst(cell);
    }
  }

  function showHint() {
    const next = puzzle.placements.find((p) => !found.includes(p.word));
    const start = next ? cellsOf(next)[0] : undefined;
    if (start) setHint(cellKey(start));
  }

  const total = puzzle.placements.length;

  return (
    <GameShell
      gameId="shabdKhoj"
      howTo="khoj.how"
      hintText={t('khoj.hintText')}
      onHint={showHint}
      finished={total > 0 && found.length >= total}
      onPlayAgain={onAgain}
    >
      <p className="text-center font-semibold">
        {theme?.emoji} {theme ? tx(theme.title, lang) : ''} ·{' '}
        {t('khoj.count', { found: found.length, total })}
      </p>
      <ul className="flex flex-wrap justify-center gap-2" aria-label={t('khoj.wordsLabel')}>
        {puzzle.placements.map((p) => {
          const done = found.includes(p.word);
          return (
            <li
              key={p.word}
              className={`rounded-full px-3 py-1 font-bold tracking-wider ${done ? 'bg-calm/70 line-through opacity-70' : 'bg-surface shadow-soft'}`}
            >
              {done ? '✓ ' : ''}
              {p.word}
            </li>
          );
        })}
      </ul>
      <m.div
        key={miss}
        animate={miss ? { x: [0, -4, 4, 0] } : {}}
        transition={{ duration: 0.25 }}
        className="bg-surface shadow-soft rounded-softer mx-auto grid w-full max-w-sm gap-1 p-2"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        role="grid"
        aria-label={t('khoj.gridLabel')}
      >
        {puzzle.grid.map((row, r) =>
          row.map((ch, c) => {
            const key = `${r}-${c}`;
            const color = colorOf.get(key);
            const selected = first?.row === r && first.col === c;
            return (
              <button
                key={key}
                type="button"
                onClick={() => tap({ row: r, col: c })}
                aria-label={t('khoj.cellLabel', { letter: ch, row: r + 1, col: c + 1 })}
                aria-pressed={selected}
                className={`flex aspect-square min-h-11 items-center justify-center rounded-lg text-xl font-bold transition-all ${color ? `${color} text-on-fill` : 'bg-background'} ${selected ? 'ring-primary scale-110 ring-4' : ''} ${hint === key ? 'animate-breathe ring-accent ring-4' : ''}`}
              >
                {ch}
              </button>
            );
          }),
        )}
      </m.div>
      <p className="text-text-muted text-center text-sm">
        {first ? t('khoj.tapLast') : t('khoj.tapFirst')}
      </p>
    </GameShell>
  );
}

export default function ShabdKhoj() {
  const [round, setRound] = useState(0);
  const { dayNumber } = useTodayPlan();
  return (
    <KhojRound key={round} themeIndex={dayNumber + round} onAgain={() => setRound((r) => r + 1)} />
  );
}
