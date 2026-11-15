import { useRef, useState } from 'react';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useComplete } from '@/app/useComplete';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { BlobImage, Button, ChipGroup, EmptyState, useToast } from '@/components/ui';
import { db, type PhotoKind } from '@/lib/db';
import { logError } from '@/lib/logger';
import { compressImage, savePhoto, usePhotos } from '@/lib/photos';
import { Slideshow } from './Slideshow';

type Tab = Extract<PhotoKind, 'belly' | 'sanjhi'>;

export default function PhotosScreen() {
  const t = useT();
  const toast = useToast();
  const complete = useComplete();
  const state = usePregnancy();
  const [tab, setTab] = useState<Tab>('belly');
  const photos = usePhotos(tab) ?? [];
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const week = state?.weeks ?? 0;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const blob = await compressImage(file);
      await savePhoto(blob, 'belly', week);
      await complete('photo', undefined, t('photos.saved', { week }));
    } catch (err) {
      void logError(err);
      toast({ message: t('photos.failed') });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ScreenHeader title={t('photos.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <ChipGroup<Tab>
          label={t('photos.title')}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'belly', label: t('photos.tab.belly') },
            { value: 'sanjhi', label: t('photos.tab.sanjhi') },
          ]}
        />
        {tab === 'belly' && (
          <>
            <p className="text-text-muted">{t('photos.intro')}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => cameraRef.current?.click()} disabled={busy}>
                {t('photos.take')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => galleryRef.current?.click()}
                disabled={busy}
              >
                {t('photos.pick')}
              </Button>
            </div>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => void onFile(e)}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onFile(e)}
            />
            {busy && <p role="status">{t('photos.saving')}</p>}
          </>
        )}
        {photos.length > 1 && (
          <Button variant="calm" onClick={() => setShow(true)}>
            {t('photos.slideshow')}
          </Button>
        )}
        {photos.length === 0 ? (
          <EmptyState emoji={tab === 'belly' ? '📸' : '🌝'} title={t('photos.empty')} />
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {photos.map((p) => (
              <li key={p.id} className="rounded-softer bg-surface shadow-soft overflow-hidden">
                <BlobImage
                  blob={p.blob}
                  alt={t('photos.alt', { week: p.week })}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-sm font-semibold">
                    {t('photos.week', { week: p.week })}
                  </span>
                  {confirmId === p.id ? (
                    <Button
                      variant="accent"
                      onClick={() => {
                        void db.photos
                          .delete(p.id as number)
                          .catch((err: unknown) => logError(err));
                        setConfirmId(null);
                      }}
                    >
                      {t('rec.deleteYes')}
                    </Button>
                  ) : (
                    <button
                      type="button"
                      aria-label={t('photos.delete')}
                      onClick={() => setConfirmId(p.id ?? null)}
                      className="text-text-muted flex min-h-12 min-w-12 items-center justify-center rounded-full"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                {confirmId === p.id && (
                  <p className="px-3 pb-2 text-xs">{t('photos.deleteConfirm')}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {show && <Slideshow photos={photos} onClose={() => setShow(false)} />}
    </>
  );
}
