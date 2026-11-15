import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useProfile } from '@/app/profile';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { Button, PageHeader } from '@/components/ui';
import { toLocalISO } from '@/lib/pregnancy';
import { DaySheet } from './DaySheet';
import { EventSheet } from './EventSheet';
import { buildMarkers } from './markers';
import { useRangeData } from './useMonthData';

const DOT = {
  story: 'bg-primary',
  game: 'bg-secondary',
  journal: 'bg-accent',
  kicks: 'bg-calm',
} as const;
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const now = useNow();
  const todayISO = toLocalISO(now);
  const [month, setMonth] = useState(() => startOfMonth(now));
  const [selected, setSelected] = useState<string | null>(null);
  const [eventOpen, setEventOpen] = useState(false);
  const [eventDate, setEventDate] = useState<string | null>(null);
  const from = toLocalISO(startOfMonth(month));
  const to = toLocalISO(endOfMonth(month));
  const getDay = useRangeData(from, to);
  const markers = useMemo(
    () => buildMarkers(profile?.lmp, profile?.edd),
    [profile?.lmp, profile?.edd],
  );

  const days = useMemo(() => {
    const first = startOfMonth(month);
    const count = endOfMonth(month).getDate();
    const blanks = first.getDay();
    return [
      ...Array<null>(blanks).fill(null),
      ...Array.from({ length: count }, (_, i) =>
        toLocalISO(new Date(first.getFullYear(), first.getMonth(), i + 1)),
      ),
    ];
  }, [month]);

  const selectedData = selected && getDay ? getDay(selected) : null;

  return (
    <>
      <PageHeader
        title={t('cal.title')}
        right={
          <Button
            variant="secondary"
            onClick={() => void navigate('/me/schedule')}
            aria-label={t('cal.exportIcs')}
            icon="📲"
          />
        }
      />
      <div className="flex flex-col gap-3 px-4 pb-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            aria-label={t('cal.prev')}
            className="bg-surface shadow-soft flex min-h-12 min-w-12 items-center justify-center rounded-full"
          >
            ←
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold">{format(month, 'MMMM yyyy')}</h2>
            <button
              type="button"
              className="text-text-muted text-sm underline"
              onClick={() => setMonth(startOfMonth(now))}
            >
              {t('cal.today')}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label={t('cal.next')}
            className="bg-surface shadow-soft flex min-h-12 min-w-12 items-center justify-center rounded-full"
          >
            →
          </button>
        </div>

        <div className="rounded-softer bg-surface shadow-soft p-2">
          <div
            className="text-text-muted grid grid-cols-7 text-center text-xs font-semibold"
            aria-hidden="true"
          >
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              if (!date) return <span key={`b${i}`} />;
              const data = getDay?.(date);
              const kinds = new Set(data?.completions.map((c) => c.kind));
              const dots = [
                kinds.has('story') && 'story',
                kinds.has('game') && 'game',
                ((data?.journal.length ?? 0) > 0 || kinds.has('talk')) && 'journal',
                (data?.kicks.length ?? 0) > 0 && 'kicks',
              ].filter(Boolean) as (keyof typeof DOT)[];
              const dayMarkers = markers.filter((m) => m.date === date);
              const hasEvent = (data?.events.length ?? 0) > 0;
              const count = data?.completions.length ?? 0;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelected(date)}
                  aria-label={`${format(new Date(`${date}T12:00:00`), 'd MMMM')}${count ? `, ${t('cal.activities', { count })}` : ''}`}
                  className={`rounded-soft relative flex min-h-14 flex-col items-center pt-1 text-sm ${date === todayISO ? 'bg-primary/50 font-bold' : ''} ${date > todayISO ? 'text-text-muted' : ''}`}
                >
                  <span>{Number(date.slice(8))}</span>
                  <span className="flex h-3 items-center gap-0.5" aria-hidden="true">
                    {dots.map((d) => (
                      <span key={d} className={`h-1.5 w-1.5 rounded-full ${DOT[d]}`} />
                    ))}
                  </span>
                  {(dayMarkers.length > 0 || hasEvent) && (
                    <span className="text-[0.7rem] leading-none" aria-hidden="true">
                      {dayMarkers[0]?.emoji ?? '📌'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <ul
          className="text-text-muted flex flex-wrap justify-center gap-3 text-xs"
          aria-hidden="true"
        >
          {(Object.keys(DOT) as (keyof typeof DOT)[]).map((k) => (
            <li key={k} className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${DOT[k]}`} /> {t(`cal.legend.${k}`)}
            </li>
          ))}
        </ul>

        <Button
          variant="secondary"
          icon="➕"
          onClick={() => {
            setSelected(null);
            setEventDate(todayISO);
            setEventOpen(true);
          }}
        >
          {t('cal.addEvent')}
        </Button>
      </div>
      <DaySheet
        date={selected}
        data={selectedData}
        markers={selected ? markers.filter((m) => m.date === selected) : []}
        onClose={() => setSelected(null)}
        onAddEvent={() => {
          setEventDate(selected);
          setSelected(null);
          setEventOpen(true);
        }}
      />
      <EventSheet
        open={eventOpen}
        onClose={() => setEventOpen(false)}
        date={eventDate ?? todayISO}
      />
    </>
  );
}
