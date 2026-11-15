import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import { db, kvSet } from '@/lib/db';

const MONTH = 30 * 24 * 3600 * 1000;
const WEEK = 7 * 24 * 3600 * 1000;

/** A gentle monthly reminder to back up, once there is something worth keeping. */
export function BackupReminder({ nowMs }: { nowMs: number }) {
  const t = useT();
  const navigate = useNavigate();
  const state = useLiveQuery(async () => {
    const [count, last, snoozed] = await Promise.all([
      db.completions.count(),
      db.kv.get('lastBackupAt'),
      db.kv.get('backupReminderSnoozedAt'),
    ]);
    return {
      count,
      last: last?.value as string | undefined,
      snoozed: snoozed?.value as string | undefined,
    };
  }, []);
  if (!state || state.count < 10) return null;
  const lastMs = state.last ? Date.parse(state.last) : 0;
  const snoozedMs = state.snoozed ? Date.parse(state.snoozed) : 0;
  if (nowMs - lastMs < MONTH || nowMs - snoozedMs < WEEK) return null;
  return (
    <Card tone="secondary">
      <h2 className="font-bold">{t('backup.reminderTitle')}</h2>
      <p className="mt-1 text-sm">{t('backup.reminderText')}</p>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => void navigate('/me/backup')}>{t('backup.export')}</Button>
        <Button
          variant="ghost"
          onClick={() => void kvSet('backupReminderSnoozedAt', new Date(nowMs).toISOString())}
        >
          {t('backup.reminderLater')}
        </Button>
      </div>
    </Card>
  );
}
