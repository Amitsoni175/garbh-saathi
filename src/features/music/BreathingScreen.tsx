import { m } from 'motion/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useRagaNow, useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button, ChipGroup, Toggle } from '@/components/ui';
import { player } from '@/lib/audio';
import { getRagas, tx } from '@/lib/content';
import { useAudioFile } from './useAudioFile';

type Minutes = '1' | '3' | '5';
const HALF = 4; // seconds in, seconds out

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export default function BreathingScreen() {
  const t = useT();
  const [params] = useSearchParams();
  const { settings } = useSettings();
  const complete = useComplete();
  const { dayNumber } = useTodayPlan();
  const now = useRagaNow(dayNumber);
  const raga = getRagas().find((r) => r.id === params.get('raga')) ?? now;
  const file = useAudioFile(raga?.id, 'ragas');
  const [minutes, setMinutes] = useState<Minutes>('1');
  const [music, setMusic] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const total = Number(minutes) * 60;

  const ragaId = raga?.id;
  useEffect(() => {
    if (!running) return;
    let sec = 0;
    const id = window.setInterval(() => {
      sec += 1;
      setElapsed(sec);
      if (sec >= total) {
        window.clearInterval(id);
        setRunning(false);
        setFinished(true);
        if (music) player.stop();
        void complete('breathe', ragaId, t('breathe.done'));
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, total, music, ragaId, complete, t]);

  const inhale = Math.floor(elapsed / HALF) % 2 === 0;

  function start() {
    setElapsed(0);
    setFinished(false);
    setRunning(true);
    if (music && raga && file === 'present') {
      void player.play({
        id: `raga:${raga.id}`,
        title: tx(raga.name, settings.textLang),
        lang: settings.audioLang,
        file: raga.id,
        fileDir: 'ragas',
        loop: true,
      });
    }
  }

  function stop() {
    setRunning(false);
    if (music) player.stop();
  }

  return (
    <>
      <ScreenHeader title={t('breathe.title')} fallback="/music" />
      <div className="flex flex-col items-center gap-5 px-4 pb-6">
        {!running && (
          <div className="flex w-full flex-col gap-3">
            <ChipGroup<Minutes>
              label={t('breathe.title')}
              value={minutes}
              onChange={setMinutes}
              options={(['1', '3', '5'] as const).map((v) => ({
                value: v,
                label: t('breathe.minutes', { min: v }),
              }))}
            />
            {file === 'present' && (
              <Toggle label={t('breathe.withMusic')} checked={music} onChange={setMusic} />
            )}
          </div>
        )}
        <div className="flex h-72 w-72 items-center justify-center">
          <m.div
            className="bg-calm text-on-fill shadow-soft flex items-center justify-center rounded-full text-center text-xl font-bold"
            style={{ width: 240, height: 240 }}
            animate={{ scale: running ? (inhale ? 1.15 : 0.7) : 0.85 }}
            transition={{ duration: running ? HALF : 0.6, ease: 'easeInOut' }}
          >
            <span aria-live="polite">
              {running ? (inhale ? t('breathe.in') : t('breathe.out')) : finished ? '🌿' : '🫧'}
            </span>
          </m.div>
        </div>
        {running && (
          <p className="text-text-muted">
            {t('breathe.left', { time: fmt(Math.max(0, total - elapsed)) })}
          </p>
        )}
        {finished && (
          <p role="status" className="text-center font-semibold">
            {t('breathe.done')}
          </p>
        )}
        {running ? (
          <Button variant="secondary" onClick={stop}>
            {t('breathe.stop')}
          </Button>
        ) : (
          <Button size="lg" breathe onClick={start}>
            {t('breathe.start')}
          </Button>
        )}
        <p className="text-text-muted text-center text-sm">{t('breathe.note')}</p>
      </div>
    </>
  );
}
