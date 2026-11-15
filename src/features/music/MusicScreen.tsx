import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useRagaNow, useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Card } from '@/components/ui';
import { getLokGeet, getMantras, tx } from '@/lib/content';

export default function MusicScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const { dayNumber } = useTodayPlan();
  const raga = useRagaNow(dayNumber);
  const songs = getLokGeet().filter((s) => s.lines.length > 0);

  return (
    <>
      <ScreenHeader title={t('music.title')} subtitle={t('music.subtitle')} fallback="/play" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        {raga && (
          <Card
            tone="secondary"
            onClick={() => void navigate(`/music/raga/${raga.id}`)}
            ariaLabel={`${t('music.ragaNow')}: ${tx(raga.name, lang)}`}
          >
            <p className="text-sm font-semibold">{t('music.ragaNow')}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">
                {raga.emoji}
              </span>
              <div>
                <p className="text-xl font-bold">{tx(raga.name, lang)}</p>
                <p className="text-sm">
                  {tx(raga.mood, lang)} · {tx(raga.time, lang)}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card index={1}>
          <h2 className="mb-2 font-bold">📿 {t('music.mantras')}</h2>
          <div className="flex flex-wrap gap-2">
            {getMantras().map((mn) => (
              <button
                key={mn.id}
                type="button"
                onClick={() => void navigate(`/music/mantra/${mn.id}`)}
                className="bg-background min-h-12 rounded-full px-4 font-semibold"
              >
                {tx(mn.name, lang)}
              </button>
            ))}
          </div>
        </Card>

        <Card
          index={2}
          tone="calm"
          onClick={() => void navigate('/music/breathe')}
          ariaLabel={t('music.breathe')}
        >
          <p className="text-lg font-bold">🫧 {t('music.breathe')}</p>
          <p className="text-sm">{t('music.breatheText')}</p>
        </Card>

        <Card
          index={3}
          tone="accent"
          onClick={() => void navigate('/music/lokgeet')}
          ariaLabel={t('music.lokgeet')}
        >
          <p className="text-lg font-bold">🎶 {t('music.lokgeet')}</p>
          <p className="text-sm">{t('music.lokgeetText')}</p>
        </Card>

        <Card index={4}>
          <h2 className="mb-2 font-bold">🎤 {t('music.sing')}</h2>
          <ul className="flex flex-col gap-2">
            {songs.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => void navigate(`/music/sing/${s.id}`)}
                  className="rounded-soft bg-background flex min-h-12 w-full items-center gap-3 px-3 text-left"
                >
                  <span aria-hidden="true">{s.emoji}</span>
                  <span className="font-semibold">{tx(s.title, lang)}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
