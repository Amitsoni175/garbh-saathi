import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSettings, type AudioLang, type TextSize } from '@/app/settings';
import { useT } from '@/app/useT';
import { Card, ChipGroup, PageHeader, Toggle, useToast } from '@/components/ui';
import type { Lang } from '@/lib/i18n';
import type { NightModeSetting } from '@/lib/timeOfDay';

const DEBUG_TAPS = 7;

export default function MeScreen() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const { settings, update } = useSettings();
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
        <Card index={0} ariaLabel={t('settings.textLang')}>
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
