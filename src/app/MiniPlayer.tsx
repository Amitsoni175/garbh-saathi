import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/Chip';
import { minutesUntil, player } from '@/lib/audio';
import { kvGet, kvSet } from '@/lib/db';
import { useNow } from './useClock';
import { usePlayer } from './usePlayer';
import { useT } from './useT';

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Stays above the tab bar while something is playing, so she can browse. */
export function MiniPlayer() {
  const t = useT();
  const state = usePlayer();
  const [open, setOpen] = useState(false);
  const [sleepChoice, setSleepChoice] = useState<'off' | '10' | '20' | '30'>('off');
  useNow(); // re-render each minute for the sleep countdown
  const track = state.track;
  const visible = track !== null && state.status !== 'idle';
  const isTts = track?.kind === 'tts';
  const playing = state.status === 'playing' || state.status === 'loading';

  return (
    <>
      <AnimatePresence>
        {visible && track && (
          <m.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-3"
          >
            <div className="rounded-soft bg-secondary text-on-fill shadow-soft flex w-full max-w-md items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => player.toggle()}
                aria-label={playing ? t('player.pause') : t('player.play')}
                className="bg-surface text-text flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                {playing ? '⏸' : '▶'}
              </button>
              <button
                type="button"
                className="min-h-11 min-w-0 flex-1 text-left"
                onClick={() => setOpen(true)}
                aria-label={t('player.expand')}
              >
                <span className="block truncate font-semibold">{track.title}</span>
                <span className="block truncate text-xs">
                  {state.error === 'tapToPlay'
                    ? t('player.tapToPlay')
                    : state.error === 'missing'
                      ? t('player.missing')
                      : state.error === 'failed'
                        ? t('player.failed')
                        : t(`player.source.${track.kind}`)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => player.stop()}
                aria-label={t('player.close')}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                ✕
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <BottomSheet
        open={open && visible}
        onClose={() => setOpen(false)}
        title={track?.title ?? ''}
        closeLabel={t('ui.close')}
      >
        <div className="flex flex-col gap-5 pb-2">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => player.toggle()}
              aria-label={playing ? t('player.pause') : t('player.play')}
            >
              {playing ? '⏸' : '▶'} {playing ? t('player.pause') : t('player.play')}
            </Button>
          </div>
          {state.duration > 0 && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                {isTts
                  ? t('player.part', { n: state.position + 1, total: state.duration })
                  : `${fmt(state.position)} / ${fmt(state.duration)}`}
              </span>
              <input
                type="range"
                min={0}
                max={isTts ? state.duration - 1 : state.duration}
                step={isTts ? 1 : 0.5}
                value={state.position}
                onChange={(e) => player.seek(Number(e.target.value))}
                aria-label={t('player.seek')}
                className="w-full accent-[var(--color-primary)]"
              />
            </label>
          )}
          <div>
            <p className="mb-2 text-sm font-semibold">{t('player.speed')}</p>
            <ChipGroup<'0.75' | '1'>
              label={t('player.speed')}
              value={state.rate === 1 ? '1' : '0.75'}
              onChange={(v) => player.setRate(v === '1' ? 1 : 0.75)}
              options={[
                { value: '0.75', label: '0.75×' },
                { value: '1', label: '1×' },
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">
              {t('player.sleep')}
              {state.sleepAt && ` · ${t('player.sleepLeft', { min: minutesUntil(state.sleepAt) })}`}
            </p>
            <ChipGroup<'off' | '10' | '20' | '30'>
              label={t('player.sleep')}
              value={state.sleepAt ? sleepChoice : 'off'}
              onChange={(v) => {
                setSleepChoice(v);
                player.setSleep(v === 'off' ? null : Number(v));
              }}
              options={[
                { value: 'off', label: t('player.sleepOff') },
                { value: '10', label: t('player.sleepMin', { min: 10 }) },
                { value: '20', label: t('player.sleepMin', { min: 20 }) },
                { value: '30', label: t('player.sleepMin', { min: 30 }) },
              ]}
            />
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

const NOTICE_KEY = 'notice.noHindiVoice';

/** One-time gentle notice when Hindi was requested but no Hindi voice is installed. */
export function HindiVoiceNotice() {
  const t = useT();
  const state = usePlayer();
  const [seen, setSeen] = useState<boolean | null>(null);
  const wantsNotice = state.notice === 'noHindiVoice';

  useEffect(() => {
    if (!wantsNotice) return;
    let cancelled = false;
    void kvGet<boolean>(NOTICE_KEY, false).then((v) => {
      if (cancelled) return;
      setSeen(v);
      if (v) player.clearNotice();
    });
    return () => {
      cancelled = true;
    };
  }, [wantsNotice]);

  const open = wantsNotice && seen === false;
  const close = () => {
    void kvSet(NOTICE_KEY, true);
    setSeen(true);
    player.clearNotice();
  };

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title={t('player.noVoiceTitle')}
      closeLabel={t('ui.close')}
    >
      <p className="mb-4">{t('player.noVoiceText')}</p>
      <Button onClick={close}>{t('player.ok')}</Button>
    </BottomSheet>
  );
}
