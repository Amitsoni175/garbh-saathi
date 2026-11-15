import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSettings } from '@/app/settings';
import { useStories } from '@/app/useStories';
import { useT } from '@/app/useT';
import { BlobImage, BottomSheet, Button } from '@/components/ui';
import { player } from '@/lib/audio';
import { tx } from '@/lib/content';
import { db } from '@/lib/db';
import { logError } from '@/lib/logger';
import { parseLocalDate } from '@/lib/pregnancy';
import { moodEmoji } from '@/lib/wellness';
import { markerText, type Marker } from './markers';
import type { DayData } from './useMonthData';

export function DaySheet({
  date,
  data,
  markers,
  onClose,
  onAddEvent,
}: {
  date: string | null;
  data: DayData | null;
  markers: Marker[];
  onClose: () => void;
  onAddEvent: () => void;
}) {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const stories = useStories();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const d = date ? parseLocalDate(date) : null;
  const title = d ? format(d, 'EEEE, d MMMM yyyy') : '';

  const storyIds = [
    ...new Set(
      (data?.completions ?? [])
        .filter((c) => c.kind === 'story' && c.refId)
        .map((c) => c.refId as string),
    ),
  ];
  const games = (data?.completions ?? []).filter((c) => c.kind === 'game').length;
  const tablet = (data?.completions ?? []).some((c) => c.kind === 'tablet');
  const empty =
    !data ||
    (data.completions.length === 0 &&
      data.journal.length === 0 &&
      data.kicks.length === 0 &&
      data.photos.length === 0 &&
      !data.daily?.mood &&
      !data.daily?.water &&
      data.events.length === 0 &&
      markers.length === 0);

  return (
    <BottomSheet open={date !== null} onClose={onClose} title={title} closeLabel={t('ui.close')}>
      <div className="flex flex-col gap-4">
        {markers.map((m) => (
          <p
            key={`${m.kind}-${m.emoji}`}
            className="rounded-soft bg-secondary/50 p-3 font-semibold"
          >
            {m.emoji} {markerText(m, t, lang)}
            {m.festivalId && (
              <Button
                variant="ghost"
                className="ml-2"
                onClick={() => void navigate(`/festival/${m.festivalId}`)}
              >
                →
              </Button>
            )}
          </p>
        ))}
        {empty && <p className="text-text-muted">{t('day.nothing')}</p>}

        {data && data.events.length > 0 && (
          <section>
            <h3 className="mb-1 font-semibold">{t('day.events')}</h3>
            <ul className="flex flex-col gap-2">
              {data.events.map((e) => (
                <li
                  key={e.id}
                  className="rounded-soft bg-background flex flex-wrap items-center gap-2 p-3"
                >
                  <span className="flex-1">
                    📌 {e.time ? `${e.time} · ` : ''}
                    <strong>{e.title}</strong>
                    {e.notes && <span className="text-text-muted block text-sm">{e.notes}</span>}
                  </span>
                  {confirmId === e.id ? (
                    <span className="flex items-center gap-2 text-sm">
                      {t('day.deleteConfirm', { title: e.title })}
                      <Button
                        variant="accent"
                        onClick={() => {
                          void db.events
                            .delete(e.id as number)
                            .catch((err: unknown) => logError(err));
                          setConfirmId(null);
                        }}
                      >
                        {t('rec.deleteYes')}
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirmId(null)}>
                        {t('rec.keep')}
                      </Button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-label={t('day.deleteEvent')}
                      onClick={() => setConfirmId(e.id ?? null)}
                      className="text-text-muted flex min-h-12 min-w-12 items-center justify-center rounded-full"
                    >
                      🗑️
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {storyIds.length > 0 && (
          <section>
            <h3 className="mb-1 font-semibold">{t('day.stories')}</h3>
            <ul className="flex flex-col gap-2">
              {storyIds.map((id) => {
                const s = stories?.find((x) => x.id === id);
                return (
                  <li key={id} className="rounded-soft bg-background flex items-center gap-2 p-3">
                    <span className="flex-1">
                      {s?.emoji ?? '📖'} {s ? tx(s.title, lang) : id}
                    </span>
                    <Button variant="secondary" onClick={() => void navigate(`/stories/${id}`)}>
                      {t('day.replay')}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        {games > 0 && <p>🎮 {t('day.games', { count: games })}</p>}
        {tablet && <p>{t('day.tablet')}</p>}
        {data?.daily?.mood && (
          <p>
            {t('day.mood')}: <span className="text-2xl">{moodEmoji(data.daily.mood)}</span>{' '}
            {data.daily.moodNote}
          </p>
        )}
        {!!data?.daily?.water && <p>💧 {t('day.water', { count: data.daily.water })}</p>}
        {data?.kicks.map((k) => (
          <p key={k.id}>
            👣 {t('day.kicks', { count: k.count, min: Math.max(1, Math.round(k.seconds / 60)) })}
          </p>
        ))}

        {data && data.journal.length > 0 && (
          <section>
            <h3 className="mb-1 font-semibold">{t('day.journal')}</h3>
            <ul className="flex flex-col gap-2">
              {data.journal.map((j) => (
                <li key={j.id} className="rounded-soft bg-background p-3">
                  {j.prompt && <p className="text-text-muted text-sm">{j.prompt}</p>}
                  {j.text && <p>💌 {j.text}</p>}
                  {j.recordingId !== undefined && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        void player.play({
                          id: `rec:${j.recordingId}`,
                          title: t('day.voiceNote'),
                          lang: settings.audioLang,
                          recordingId: j.recordingId,
                        })
                      }
                    >
                      ▶ {t('day.voiceNote')}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data && data.photos.length > 0 && (
          <section>
            <h3 className="mb-1 font-semibold">{t('day.photos')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {data.photos.map((p) => (
                <BlobImage
                  key={p.id}
                  blob={p.blob}
                  alt={p.note ?? t('day.photos')}
                  className="rounded-soft aspect-square w-full object-cover"
                />
              ))}
            </div>
          </section>
        )}

        <Button variant="secondary" onClick={onAddEvent} icon="➕">
          {t('cal.addEvent')}
        </Button>
      </div>
    </BottomSheet>
  );
}
