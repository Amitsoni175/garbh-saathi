import { format } from 'date-fns';
import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProfile } from '@/app/profile';
import { useSettings, type AudioLang } from '@/app/settings';
import { useT } from '@/app/useT';
import { Button, ChipGroup } from '@/components/ui';
import { inputClass } from '@/components/ui/styles';
import { getToday, getTodayISO } from '@/lib/clock';
import { requestPersistentStorage } from '@/lib/pwa';
import type { Lang } from '@/lib/i18n';
import {
  computePregnancy,
  parseLocalDate,
  resolveDateInput,
  toLocalISO,
  type DateKind,
} from '@/lib/pregnancy';

/** Three short screens: welcome → dates → about you (skippable). */
export default function OnboardingScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { save } = useProfile();
  const { settings, update } = useSettings();
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<DateKind>('lmp');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [nick, setNick] = useState('');

  const today = getToday();
  const result = date ? resolveDateInput(kind, date, today) : null;
  const state = result?.ok ? computePregnancy(result.lmp, today) : null;
  const min = toLocalISO(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - (kind === 'lmp' ? 300 : 30)),
  );
  const max = toLocalISO(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + (kind === 'lmp' ? 0 : 300)),
  );

  async function finish(useDetails: boolean) {
    if (!result?.ok) return;
    await save({
      motherName: useDetails ? name.trim() : '',
      babyNickname: useDetails ? nick.trim() : '',
      lmp: result.lmp,
      edd: result.edd,
      dateKind: kind,
      startDate: getTodayISO(),
      createdAt: new Date().toISOString(),
    });
    void requestPersistentStorage();
    void navigate('/', { replace: true });
  }

  const eddText = result?.ok ? format(parseLocalDate(result.edd) ?? today, 'd MMMM yyyy') : '';

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,var(--gs-bottom-inset))]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2" aria-label={t('onb.stepOf', { step: step + 1 })} role="img">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === step ? 'bg-primary w-8' : 'bg-secondary w-2.5'}`}
            />
          ))}
        </div>
        {step > 0 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            ← {t('onb.back')}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <m.section
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-5"
        >
          {step === 0 && (
            <>
              <div className="mt-10 text-center text-7xl" aria-hidden="true">
                🌸
              </div>
              <h1 className="text-center text-2xl font-bold">{t('onb.welcomeTitle')}</h1>
              <p className="text-text-muted text-center">{t('onb.welcomeText')}</p>
              <div className="mt-2">
                <ChipGroup<Lang>
                  label={t('settings.textLang')}
                  value={settings.textLang}
                  onChange={(textLang) => update({ textLang })}
                  options={[
                    { value: 'hinglish', label: 'Hinglish' },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </div>
              <div className="mt-auto flex justify-center">
                <Button size="lg" breathe onClick={() => setStep(1)}>
                  {t('onb.start')}
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold">{t('onb.datesTitle')}</h1>
              <ChipGroup<DateKind>
                label={t('onb.datesTitle')}
                value={kind}
                onChange={(k) => {
                  setKind(k);
                  setDate('');
                }}
                options={[
                  { value: 'lmp', label: t('onb.byLmp') },
                  { value: 'edd', label: t('onb.byEdd') },
                ]}
              />
              <label className="flex flex-col gap-2">
                <span className="font-semibold">
                  {kind === 'lmp' ? t('onb.lmpLabel') : t('onb.eddLabel')}
                </span>
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  min={min}
                  max={max}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <div aria-live="polite" className="min-h-20">
                {result && !result.ok && (
                  <p className="rounded-soft bg-accent text-on-fill p-4">
                    {t(`dateError.${result.error}`)}
                  </p>
                )}
                {state && (
                  <m.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-soft bg-calm text-on-fill p-4 text-lg font-semibold"
                  >
                    🌱 {t('onb.result', { week: state.weeks, day: state.days, edd: eddText })}
                  </m.p>
                )}
              </div>
              <div className="mt-auto flex justify-center">
                <Button size="lg" onClick={() => setStep(2)} disabled={!state}>
                  {t('onb.next')} →
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold">{t('onb.aboutTitle')}</h1>
              <label className="flex flex-col gap-2">
                <span className="font-semibold">{t('onb.nameLabel')}</span>
                <input
                  className={inputClass}
                  value={name}
                  autoComplete="given-name"
                  placeholder={t('onb.namePlaceholder')}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-semibold">{t('onb.nickLabel')}</span>
                <input
                  className={inputClass}
                  value={nick}
                  placeholder={t('onb.nickPlaceholder')}
                  onChange={(e) => setNick(e.target.value)}
                />
              </label>
              <div>
                <p className="mb-2 font-semibold">{t('settings.audioLang')}</p>
                <ChipGroup<AudioLang>
                  label={t('settings.audioLang')}
                  value={settings.audioLang}
                  onChange={(audioLang) => update({ audioLang })}
                  options={[
                    { value: 'hi', label: t('settings.lang.hi') },
                    { value: 'en', label: t('settings.lang.en') },
                  ]}
                />
              </div>
              <p className="rounded-soft bg-secondary/40 p-4 text-sm">{t('onb.scheduleHint')}</p>
              <div className="mt-auto flex flex-col items-center gap-2">
                <Button size="lg" breathe onClick={() => void finish(true)}>
                  {t('onb.finish')}
                </Button>
                <Button variant="ghost" onClick={() => void finish(false)}>
                  {t('onb.skip')}
                </Button>
              </div>
            </>
          )}
        </m.section>
      </AnimatePresence>
    </main>
  );
}
