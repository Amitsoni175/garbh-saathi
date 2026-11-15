import { m } from 'motion/react';
import { useT } from '@/app/useT';
import { flowerFor, flowerPosition, STAGE_EMOJI, type GardenStage } from '@/lib/garden';
import type { CompletionRow } from '@/lib/db';

const STAGE_SIZE: Record<GardenStage, string> = {
  seed: 'text-3xl',
  sprout: 'text-4xl',
  sapling: 'text-5xl',
  young: 'text-6xl',
  tree: 'text-7xl',
  bloom: 'text-8xl',
};

const MAX_FLOWERS = 140;

export interface GardenViewProps {
  stage: GardenStage;
  completions: CompletionRow[];
  milestones: { id: string; emoji: string }[];
  festivalTreasures: { id: string; emoji: string }[];
  tall?: boolean;
}

/** A soft sky, the growing plant, and one flower for every activity she has done. */
export function GardenView({
  stage,
  completions,
  milestones,
  festivalTreasures,
  tall = false,
}: GardenViewProps) {
  const t = useT();
  const shown = completions.slice(-MAX_FLOWERS);
  const visitors = [...milestones, ...festivalTreasures];
  return (
    <div
      className={`rounded-softer relative w-full overflow-hidden ${tall ? 'h-80' : 'h-48'}`}
      style={{
        background:
          'linear-gradient(180deg, var(--color-secondary) 0%, var(--color-background) 58%, var(--color-calm) 58%, var(--color-calm) 100%)',
      }}
      role="img"
      aria-label={`${t(`garden.stage.${stage}`)} · ${t('garden.subtitle', { count: completions.length })}`}
    >
      {/* Visitors in the sky */}
      {visitors.map((v, i) => (
        <m.span
          key={v.id}
          className="absolute text-xl"
          style={{ left: `${8 + ((i * 23) % 84)}%`, top: `${6 + ((i * 17) % 34)}%` }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          {v.emoji}
        </m.span>
      ))}
      {/* The plant */}
      <m.span
        className={`absolute bottom-[30%] left-1/2 -translate-x-1/2 ${STAGE_SIZE[stage]}`}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {STAGE_EMOJI[stage]}
      </m.span>
      {stage === 'bloom' && (
        <span
          className="absolute bottom-[52%] left-1/2 -translate-x-1/2 text-2xl tracking-widest"
          aria-hidden="true"
        >
          🌸🌼🌸
        </span>
      )}
      {/* Flowers on the ground */}
      {shown.map((c, i) => {
        const p = flowerPosition(i);
        return (
          <m.span
            key={c.id ?? i}
            className="absolute text-base"
            style={{ left: `${3 + p.x * 92}%`, top: `${61 + p.y * 33}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: Math.min(i, 30) * 0.01 }}
            aria-hidden="true"
          >
            {flowerFor(c.kind)}
          </m.span>
        );
      })}
    </div>
  );
}
