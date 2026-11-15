import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useT } from '@/app/useT';
import { BottomSheet, Button, Card, useToast } from '@/components/ui';
import {
  backupFileName,
  createBackup,
  lastBackupAt,
  markBackedUp,
  parseBackup,
  restoreBackup,
  type BackupFile,
  type BackupSummary,
} from '@/lib/backup';
import { getTodayISO } from '@/lib/clock';
import { logError } from '@/lib/logger';
import { downloadBlob } from '@/lib/photos';

export default function BackupScreen() {
  const t = useT();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);
  const [pending, setPending] = useState<{ file: BackupFile; summary: BackupSummary } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void lastBackupAt().then(setLast);
  }, []);

  async function exportNow() {
    setBusy(t('backup.exporting'));
    setMessage(null);
    try {
      const file = await createBackup(__APP_VERSION__);
      const name = backupFileName(getTodayISO());
      const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
      const shareFile = new File([blob], name, { type: 'application/json' });
      if (navigator.canShare?.({ files: [shareFile] })) {
        await navigator
          .share({ files: [shareFile], title: name })
          .catch(() => downloadBlob(blob, name));
      } else downloadBlob(blob, name);
      await markBackedUp();
      setLast(new Date().toISOString());
      setMessage(t('backup.exported', { file: name }));
    } catch (err) {
      void logError(err);
      setMessage(t('backup.failed'));
    } finally {
      setBusy(null);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(t('backup.reading'));
    setMessage(null);
    try {
      const result = parseBackup(await f.text());
      if (result.ok) setPending({ file: result.file, summary: result.summary });
      else setMessage(t('backup.invalid'));
    } catch (err) {
      void logError(err);
      setMessage(t('backup.invalid'));
    } finally {
      setBusy(null);
    }
  }

  async function confirmRestore() {
    if (!pending) return;
    const ok = await restoreBackup(pending.file);
    setPending(null);
    if (ok) {
      toast({ message: t('backup.restored') });
      // Reload so settings, profile and every screen pick up the restored data.
      window.setTimeout(() => window.location.reload(), 1200);
    } else setMessage(t('backup.failed'));
  }

  const s = pending?.summary;
  return (
    <>
      <ScreenHeader title={t('backup.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <p>{t('backup.why')}</p>
        <p className="text-text-muted text-sm">
          {last
            ? t('backup.last', { date: format(new Date(last), 'd MMMM yyyy') })
            : t('backup.never')}
        </p>
        <Card tone="calm">
          <Button size="lg" onClick={() => void exportNow()} disabled={!!busy}>
            💾 {t('backup.export')}
          </Button>
        </Card>
        <Card index={1}>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={!!busy}>
            📂 {t('backup.import')}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => void onFile(e)}
          />
        </Card>
        {busy && <p role="status">{busy}</p>}
        {message && (
          <p role="status" className="rounded-soft bg-secondary/40 p-3">
            {message}
          </p>
        )}
      </div>
      <BottomSheet
        open={!!pending}
        onClose={() => setPending(null)}
        title={t('backup.import')}
        closeLabel={t('ui.close')}
      >
        {s && (
          <div className="flex flex-col gap-3">
            <p className="font-semibold">
              {t('backup.summary', {
                date: s.exportedAt ? format(new Date(s.exportedAt), 'd MMMM yyyy') : '?',
              })}
            </p>
            <p>
              {t('backup.counts', {
                journal: s.journal,
                photos: s.photos,
                recordings: s.recordings,
                completions: s.completions,
                events: s.events,
                kicks: s.kicks,
              })}
            </p>
            <p className="rounded-soft bg-accent/60 text-on-fill p-3 text-sm">
              ⚠️ {t('backup.replaceWarn')}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => void confirmRestore()}>{t('backup.confirm')}</Button>
              <Button variant="ghost" onClick={() => setPending(null)}>
                {t('backup.cancel')}
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
