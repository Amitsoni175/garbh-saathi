import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useT } from '@/app/useT';
import { Button, Card, Toggle } from '@/components/ui';
import { player, speakOnce } from '@/lib/audio';
import { CALM_PHASES, CALM_TOTAL, calmStateAt, type Cue } from '@/lib/calm5';
import { bell, vibrate } from '@/lib/feedback';
import type { StringKey } from '@/lib/i18n';

type Status = 'ready' | 'running' | 'paused' | 'done';

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

const CUE_SCALE: Record<Cue, number> = { in: 1.15, out: 0.72, hum: 0.72, rest: 0.92 };
const CUE_TONE: Record<Cue, string> = {
  in: 'bg-calm',
  out: 'bg-secondary',
  hum: 'bg-accent',
  rest: 'bg-primary',
};

interface WakeLockLike {
  release: () => Promise<void>;
}

/** Guided 5-minute breathing: settle → belly → long out-breath → hum → hug for baby. */
export default function CalmScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const complete = useComplete();
  const [status, setStatus] = useState<Status>('ready');
  const [elapsed, setElapsed] = useState(0);
  const [voice, setVoice] = useState(false);
  const [withBell, setWithBell] = useState(true);
  const lastPhase = useRef(-1);
  const wake = useRef<WakeLockLike | null>(null);

  const state = calmStateAt(elapsed);
  const phaseKey = state.phase.id;

  // The clock: one tick per second while running.
  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= CALM_TOTAL) {
          window.clearInterval(id);
          setStatus('done');
          bell();
          vibrate(40);
          void complete('breathe', 'calm5', t('calm.done'));
          return CALM_TOTAL;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [status, complete, t]);

  // A new part begins: soft bell and (optionally) the voice guide.
  useEffect(() => {
    if (status !== 'running' || state.phaseIndex === lastPhase.current) return;
    const first = lastPhase.current === -1;
    lastPhase.current = state.phaseIndex;
    if (withBell && !first) bell();
    if (voice) {
      const text = `${t(`calm.${phaseKey}.name` as StringKey)}. ${t(`calm.${phaseKey}.text` as StringKey)}`;
      void speakOnce(text, settings.audioLang, t('calm.title'));
    }
  }, [status, state.phaseIndex, phaseKey, voice, withBell, settings.audioLang, t]);

  // Keep the screen awake during the session (where supported).
  useEffect(() => {
    if (status !== 'running') return;
    let cancelled = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockLike> };
    };
    nav.wakeLock
      ?.request('screen')
      .then((lock) => {
        if (cancelled) void lock.release().catch(() => undefined);
        else wake.current = lock;
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      void wake.current?.release().catch(() => undefined);
      wake.current = null;
    };
  }, [status]);

  // Stop the voice when leaving.
  useEffect(() => () => player.stop(), []);

  function begin() {
    lastPhase.current = -1;
    setElapsed(0);
    setStatus('running');
  }

  const running = status === 'running';
  const cue: Cue = running || status === 'paused' ? state.cue : 'rest';
  const cueLabel =
    status === 'done' ? '🌿' : status === 'ready' ? '🪷' : t(`calm.${cue}` as StringKey);

  return (
    <>
      <ScreenHeader title={t('calm.title')} subtitle={t('calm.subtitle')} fallback="/" />
      <div className="flex flex-col items-center gap-4 px-4 pb-6">
        {/* Five parts */}
        <ol
          className="flex w-full justify-between gap-1"
          aria-label={t('calm.part', { n: state.phaseIndex + 1 })}
        >
          {CALM_PHASES.map((p, i) => {
            const past = status === 'done' || (status !== 'ready' && i < state.phaseIndex);
            const now = status !== 'ready' && status !== 'done' && i === state.phaseIndex;
            return (
              <li
                key={p.id}
                className={`rounded-soft flex flex-1 flex-col items-center py-2 text-xl transition-all ${now ? 'bg-primary text-on-fill scale-105' : past ? 'bg-calm/70' : 'bg-surface'}`}
                aria-current={now ? 'step' : undefined}
              >
                <span aria-hidden="true">{past ? '✓' : p.emoji}</span>
                <span className="sr-only">{t(`calm.${p.id}.name` as StringKey)}</span>
              </li>
            );
          })}
        </ol>

        {/* The bubble */}
        <div className="flex h-64 w-64 items-center justify-center">
          <m.div
            className={`${CUE_TONE[cue]} text-on-fill shadow-soft flex flex-col items-center justify-center rounded-full text-center`}
            style={{ width: 220, height: 220 }}
            animate={{
              scale: running ? CUE_SCALE[cue] : 0.9,
              rotate: running && cue === 'hum' ? [0, -1.5, 1.5, 0] : 0,
            }}
            transition={{
              scale: {
                duration: running && state.cueLength ? state.cueLength : 0.8,
                ease: 'easeInOut',
              },
              rotate: { duration: 0.4, repeat: running && cue === 'hum' ? Infinity : 0 },
            }}
          >
            <span className="text-2xl font-bold" aria-live="polite">
              {cueLabel}
            </span>
            {running && state.cueLeft > 0 && (
              <span className="mt-1 text-4xl font-bold tabular-nums" aria-hidden="true">
                {state.cueLeft}
              </span>
            )}
          </m.div>
        </div>

        {/* Overall progress */}
        <div className="w-full">
          <div className="bg-surface h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(elapsed / CALM_TOTAL) * 100}%` }}
            />
          </div>
          <p className="text-text-muted mt-1 text-center text-sm">
            {status === 'done' ? '5:00' : t('calm.left', { time: fmt(CALM_TOTAL - elapsed) })}
          </p>
        </div>

        {/* What to do now */}
        {status === 'done' ? (
          <Card tone="primary">
            <p role="status" className="text-center text-lg font-bold">
              {t('calm.done')}
            </p>
          </Card>
        ) : (
          <Card tone="calm">
            <p className="text-sm font-semibold">
              {t('calm.part', { n: state.phaseIndex + 1 })} · {state.phase.emoji}{' '}
              {t(`calm.${phaseKey}.name` as StringKey)}
            </p>
            <p className="mt-1 leading-relaxed">{t(`calm.${phaseKey}.text` as StringKey)}</p>
          </Card>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {status === 'ready' && (
            <Button size="lg" breathe onClick={begin}>
              🪷 {t('calm.start')}
            </Button>
          )}
          {status === 'running' && (
            <Button
              variant="secondary"
              onClick={() => {
                setStatus('paused');
                player.stop();
              }}
            >
              ⏸ {t('calm.pause')}
            </Button>
          )}
          {status === 'paused' && (
            <>
              <Button onClick={() => setStatus('running')}>▶ {t('calm.resume')}</Button>
              <Button variant="ghost" onClick={begin}>
                {t('calm.restart')}
              </Button>
            </>
          )}
          {status === 'done' && (
            <>
              <Button variant="secondary" onClick={begin}>
                🔄 {t('calm.restart')}
              </Button>
              <Button onClick={() => void navigate('/')}>{t('shell.done')}</Button>
            </>
          )}
        </div>

        {status !== 'running' && (
          <div className="w-full">
            <Toggle
              label={t('calm.voice')}
              hint={t('calm.voiceHint')}
              checked={voice}
              onChange={setVoice}
            />
            <Toggle label={t('calm.bell')} checked={withBell} onChange={setWithBell} />
          </div>
        )}
        <p className="text-text-muted text-center text-sm">{t('calm.safety')}</p>
      </div>
    </>
  );
}
