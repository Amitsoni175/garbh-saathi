import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useCompleteOnce } from '@/app/useComplete';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { getTips, tx } from '@/lib/content';
import { seasonForMonth } from '@/lib/season';
import { LowMoodCard, MoodCard, TabletCard, WaterCard } from './CareCards';
import { useCare } from './useCare';

export default function WellnessScreen() {
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const state = usePregnancy();
  const care = useCare();
  const completeOnce = useCompleteOnce();
  const tips = getTips();
  const season = seasonForMonth(care.month);
  const seasonal = tips.seasonal[season];
  const tri = String(state?.trimester ?? 1) as '1' | '2' | '3';
  const food = [
    ...tips.food.filter((f) => f.season === season),
    ...tips.food.filter((f) => !f.season),
  ];

  return (
    <>
      <ScreenHeader title={t('well.title')} subtitle={t('well.subtitle')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <LowMoodCard />
        <MoodCard />
        <TabletCard index={1} />
        <WaterCard index={2} />

        <Card index={3} tone="calm">
          <h2 className="font-bold">{tx(seasonal.title, lang)}</h2>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
            {seasonal.tips.map((tip) => (
              <li key={tip.en}>{tx(tip, lang)}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs">{t('well.doctorNote')}</p>
        </Card>

        <Card index={4}>
          <h2 className="font-bold">🍲 {t('food.title')}</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {food.map((f) => (
              <li
                key={f.id}
                className={`rounded-soft p-3 ${f.caution ? 'bg-accent/50' : 'bg-background'}`}
              >
                {f.caution && <span className="mr-1 text-xs font-bold">{t('food.caution')} ·</span>}
                {tx(f.text, lang)}
                {f.askDoctor && (
                  <span className="mt-1 block text-xs font-semibold">
                    👩‍⚕️ {t('well.doctorNote')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card index={5}>
          <h2 className="font-bold">🧘 {t('yoga.title', { tri })}</h2>
          <p className="rounded-soft bg-accent/60 text-on-fill mt-1 p-3 text-sm font-semibold">
            ⚠️ {t('yoga.note')}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {tips.yoga[tri].map((y) => (
              <li key={y.id} className="rounded-soft bg-background p-3">
                <p className="font-semibold">{tx(y.title, lang)}</p>
                <p className="text-sm">{tx(y.steps, lang)}</p>
              </li>
            ))}
          </ul>
          <Button className="mt-3" variant="calm" onClick={() => void completeOnce('yoga')}>
            {t('yoga.done')}
          </Button>
        </Card>
      </div>
    </>
  );
}
