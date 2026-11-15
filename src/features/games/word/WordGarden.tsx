import { m } from 'motion/react';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useStories } from '@/app/useStories';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button } from '@/components/ui';
import { tx } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { randomSeed, seededRandom } from '@/lib/random';
import { GameShell } from '../GameShell';
import { checkWord, nextHintTile, scramble } from './logic';

interface Tile {
  letter: string;
  used: boolean;
}

const FALLBACK = ['KRISHNA', 'DHRUVA', 'ARJUNA'];
const MAX_WORDS = 3;

function WordRound({
  words,
  title,
  onAgain,
}: {
  words: string[];
  title: string;
  onAgain: () => void;
}) {
  const t = useT();
  const [rand] = useState(() => seededRandom(randomSeed()));
  const [wi, setWi] = useState(0);
  const word = words[wi] ?? '';
  const [tiles, setTiles] = useState<Tile[]>(() =>
    scramble(words[0] ?? '', rand).map((letter) => ({ letter, used: false })),
  );
  const [placed, setPlaced] = useState<number[]>([]);
  const [grown, setGrown] = useState(0);
  const [shake, setShake] = useState(0);
  const [glow, setGlow] = useState<number | null>(null);

  function loadWord(index: number) {
    setWi(index);
    setPlaced([]);
    setTiles(scramble(words[index] ?? '', rand).map((letter) => ({ letter, used: false })));
  }

  function tapTile(i: number) {
    const tile = tiles[i];
    if (!tile || tile.used) return;
    const nextPlaced = [...placed, i];
    setTiles((ts) => ts.map((x, j) => (j === i ? { ...x, used: true } : x)));
    setPlaced(nextPlaced);
    setGlow(null);
    if (nextPlaced.length < word.length) return;
    const attempt = nextPlaced.map((j) => tiles[j]?.letter ?? '');
    if (checkWord(attempt, word)) {
      chime();
      setGrown((g) => g + 1);
      window.setTimeout(() => {
        if (wi + 1 < words.length) loadWord(wi + 1);
        else setWi(words.length);
      }, 800);
    } else {
      setShake((s) => s + 1);
      window.setTimeout(() => {
        setPlaced([]);
        setTiles((ts) => ts.map((x) => ({ ...x, used: false })));
      }, 700);
    }
  }

  function untap(slot: number) {
    const tileIndex = placed[slot];
    if (tileIndex === undefined) return;
    setPlaced((p) => p.filter((_, s) => s !== slot));
    setTiles((ts) => ts.map((x, j) => (j === tileIndex ? { ...x, used: false } : x)));
  }

  function hint() {
    // Keep only the correct start of the word, then light up the next letter.
    let keep = 0;
    while (keep < placed.length && tiles[placed[keep] as number]?.letter === word[keep]) keep++;
    const kept = placed.slice(0, keep);
    const freed = new Set(placed.slice(keep));
    const nextTiles = tiles.map((x, j) => (freed.has(j) ? { ...x, used: false } : x));
    setPlaced(kept);
    setTiles(nextTiles);
    setGlow(nextHintTile(nextTiles, word, keep));
  }

  return (
    <GameShell
      gameId="wordGarden"
      howTo="word.how"
      hintText={t('word.hintText')}
      onHint={hint}
      finished={wi >= words.length}
      onPlayAgain={onAgain}
    >
      <p className="text-text-muted text-center text-sm">{t('word.clue', { title })}</p>
      <div
        className="flex min-h-12 justify-center gap-1 text-3xl"
        aria-label={t('word.grown', { count: grown })}
        role="img"
      >
        {Array.from({ length: grown }, (_, i) => (
          <m.span
            key={i}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🌷
          </m.span>
        ))}
        {grown === 0 && <span className="opacity-40">🌱</span>}
      </div>
      <m.div
        key={shake}
        animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="flex flex-wrap justify-center gap-2"
        aria-live="polite"
      >
        {Array.from({ length: word.length }, (_, s) => {
          const tileIndex = placed[s];
          const letter = tileIndex !== undefined ? tiles[tileIndex]?.letter : '';
          return (
            <button
              key={s}
              type="button"
              onClick={() => untap(s)}
              disabled={!letter}
              aria-label={letter ? t('word.letter', { letter }) : '_'}
              className="rounded-soft border-secondary bg-surface shadow-soft flex h-12 w-11 items-center justify-center border-b-4 text-xl font-bold"
            >
              {letter}
            </button>
          );
        })}
      </m.div>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {tiles.map((tile, i) => (
          <m.button
            key={`${wi}-${i}`}
            type="button"
            onClick={() => tapTile(i)}
            disabled={tile.used}
            aria-label={t('word.letter', { letter: tile.letter })}
            className={`rounded-soft text-on-fill shadow-soft flex h-14 w-14 items-center justify-center text-2xl font-bold transition-opacity ${tile.used ? 'opacity-20' : ''} ${glow === i ? 'bg-calm' : 'bg-accent'}`}
            animate={glow === i ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={glow === i ? { duration: 0.8, repeat: Infinity } : {}}
            whileTap={{ scale: 0.9 }}
          >
            {tile.letter}
          </m.button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => {
            setPlaced([]);
            setTiles((ts) => ts.map((x) => ({ ...x, used: false })));
          }}
        >
          {t('word.clear')}
        </Button>
      </div>
    </GameShell>
  );
}

export default function WordGarden() {
  const [round, setRound] = useState(0);
  const stories = useStories();
  const { settings } = useSettings();
  const today = useTodayPlan();
  const yesterday = useTodayPlan(-1);
  if (!stories) return null;
  const id = today.offset > 0 ? yesterday.plan?.storyId : today.plan?.storyId;
  const story = stories.find((s) => s.id === id && s.words.length > 0);
  const pool = story?.words.length ? story.words : FALLBACK;
  const words = [...pool.slice(round % pool.length), ...pool.slice(0, round % pool.length)].slice(
    0,
    MAX_WORDS,
  );
  return (
    <WordRound
      key={round}
      words={words}
      title={story ? tx(story.title, settings.textLang) : 'Garbh Saathi'}
      onAgain={() => setRound((r) => r + 1)}
    />
  );
}
