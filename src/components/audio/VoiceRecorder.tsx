import { m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/app/useT';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/Chip';
import type { RecordingKind } from '@/lib/db';
import { logError } from '@/lib/logger';
import {
  formatDuration,
  RecorderError,
  saveRecording,
  startRecording,
  type RecorderHandle,
} from '@/lib/recorder';

export type Who = 'mummy' | 'papa' | 'dadi' | 'nani' | 'other';

export interface VoiceRecorderProps {
  refId: string;
  kind: RecordingKind;
  /** Show the "who is speaking?" chips. */
  askWho?: boolean;
  label?: string;
  onSaved?: (id: number) => void;
  /** Big centred button (story/lok geet) vs. compact. */
  big?: boolean;
  startLabel?: string;
}

/** Record → Stop and save. Saves to IndexedDB. Friendly messages if the mic is blocked. */
export function VoiceRecorder({
  refId,
  kind,
  askWho = false,
  label,
  onSaved,
  big = false,
  startLabel,
}: VoiceRecorderProps) {
  const t = useT();
  const [who, setWho] = useState<Who>('mummy');
  const [handle, setHandle] = useState<RecorderHandle | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const handleRef = useRef<RecorderHandle | null>(null);

  useEffect(() => {
    if (!handle) return;
    const id = window.setInterval(() => setElapsed(Date.now() - handle.startedAt), 500);
    return () => window.clearInterval(id);
  }, [handle]);

  // Stop the microphone if she leaves the screen mid-recording.
  useEffect(() => () => handleRef.current?.cancel(), []);

  async function start() {
    setMessage(null);
    setBusy(true);
    try {
      const h = await startRecording();
      handleRef.current = h;
      setElapsed(0);
      setHandle(h);
    } catch (err) {
      const code = err instanceof RecorderError ? err.code : 'failed';
      setMessage(
        t(
          code === 'denied'
            ? 'rec.denied'
            : code === 'unsupported'
              ? 'rec.unsupported'
              : 'rec.failed',
        ),
      );
      if (code === 'failed') void logError(err);
    } finally {
      setBusy(false);
    }
  }

  async function stop() {
    if (!handle) return;
    setBusy(true);
    try {
      const result = await handle.stop();
      const id = await saveRecording({ refId, kind, who, label, ...result });
      setMessage(t('rec.saved'));
      onSaved?.(id);
    } catch (err) {
      void logError(err);
      setMessage(t('rec.failed'));
    } finally {
      handleRef.current = null;
      setHandle(null);
      setBusy(false);
    }
  }

  function cancel() {
    handle?.cancel();
    handleRef.current = null;
    setHandle(null);
  }

  return (
    <div className={`flex flex-col gap-3 ${big ? 'items-center text-center' : ''}`}>
      {askWho && !handle && (
        <div>
          <p className="mb-2 text-sm font-semibold">{t('rec.who')}</p>
          <ChipGroup<Who>
            label={t('rec.who')}
            value={who}
            onChange={setWho}
            options={(['mummy', 'papa', 'dadi', 'nani', 'other'] as const).map((w) => ({
              value: w,
              label: t(`rec.who.${w}`),
            }))}
          />
        </div>
      )}
      {handle ? (
        <div className={`flex flex-wrap items-center gap-3 ${big ? 'justify-center' : ''}`}>
          <m.span
            className="bg-primary h-4 w-4 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden="true"
          />
          <span role="status" className="font-semibold">
            {t('rec.recording', { time: formatDuration(elapsed) })}
          </span>
          <Button onClick={() => void stop()} disabled={busy}>
            ⏹ {t('rec.stop')}
          </Button>
          <Button variant="ghost" onClick={cancel}>
            {t('rec.cancel')}
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          size={big ? 'lg' : 'md'}
          onClick={() => void start()}
          disabled={busy}
        >
          🎙️ {startLabel ?? t('rec.start')}
        </Button>
      )}
      {message && (
        <p role="status" className="text-text-muted text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
