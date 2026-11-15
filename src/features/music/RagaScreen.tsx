import { useNavigate, useParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { usePlayer } from '@/app/usePlayer';
import { useRagaNow, useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { player } from '@/lib/audio';
import { getRagas, tx } from '@/lib/content';
import { MissingAudioNote } from './MissingAudioNote';
import { useAudioFile } from './useAudioFile';

export default function RagaScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const complete = useComplete();
  const audio = usePlayer();
  const { dayNumber, plan } = useTodayPlan();
  const now = useRagaNow(dayNumber, plan?.ragaSlot ?? null);
  const raga = getRagas().find((r) => r.id === id) ?? now;
  const file = useAudioFile(raga?.id, 'ragas');
  if (!raga) return null;
  const playing = audio.track?.id === `raga:${raga.id}` && audio.status === 'playing';

  return (
    <>
      <ScreenHeader title={tx(raga.name, lang)} subtitle={t('raga.title')} fallback="/music" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="secondary">
          <p className="text-6xl" aria-hidden="true">
            {raga.emoji}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{tx(raga.name, lang)}</h2>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <dt className="font-semibold">{t('raga.mood')}</dt>
            <dd>{tx(raga.mood, lang)}</dd>
            <dt className="font-semibold">{t('raga.bestTime')}</dt>
            <dd>{tx(raga.time, lang)}</dd>
          </dl>
          <p className="mt-3">{tx(raga.note, lang)}</p>
        </Card>

        {file === 'missing' && <MissingAudioNote file={raga.id} dir="ragas" />}
        {file === 'checking' && <p className="text-text-muted text-sm">{t('audio.checking')}</p>}

        <div className="flex flex-wrap justify-center gap-2">
          {file === 'present' && (
            <Button
              size="lg"
              icon={playing ? '⏸' : '▶'}
              onClick={() =>
                playing
                  ? player.pause()
                  : void player.play({
                      id: `raga:${raga.id}`,
                      title: tx(raga.name, lang),
                      lang: settings.audioLang,
                      file: raga.id,
                      fileDir: 'ragas',
                    })
              }
            >
              {playing ? t('player.pause') : t('raga.play')}
            </Button>
          )}
          <Button variant="calm" onClick={() => void navigate(`/music/breathe?raga=${raga.id}`)}>
            🫧 {t('raga.breatheInstead')}
          </Button>
        </div>
        <div className="flex justify-center">
          <Button breathe onClick={() => void complete('raga', raga.id).then(() => navigate('/'))}>
            {t('raga.listened')}
          </Button>
        </div>

        <Card index={1}>
          <h2 className="mb-2 font-bold">{t('raga.all')}</h2>
          <ul className="flex flex-col gap-2">
            {getRagas().map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => void navigate(`/music/raga/${r.id}`, { replace: true })}
                  aria-current={r.id === raga.id}
                  className={`rounded-soft flex min-h-12 w-full items-center gap-3 px-3 text-left ${r.id === raga.id ? 'bg-secondary text-on-fill' : 'bg-background'}`}
                >
                  <span aria-hidden="true">{r.emoji}</span>
                  <span className="flex-1 font-semibold">{tx(r.name, lang)}</span>
                  <span className="text-sm">
                    {t(`raga.slot.${r.slot}`)}
                    {r.id === now?.id ? ` · ${t('raga.now')}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
