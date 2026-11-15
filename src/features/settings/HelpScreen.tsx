import { useState } from 'react';
import { useProfile } from '@/app/profile';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useT } from '@/app/useT';
import { Button, Card, useToast } from '@/components/ui';
import { inputClass } from '@/components/ui/styles';
import type { StringKey } from '@/lib/i18n';

const DANGER: StringKey[] = [
  'help.danger.bleeding',
  'help.danger.headache',
  'help.danger.swelling',
  'help.danger.movements',
  'help.danger.fluid',
  'help.danger.fever',
  'help.danger.pain',
];

function CallButton({
  number,
  label,
  tone = 'bg-primary',
}: {
  number: string;
  label: string;
  tone?: string;
}) {
  return (
    <a
      href={`tel:${number.replace(/[^\d+]/g, '')}`}
      className={`rounded-soft text-on-fill shadow-soft flex min-h-14 items-center gap-3 px-4 font-bold ${tone}`}
    >
      <span aria-hidden="true">📞</span>
      {label}
    </a>
  );
}

export default function HelpScreen() {
  const t = useT();
  const toast = useToast();
  const { profile, update } = useProfile();
  const [form, setForm] = useState({
    doctorName: profile?.doctorName ?? '',
    doctorPhone: profile?.doctorPhone ?? '',
    hospitalName: profile?.hospitalName ?? '',
    hospitalPhone: profile?.hospitalPhone ?? '',
  });

  return (
    <>
      <ScreenHeader title={t('help.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card>
          <h2 className="mb-3 font-bold">{t('help.emergency')}</h2>
          <div className="flex flex-col gap-2">
            <CallButton number="108" label={t('help.ambulance')} />
            <CallButton number="104" label={t('help.health')} tone="bg-secondary" />
            <CallButton number="14416" label={t('help.telemanas')} tone="bg-calm" />
          </div>
        </Card>

        <Card index={1} tone="accent">
          <h2 className="font-bold">{t('help.dangerTitle')}</h2>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
            {DANGER.map((k) => (
              <li key={k}>{t(k)}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold">{t('help.calmNote')}</p>
        </Card>

        <Card index={2}>
          <h2 className="mb-3 font-bold">{t('help.myContacts')}</h2>
          <div className="mb-3 flex flex-col gap-2">
            {profile?.doctorPhone && (
              <CallButton
                number={profile.doctorPhone}
                label={t('help.call', { name: profile.doctorName || t('help.doctorName') })}
              />
            )}
            {profile?.hospitalPhone && (
              <CallButton
                number={profile.hospitalPhone}
                label={t('help.call', { name: profile.hospitalName || t('help.hospitalName') })}
                tone="bg-secondary"
              />
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {(
              [
                ['doctorName', 'help.doctorName', 'text'],
                ['doctorPhone', 'help.doctorPhone', 'tel'],
                ['hospitalName', 'help.hospitalName', 'text'],
                ['hospitalPhone', 'help.hospitalPhone', 'tel'],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{t(label)}</span>
                <input
                  className={inputClass}
                  type={type}
                  inputMode={type === 'tel' ? 'tel' : undefined}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </label>
            ))}
            <Button
              onClick={() => {
                void update(form).then(() => toast({ message: t('help.saved') }));
              }}
            >
              {t('help.save')}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
