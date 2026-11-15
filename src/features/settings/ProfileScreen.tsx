import { useState } from 'react';
import { useProfile } from '@/app/profile';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useT } from '@/app/useT';
import { Button, Card, ChipGroup, useToast } from '@/components/ui';
import { inputClass } from '@/components/ui/styles';
import { getToday } from '@/lib/clock';
import { computePregnancy, resolveDateInput, type DateKind } from '@/lib/pregnancy';

export default function ProfileScreen() {
  const t = useT();
  const toast = useToast();
  const { profile, update } = useProfile();
  const [name, setName] = useState(profile?.motherName ?? '');
  const [nick, setNick] = useState(profile?.babyNickname ?? '');
  const [kind, setKind] = useState<DateKind>(profile?.dateKind ?? 'edd');
  const [date, setDate] = useState(
    profile ? (profile.dateKind === 'lmp' ? profile.lmp : profile.edd) : '',
  );
  if (!profile) return null;
  const today = getToday();
  const result = date ? resolveDateInput(kind, date, today) : null;

  async function save() {
    if (!result?.ok) return;
    await update({
      motherName: name.trim(),
      babyNickname: nick.trim(),
      lmp: result.lmp,
      edd: result.edd,
      dateKind: kind,
    });
    const s = computePregnancy(result.lmp, today);
    toast({ message: t('profile.saved', { week: s.weeks, day: s.days }) });
  }

  return (
    <>
      <ScreenHeader title={t('profile.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{t('onb.nameLabel')}</span>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-sm font-semibold">{t('onb.nickLabel')}</span>
            <input className={inputClass} value={nick} onChange={(e) => setNick(e.target.value)} />
          </label>
        </Card>
        <Card index={1}>
          <p className="mb-3 text-sm">{t('profile.datesNote')}</p>
          <ChipGroup<DateKind>
            label={t('onb.datesTitle')}
            value={kind}
            onChange={(k) => {
              setKind(k);
              setDate(k === 'lmp' ? profile.lmp : profile.edd);
            }}
            options={[
              { value: 'lmp', label: t('onb.byLmp') },
              { value: 'edd', label: t('onb.byEdd') },
            ]}
          />
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-sm font-semibold">
              {kind === 'lmp' ? t('onb.lmpLabel') : t('onb.eddLabel')}
            </span>
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          {result && !result.ok && (
            <p className="rounded-soft bg-accent text-on-fill mt-2 p-3">
              {t(`dateError.${result.error}`)}
            </p>
          )}
        </Card>
        <Button size="lg" onClick={() => void save()} disabled={!result?.ok}>
          {t('profile.save')}
        </Button>
      </div>
    </>
  );
}
