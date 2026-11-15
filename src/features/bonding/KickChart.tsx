import { useT } from '@/app/useT';
import type { KickRow } from '@/lib/db';

/** A soft line chart of minutes-to-10-kicks for the last sessions. */
export function KickChart({ sessions }: { sessions: KickRow[] }) {
  const t = useT();
  const done = sessions.filter((s) => s.count >= 10).slice(-14);
  if (done.length === 0) return <p className="text-text-muted text-sm">{t('kick.historyEmpty')}</p>;
  const mins = done.map((s) => Math.max(1, Math.round(s.seconds / 60)));
  const max = Math.max(30, ...mins);
  const W = 300;
  const H = 120;
  const pad = 20;
  const x = (i: number) =>
    done.length === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (done.length - 1);
  const y = (m: number) => H - pad - (m / max) * (H - pad * 2);
  const path = mins.map((m, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(m)}`).join(' ');
  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={t('kick.chartLabel', { n: done.length })}
      >
        <line
          x1={pad}
          x2={W - pad}
          y1={H - pad}
          y2={H - pad}
          stroke="var(--color-secondary)"
          strokeWidth={1}
        />
        <path
          d={path}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {mins.map((m, i) => (
          <g key={i}>
            <circle
              cx={x(i)}
              cy={y(m)}
              r={4.5}
              fill="var(--color-surface)"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
            />
            <text
              x={x(i)}
              y={y(m) - 9}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-text-muted)"
            >
              {m}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="text-text-muted text-center text-xs">{t('kick.history')}</figcaption>
    </figure>
  );
}
