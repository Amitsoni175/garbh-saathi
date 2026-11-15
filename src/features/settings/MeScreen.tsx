import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useProfile } from '@/app/profile';
import { useSettings, type AudioLang, type TextSize } from '@/app/settings';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { Button, Card, ChipGroup, PageHeader, Toggle, useToast } from '@/components/ui';
import type { StringKey } from '@/lib/i18n';
import { parseLocalDate } from '@/lib/pregnancy';
import type { Lang } from '@/lib/i18n';
import type { NightModeSetting } from '@/lib/timeOfDay';

const DEBUG_TAPS = 7;

const BONDING: { key: StringKey; emoji: string; to: string }[] = [
  { key: 'me.link.journal', emoji: '💌', to: '/bonding/journal' },
  { key: 'me.link.talk', emoji: '🗣️', to: '/talk' },
  { key: 'me.link.papa', emoji: '💙', to: '/bonding/papa' },
  { key: 'me.link.photos', emoji: '📸', to: '/bonding/photos' },
  { key: 'me.link.kicks', emoji: '👣', to: '/bonding/kicks' },
  { key: 'me.link.garden', emoji: '🌳', to: '/garden' },
];

const CARE: { key: StringKey; emoji: string; to: string }[] = [
  { key: 'me.link.wellness', emoji: '🌿', to: '/wellness' },
  { key: 'me.link.help', emoji: '🆘', to: '/me/help' },
  { key: 'me.link.schedule', emoji: '⏰', to: '/me/schedule' },
  { key: 'me.link.festivals', emoji: '🪔', to: '/festivals' },
  { key: 'me.link.godhBharai', emoji: '🎉', to: '/me/godh-bharai' },
  { key: 'me.link.keepsake', emoji: '🖨️', to: '/me/keepsake' },
  { key: 'me.link.backup', emoji: '💾', to: '/me/backup' },
];

function LinkGrid({
  items,
  onGo,
  label,
}: {
  items: { key: StringKey; emoji: string; to: string }[];
  onGo: (to: string) => void;
  label: string;
}) {
  const t = useT();
  return (
    <ul className="grid grid-cols-3 gap-2" aria-label={label}>
      {items.map((item) => (
        <li key={item.to}>
          <button
            type="button"
            onClick={() => onGo(item.to)}
            className="rounded-soft bg-background flex min-h-20 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-center text-xs font-semibold"
          >
            <span className="text-2xl" aria-hidden="true">
              {item.emoji}
            </span>
            {t(item.key)}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function MeScreen() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const { profile } = useProfile();
  const state = usePregnancy();
  const edd = profile ? parseLocalDate(profile.edd) : null;
  const [taps, setTaps] = useState(0);
  const resetTimer = useRef<number | undefined>(undefined);

  function onVersionTap() {
    window.clearTimeout(resetTimer.current);
    const next = taps + 1;
    if (next >= DEBUG_TAPS) {
      setTaps(0);
      void navigate('/me/debug');
      return;
    }
    setTaps(next);
    if (next >= 3)
      toast({ message: t('settings.debugTapsLeft', { count: DEBUG_TAPS - next }), duration: 1200 });
    resetTimer.current = window.setTimeout(() => setTaps(0), 3000);
  }

  return (
    <>
      <PageHeader title={t('me.title')} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        {profile && state && (
          <Card tone="primary" ariaLabel={t('me.journey')}>
            <p className="text-sm font-semibold">{t('me.journey')}</p>
            <p className="text-xl font-bold">
              {profile.motherName || t('today.defaultName')}
              {profile.babyNickname ? ` & ${profile.babyNickname}` : ''} 🌸
            </p>
            <p>{t('today.weekDay', { week: state.weeks, day: state.days })}</p>
            {edd && <p className="text-sm">{t('me.edd', { date: format(edd, 'd MMMM yyyy') })}</p>}
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => void navigate('/me/profile')}
            >
              ✏️ {t('me.edit')}
            </Button>
          </Card>
        )}
        <Card index={1}>
          <h2 className="mb-2 font-bold">{t('me.bonding')}</h2>
          <LinkGrid items={BONDING} onGo={(to) => void navigate(to)} label={t('me.bonding')} />
        </Card>
        <Card index={2}>
          <h2 className="mb-2 font-bold">{t('me.care')}</h2>
          <LinkGrid items={CARE} onGo={(to) => void navigate(to)} label={t('me.care')} />
        </Card>
        <h2 className="mt-2 text-lg font-bold">{t('me.settings')}</h2>
        <Card index={3} ariaLabel={t('settings.textLang')}>
          <h2 className="mb-2 font-semibold">{t('settings.textLang')}</h2>
          <ChipGroup<Lang>
            label={t('settings.textLang')}
            value={settings.textLang}
            onChange={(textLang) => update({ textLang })}
            options={[
              { value: 'hinglish', label: t('settings.lang.hinglish') },
              { value: 'en', label: t('settings.lang.en') },
            ]}
          />
          <h2 className="mt-4 mb-2 font-semibold">{t('settings.audioLang')}</h2>
          <ChipGroup<AudioLang>
            label={t('settings.audioLang')}
            value={settings.audioLang}
            onChange={(audioLang) => update({ audioLang })}
            options={[
              { value: 'hi', label: t('settings.lang.hi') },
              { value: 'en', label: t('settings.lang.en') },
            ]}
          />
        </Card>

        <Card index={1} ariaLabel={t('settings.nightMode')}>
          <h2 className="mb-1 font-semibold">{t('settings.nightMode')}</h2>
          <p className="text-text-muted mb-3 text-sm">{t('settings.nightAutoHint')}</p>
          <ChipGroup<NightModeSetting>
            label={t('settings.nightMode')}
            value={settings.nightMode}
            onChange={(nightMode) => update({ nightMode })}
            options={[
              { value: 'auto', label: t('settings.night.auto') },
              { value: 'day', label: t('settings.night.day') },
              { value: 'night', label: t('settings.night.night') },
            ]}
          />
          <h2 className="mt-4 mb-2 font-semibold">{t('settings.textSize')}</h2>
          <ChipGroup<TextSize>
            label={t('settings.textSize')}
            value={settings.textSize}
            onChange={(textSize) => update({ textSize })}
            options={[
              { value: 'normal', label: t('settings.size.normal') },
              { value: 'large', label: t('settings.size.large') },
              { value: 'xl', label: t('settings.size.xl') },
            ]}
          />
        </Card>

        <Card index={2}>
          <Toggle
            label={t('settings.sounds')}
            checked={settings.sounds}
            onChange={(sounds) => update({ sounds })}
          />
          <Toggle
            label={t('settings.vibration')}
            checked={settings.vibration}
            onChange={(vibration) => update({ vibration })}
          />
          <Toggle
            label={t('settings.relaxedTimer')}
            hint={t('settings.relaxedTimerHint')}
            checked={settings.relaxedTimer}
            onChange={(relaxedTimer) => update({ relaxedTimer })}
          />
        </Card>

        <Card index={3} ariaLabel={t('settings.about')}>
          <h2 className="font-semibold">{t('settings.about')}</h2>
          <p className="text-text-muted mt-1 text-sm">{t('settings.privacy')}</p>
          <button
            type="button"
            onClick={onVersionTap}
            className="text-text-muted mt-2 min-h-12 text-sm"
          >
            {t('app.name')} · {t('settings.version', { version: __APP_VERSION__ })}
          </button>
        </Card>
      </div>
    </>
  );
}
