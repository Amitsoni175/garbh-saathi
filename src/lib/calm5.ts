/**
 * "5-minute calm": a guided breathing session in five gentle parts.
 * No breath holding (not advised in pregnancy) and no forceful breathing.
 * Pure timing logic, so it is easy to test.
 */
export type Cue = 'rest' | 'in' | 'out' | 'hum';

export interface CalmPhase {
  id: 'settle' | 'belly' | 'long' | 'hum' | 'close';
  /** Length of the phase in seconds. */
  seconds: number;
  /** One breath cycle: [cue, seconds] pairs. Empty = free, natural breathing. */
  cycle: [Cue, number][];
  emoji: string;
}

export const CALM_PHASES: CalmPhase[] = [
  { id: 'settle', seconds: 30, cycle: [], emoji: '🪷' },
  {
    id: 'belly',
    seconds: 80,
    cycle: [
      ['in', 4],
      ['out', 4],
    ],
    emoji: '🫧',
  },
  {
    id: 'long',
    seconds: 100,
    cycle: [
      ['in', 4],
      ['out', 6],
    ],
    emoji: '🌊',
  },
  {
    id: 'hum',
    seconds: 60,
    cycle: [
      ['in', 4],
      ['hum', 6],
    ],
    emoji: '🐝',
  },
  { id: 'close', seconds: 30, cycle: [], emoji: '💛' },
];

export const CALM_TOTAL = CALM_PHASES.reduce((s, p) => s + p.seconds, 0);

export interface CalmState {
  phaseIndex: number;
  phase: CalmPhase;
  /** Seconds into the current phase. */
  phaseElapsed: number;
  cue: Cue;
  /** Seconds left on the current in/out cue (for the countdown in the bubble). */
  cueLeft: number;
  cueLength: number;
  done: boolean;
}

export function calmStateAt(elapsed: number): CalmState {
  const sec = Math.max(0, Math.floor(elapsed));
  let start = 0;
  for (let i = 0; i < CALM_PHASES.length; i++) {
    const phase = CALM_PHASES[i] as CalmPhase;
    if (sec < start + phase.seconds) {
      const into = sec - start;
      if (phase.cycle.length === 0)
        return {
          phaseIndex: i,
          phase,
          phaseElapsed: into,
          cue: 'rest',
          cueLeft: 0,
          cueLength: 0,
          done: false,
        };
      const cycleLen = phase.cycle.reduce((s, [, n]) => s + n, 0);
      let pos = into % cycleLen;
      for (const [cue, n] of phase.cycle) {
        if (pos < n)
          return {
            phaseIndex: i,
            phase,
            phaseElapsed: into,
            cue,
            cueLeft: n - pos,
            cueLength: n,
            done: false,
          };
        pos -= n;
      }
    }
    start += phase.seconds;
  }
  const last = CALM_PHASES[CALM_PHASES.length - 1] as CalmPhase;
  return {
    phaseIndex: CALM_PHASES.length - 1,
    phase: last,
    phaseElapsed: last.seconds,
    cue: 'rest',
    cueLeft: 0,
    cueLength: 0,
    done: true,
  };
}
