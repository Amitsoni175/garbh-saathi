import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { shlokaById, useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button, Card, EmptyState, Toggle } from '@/components/ui';
import { player } from '@/lib/audio';
import { tx } from '@/lib/content';

export default function ShlokaScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const { plan } = useTodayPlan();
  const { settings } = useSettings();
  const complete = useComplete();
  const [showTranslit, setShowTranslit] = useState(true);
  const shloka = shlokaById(id || plan?.shlokaId);

  if (!shloka) return <EmptyState emoji="🙏" title={t('shloka.notFound')} />;
  const lang = settings.textLang;

  function listen() {
    if (!shloka) return;
    void player.play({
      id: `shloka:${shloka.id}`,
      title: tx(shloka.title, lang),
      lang: settings.audioLang,
      recordingRef: `shloka:${shloka.id}`,
      file: shloka.audio ?? shloka.id,
      fileDir: 'shlokas',
      tts: { hi: [shloka.devanagari.replace(/\n/g, ' ')], en: [shloka.simple, shloka.meaning.en] },
    });
  }

  return (
    <>
      <ScreenHeader title={t('shloka.title')} subtitle={tx(shloka.title, lang)} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card>
          <p lang="sa" className="font-deva text-2xl leading-loose whitespace-pre-line">
            {shloka.devanagari}
          </p>
          {showTranslit && (
            <p className="text-text-muted mt-3 whitespace-pre-line italic">
              {shloka.transliteration}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={listen} icon="🔊">
              {t('shloka.listen')}
            </Button>
          </div>
          <Toggle
            label={t('shloka.showTranslit')}
            checked={showTranslit}
            onChange={setShowTranslit}
          />
        </Card>
        <Card tone="calm" index={1}>
          <h2 className="font-semibold">{t('shloka.meaning')}</h2>
          <p className="mt-1">{tx(shloka.meaning, lang)}</p>
        </Card>
        <p className="text-text-muted text-center">{t('shloka.sayIt')}</p>
        <div className="flex justify-center">
          <Button
            size="lg"
            breathe
            onClick={() => {
              void complete('shloka', shloka.id).then(() => navigate('/'));
            }}
          >
            {t('shloka.done')}
          </Button>
        </div>
      </div>
    </>
  );
}
