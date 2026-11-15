import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { VoiceRecorder } from '@/components/audio/VoiceRecorder';
import { Button, Card } from '@/components/ui';
import { getTodayISO } from '@/lib/clock';
import { getPrompts, tx } from '@/lib/content';
import { rotate } from '@/lib/plan';

export default function PapaCornerScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const complete = useComplete();
  const { plan, offset } = useTodayPlan();
  const papa = getPrompts().papa;
  const today = papa.find((p) => p.id === plan?.papaPromptId) ?? rotate(papa, offset);
  const earlier = [1, 2, 3]
    .map((d) => rotate(papa, offset - d))
    .filter((p) => p && p.id !== today?.id);

  return (
    <>
      <ScreenHeader title={t('papa.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <p className="text-text-muted">{t('papa.intro')}</p>
        {today && (
          <Card tone="secondary">
            <p className="text-sm font-semibold">💙 {t('papa.today')}</p>
            <p className="mt-2 text-xl leading-snug font-bold">{tx(today.text, lang)}</p>
          </Card>
        )}
        <Card index={1}>
          <h2 className="mb-2 font-semibold">{t('papa.record')}</h2>
          <VoiceRecorder refId={`papa:${getTodayISO()}`} kind="talk" />
        </Card>
        <div className="flex justify-center">
          <Button
            size="lg"
            breathe
            onClick={() => void complete('papa', today?.id).then(() => navigate('/'))}
          >
            {t('papa.done')}
          </Button>
        </div>
        {earlier.length > 0 && (
          <Card index={2}>
            <h2 className="mb-2 font-semibold">{t('papa.earlier')}</h2>
            <ul className="flex flex-col gap-2">
              {earlier.map(
                (p) =>
                  p && (
                    <li key={p.id} className="rounded-soft bg-background p-3">
                      {tx(p.text, lang)}
                    </li>
                  ),
              )}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
