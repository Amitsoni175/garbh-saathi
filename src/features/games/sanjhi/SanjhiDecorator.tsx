import { m, useMotionValue } from 'motion/react';
import { useRef, useState, type RefObject } from 'react';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { Button, useToast } from '@/components/ui';
import { getTodayISO } from '@/lib/clock';
import { logError } from '@/lib/logger';
import { downloadBlob, savePhoto } from '@/lib/photos';
import { GameShell } from '../GameShell';

const STICKERS = [
  '⭐',
  '🌙',
  '🌸',
  '🌼',
  '✨',
  '🔴',
  '👁️',
  '👄',
  '🪷',
  '🦚',
  '☀️',
  '💠',
  '🌺',
  '🪔',
];

interface Placed {
  id: number;
  emoji: string;
  x: number; // 0–100 (% of canvas)
  y: number;
}

const CLAY = '#E9B88C';
const FACE = '#F6D3AE';
const RED = '#C2453B';

/** The base Sanjhi face, drawn as SVG on screen. The same shapes are drawn to canvas on save. */
function SanjhiBase() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="100" height="100" fill="#FFF1E0" />
      <circle cx="50" cy="45" r="30" fill={CLAY} />
      <circle cx="50" cy="45" r="24" fill={FACE} />
      <circle
        cx="50"
        cy="45"
        r="27"
        fill="none"
        stroke={RED}
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
      <circle cx="50" cy="31" r="2.2" fill={RED} />
      <rect x="38" y="78" width="24" height="16" rx="6" fill={CLAY} />
    </svg>
  );
}

function Sticker({
  item,
  canvasRef,
  onMove,
}: {
  item: Placed;
  canvasRef: RefObject<HTMLDivElement | null>;
  onMove: (id: number, x: number, y: number) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <m.span
      ref={ref}
      drag
      dragMomentum={false}
      dragConstraints={canvasRef}
      dragElastic={0}
      style={{ x, y, left: `${item.x}%`, top: `${item.y}%` }}
      onDragEnd={() => {
        const box = canvasRef.current?.getBoundingClientRect();
        const el = ref.current?.getBoundingClientRect();
        if (box && el) {
          onMove(
            item.id,
            ((el.left + el.width / 2 - box.left) / box.width) * 100,
            ((el.top + el.height / 2 - box.top) / box.height) * 100,
          );
        }
        x.set(0);
        y.set(0);
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none text-4xl select-none"
    >
      {item.emoji}
    </m.span>
  );
}

async function renderToBlob(placed: Placed[]): Promise<Blob | null> {
  const size = 720;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const k = size / 100;
  ctx.fillStyle = '#FFF1E0';
  ctx.fillRect(0, 0, size, size);
  const circle = (cx: number, cy: number, r: number, fill: string) => {
    ctx.beginPath();
    ctx.arc(cx * k, cy * k, r * k, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  circle(50, 45, 30, CLAY);
  circle(50, 45, 24, FACE);
  ctx.setLineDash([2 * k, 3 * k]);
  ctx.strokeStyle = RED;
  ctx.lineWidth = 1.2 * k;
  ctx.beginPath();
  ctx.arc(50 * k, 45 * k, 27 * k, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  circle(50, 31, 2.2, RED);
  ctx.fillStyle = CLAY;
  ctx.beginPath();
  ctx.roundRect(38 * k, 78 * k, 24 * k, 16 * k, 6 * k);
  ctx.fill();
  ctx.font = `${10 * k}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of placed) ctx.fillText(p.emoji, p.x * k, p.y * k);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

function SanjhiRound({ onAgain }: { onAgain: () => void }) {
  const t = useT();
  const toast = useToast();
  const state = usePregnancy();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [saved, setSaved] = useState<Blob | null>(null);
  const [done, setDone] = useState(false);
  const nextId = useRef(1);

  function add(emoji: string) {
    const n = nextId.current++;
    setPlaced((p) => [...p, { id: n, emoji, x: 30 + ((n * 17) % 40), y: 20 + ((n * 23) % 50) }]);
    setSaved(null);
  }

  async function save() {
    try {
      const blob = await renderToBlob(placed);
      if (!blob) return;
      await savePhoto(blob, 'sanjhi', state?.weeks ?? 0);
      setSaved(blob);
      toast({ message: t('sanjhi.saved') });
    } catch (err) {
      void logError(err);
    }
  }

  return (
    <GameShell
      gameId="sanjhi"
      howTo="sanjhi.how"
      hintText={t('sanjhi.hintText')}
      finished={done}
      onPlayAgain={onAgain}
    >
      <p className="text-text-muted text-sm">{t('sanjhi.about')}</p>
      <div
        ref={canvasRef}
        className="rounded-softer shadow-soft relative mx-auto aspect-square w-full max-w-sm overflow-hidden"
        role="img"
        aria-label={t('sanjhi.canvas')}
      >
        <SanjhiBase />
        {placed.map((p) => (
          <Sticker
            key={p.id}
            item={p}
            canvasRef={canvasRef}
            onMove={(id, x, y) =>
              setPlaced((list) => list.map((s) => (s.id === id ? { ...s, x, y } : s)))
            }
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {STICKERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            aria-label={t('sanjhi.sticker', { name: s })}
            className="rounded-soft bg-surface shadow-soft flex h-12 w-12 items-center justify-center text-2xl"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="ghost" onClick={() => setPlaced([])}>
          {t('sanjhi.clear')}
        </Button>
        <Button onClick={() => void save()} disabled={placed.length === 0}>
          💾 {t('sanjhi.save')}
        </Button>
        {saved && (
          <>
            <Button
              variant="secondary"
              onClick={() => downloadBlob(saved, `sanjhi-${getTodayISO()}.png`)}
            >
              ⬇️ {t('sanjhi.download')}
            </Button>
            <Button variant="calm" onClick={() => setDone(true)}>
              {t('shell.done')} 🌸
            </Button>
          </>
        )}
      </div>
    </GameShell>
  );
}

export default function SanjhiDecorator() {
  const [round, setRound] = useState(0);
  return <SanjhiRound key={round} onAgain={() => setRound((r) => r + 1)} />;
}
