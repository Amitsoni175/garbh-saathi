import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { useSettings } from '@/app/settings';
import { useT } from '@/app/useT';
import { Button } from '@/components/ui/Button';
import { player } from '@/lib/audio';
import { db, type RecordingRow } from '@/lib/db';
import { logError } from '@/lib/logger';
import { formatDuration } from '@/lib/recorder';
import type { StringKey } from '@/lib/i18n';

const WHO_KEYS: Record<string, StringKey> = {
  mummy: 'rec.who.mummy',
  papa: 'rec.who.papa',
  dadi: 'rec.who.dadi',
  nani: 'rec.who.nani',
  other: 'rec.who.other',
};

export interface RecordingListProps {
  refId?: string;
  kind?: RecordingRow['kind'];
  title?: string;
  showEmpty?: boolean;
}

/** Lists recordings (by refId or kind) with play and a confirmed delete. */
export function RecordingList({ refId, kind, title, showEmpty = false }: RecordingListProps) {
  const t = useT();
  const { settings } = useSettings();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const rows = useLiveQuery(async () => {
    const list = refId
      ? await db.recordings.where('refId').equals(refId).toArray()
      : kind
        ? await db.recordings.where('kind').equals(kind).toArray()
        : [];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }, [refId, kind]);

  if (!rows) return null;
  if (rows.length === 0)
    return showEmpty ? <p className="text-text-muted text-sm">{t('rec.none')}</p> : null;

  async function remove(id: number) {
    try {
      if (player.getState().track?.id === `rec:${id}`) player.stop();
      await db.recordings.delete(id);
    } catch (err) {
      void logError(err);
    }
    setConfirmId(null);
  }

  return (
    <div>
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      <ul className="flex flex-col gap-2">
        {rows.map((r) => {
          const who = WHO_KEYS[r.who] ? t(WHO_KEYS[r.who] as StringKey) : r.who;
          const name = r.label ? `${r.label} · ${who}` : who;
          return (
            <li
              key={r.id}
              className="rounded-soft bg-background flex flex-wrap items-center gap-2 p-3"
            >
              <button
                type="button"
                className="flex min-h-12 flex-1 items-center gap-3 text-left"
                aria-label={t('rec.play', { who: name })}
                onClick={() =>
                  void player.play({
                    id: `rec:${r.id}`,
                    title: name,
                    lang: settings.audioLang,
                    recordingId: r.id,
                  })
                }
              >
                <span
                  className="bg-primary text-on-fill flex h-10 w-10 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  ▶
                </span>
                <span>
                  <span className="block font-semibold">{name}</span>
                  <span className="text-text-muted block text-sm">
                    {new Date(r.createdAt).toLocaleDateString()} · {formatDuration(r.durationMs)}
                  </span>
                </span>
              </button>
              {confirmId === r.id ? (
                <span className="flex w-full flex-wrap items-center gap-2 text-sm">
                  {t('rec.deleteConfirm')}
                  <Button variant="accent" onClick={() => void remove(r.id as number)}>
                    {t('rec.deleteYes')}
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmId(null)}>
                    {t('rec.keep')}
                  </Button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(r.id ?? null)}
                  aria-label={t('rec.delete')}
                  className="text-text-muted flex min-h-12 min-w-12 items-center justify-center rounded-full"
                >
                  🗑️
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
