import { format } from 'date-fns';
import { useProfile } from '@/app/profile';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useT } from '@/app/useT';
import { Button, EmptyState } from '@/components/ui';
import { useJournal } from '@/lib/journal';
import { parseLocalDate } from '@/lib/pregnancy';

/** A printable page of her letters (Print → Save as PDF keeps a file). */
export default function KeepsakeScreen() {
  const t = useT();
  const { profile } = useProfile();
  const rows = (useJournal() ?? [])
    .filter((r) => r.kind !== 'godhBharai')
    .sort((a, b) => a.createdAt - b.createdAt);
  return (
    <>
      <div className="print:hidden">
        <ScreenHeader title={t('keep.title')} fallback="/me" />
        <div className="flex flex-col gap-2 px-4">
          <Button onClick={() => window.print()} disabled={rows.length === 0}>
            {t('keep.print')}
          </Button>
          <p className="text-text-muted text-sm">{t('keep.howPdf')}</p>
        </div>
      </div>
      {rows.length === 0 ? (
        <EmptyState emoji="💌" title={t('keep.empty')} />
      ) : (
        <article className="keepsake rounded-softer bg-surface shadow-soft mx-4 my-4 p-6 print:m-0 print:rounded-none print:p-0 print:shadow-none">
          <header className="mb-6 text-center">
            <p className="text-4xl" aria-hidden="true">
              🌸
            </p>
            <h1 className="text-2xl font-bold">{t('keep.title')}</h1>
            <p className="text-text-muted">
              {t('keep.subtitle', { name: profile?.motherName || t('today.defaultName') })}
            </p>
          </header>
          {rows.map((r) => {
            const d = parseLocalDate(r.date);
            return (
              <section
                key={r.id}
                className="border-secondary/60 mb-5 break-inside-avoid border-b pb-4"
              >
                <p className="text-text-muted text-sm font-semibold">
                  {d ? format(d, 'EEEE, d MMMM yyyy') : r.date}
                </p>
                {r.prompt && <p className="mt-1 text-sm italic">{r.prompt}</p>}
                {r.text && <p className="mt-2 leading-relaxed whitespace-pre-line">{r.text}</p>}
                {r.recordingId !== undefined && !r.text && (
                  <p className="mt-2 text-sm">{t('keep.voiceNote')}</p>
                )}
              </section>
            );
          })}
        </article>
      )}
    </>
  );
}
