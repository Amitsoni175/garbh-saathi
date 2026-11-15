import { m } from 'motion/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useT } from '@/app/useT';
import { Button, Card, ChipGroup, ProgressRing } from '@/components/ui';
import { player } from '@/lib/audio';
import { getMantras, tx } from '@/lib/content';
import { bell, vibrate } from '@/lib/feedback';
import { MissingAudioNote } from './MissingAudioNote';
import { useAudioFile } from './useAudioFile';

type Target = '11' | '21' | '108';

export default function MantraScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const complete = useComplete();
  const mantras = getMantras();
  const mantra = mantras.find((x) => x.id === id) ?? mantras[0];
  const [target, setTarget] = useState<Target>('11');
  const [count, setCount] = useState(0);
  const file = useAudioFile(mantra?.audio, 'mantras');
  if (!mantra) return null;
  const goal = Number(target);
  const done = count >= goal;

  function tap() {
    if (!mantra || done) return;
    const next = count + 1;
    setCount(next);
    vibrate(10);
    if (next >= goal) {
      bell();
      if (player.getState().track?.id === `mantra:${mantra.id}`) player.stop();
      void complete('mantra', mantra.id, t('mantra.done'));
    }
  }

  return (
    <>
      <ScreenHeader title={t('mantra.title')} subtitle={tx(mantra.name, lang)} fallback="/music" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <ChipGroup<string>
          label={t('mantra.choose')}
          value={mantra.id}
          onChange={(v) => {
            setCount(0);
            void navigate(`/music/mantra/${v}`, { replace: true });
          }}
          options={mantras.map((x) => ({ value: x.id, label: tx(x.name, lang) }))}
        />
        <Card>
          <p lang="sa" className="font-deva text-center text-xl leading-loose">
            {mantra.devanagari}
          </p>
          <p className="text-text-muted mt-2 text-center text-sm italic">
            {mantra.transliteration}
          </p>
          <p className="mt-2 text-center">{tx(mantra.meaning, lang)}</p>
        </Card>
        <div>
          <p className="mb-2 text-sm font-semibold">{t('mantra.target')}</p>
          <ChipGroup<Target>
            label={t('mantra.target')}
            value={target}
            onChange={(v) => {
              setTarget(v);
              setCount(0);
            }}
            options={[
              { value: '11', label: '11' },
              { value: '21', label: '21' },
              { value: '108', label: '108' },
            ]}
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <m.button
            type="button"
            onClick={tap}
            aria-label={t('mantra.tapLabel', { count })}
            whileTap={{ scale: 0.92 }}
            className="rounded-full"
          >
            <ProgressRing
              percent={(count / goal) * 100}
              size={200}
              stroke={12}
              label={t('mantra.count', { count, target: goal })}
              colour="secondary"
            >
              <span
                className={`flex h-36 w-36 flex-col items-center justify-center rounded-full ${done ? 'bg-calm' : 'animate-breathe bg-primary'} text-on-fill`}
              >
                <span className="text-4xl font-bold">{count}</span>
                <span className="text-sm">/ {goal}</span>
              </span>
            </ProgressRing>
          </m.button>
          <p className="text-text-muted text-center" role="status">
            {done ? t('mantra.done') : t('mantra.tap')}
          </p>
          {done && (
            <Button variant="secondary" onClick={() => setCount(0)}>
              🔄 {t('mantra.again')}
            </Button>
          )}
        </div>
        {file === 'present' && mantra.audio && (
          <Button
            variant="ghost"
            onClick={() =>
              void player.play({
                id: `mantra:${mantra.id}`,
                title: tx(mantra.name, lang),
                lang: settings.audioLang,
                file: mantra.audio,
                fileDir: 'mantras',
                loop: true,
              })
            }
          >
            🔁 {t('mantra.playLoop')}
          </Button>
        )}
        {file === 'missing' && mantra.audio && (
          <MissingAudioNote file={mantra.audio} dir="mantras" />
        )}
      </div>
    </>
  );
}
