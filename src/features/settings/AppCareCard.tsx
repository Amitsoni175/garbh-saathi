import { useState, useSyncExternalStore } from 'react';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import { BottomSheet, Button, Card, Toggle, useToast } from '@/components/ui';
import { isIos, isStandalone } from '@/lib/notify';
import {
  canPromptInstall,
  checkForUpdate,
  fixApp,
  promptInstall,
  subscribeInstall,
} from '@/lib/pwa';

/** Install, Refresh app (check for updates) and Fix app (clears caches, keeps data). */
export function AppCareCard({ index = 0 }: { index?: number }) {
  const t = useT();
  const toast = useToast();
  const canInstall = useSyncExternalStore(subscribeInstall, canPromptInstall, () => false);
  const { settings, update } = useSettings();
  const [confirmFix, setConfirmFix] = useState(false);
  const installed = isStandalone();

  async function refresh() {
    toast({ message: t('update.checking'), duration: 1500 });
    window.dispatchEvent(new Event('gs:check-update'));
    const waiting = await checkForUpdate();
    if (!waiting) toast({ message: t('update.latest') });
  }

  return (
    <Card index={index}>
      <h2 className="mb-2 font-bold">{t('update.title')}</h2>
      {!installed && (
        <div className="mb-3">
          {canInstall ? (
            <Button
              onClick={() =>
                void promptInstall().then((ok) => ok && toast({ message: t('install.done') }))
              }
            >
              📲 {t('install.button')}
            </Button>
          ) : (
            <p className="text-sm">
              <span className="font-semibold">{t('install.title')}: </span>
              {isIos() ? t('install.ios') : t('install.android')}
            </p>
          )}
        </div>
      )}
      <Toggle
        label={t('update.auto')}
        hint={t('update.autoHint')}
        checked={settings.autoRefresh}
        onChange={(autoRefresh) => update({ autoRefresh })}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void refresh()}>
          🔄 {t('update.check')}
        </Button>
        <Button variant="ghost" onClick={() => setConfirmFix(true)}>
          🛠️ {t('update.fix')}
        </Button>
      </div>
      <BottomSheet
        open={confirmFix}
        onClose={() => setConfirmFix(false)}
        title={t('update.fix')}
        closeLabel={t('ui.close')}
      >
        <p className="mb-4">{t('update.fixExplain')}</p>
        <div className="flex gap-2">
          <Button onClick={() => void fixApp()}>{t('update.fixConfirm')}</Button>
          <Button variant="ghost" onClick={() => setConfirmFix(false)}>
            {t('backup.cancel')}
          </Button>
        </div>
      </BottomSheet>
    </Card>
  );
}
