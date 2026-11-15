import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { useT } from '@/app/useT';
import { BlobImage } from '@/components/ui';
import type { PhotoRow } from '@/lib/db';

/** Full-screen slideshow, one photo every 3 seconds with a soft fade. */
export function Slideshow({ photos, onClose }: { photos: PhotoRow[]; onClose: () => void }) {
  const t = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % photos.length), 3000);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [photos.length, onClose]);
  const photo = photos[i];
  if (!photo) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={t('photos.slideshow')}
    >
      <AnimatePresence mode="wait">
        <m.div
          key={photo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex max-h-[80dvh] w-full max-w-md flex-col items-center gap-3 px-4"
        >
          <BlobImage
            blob={photo.blob}
            alt={t('photos.alt', { week: photo.week })}
            className="rounded-softer max-h-[70dvh] w-full object-contain"
          />
          <p className="rounded-full bg-white/90 px-4 py-1 font-bold text-[#5A4A5E]">
            {t('photos.week', { week: photo.week })}
          </p>
        </m.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={onClose}
        aria-label={t('photos.closeSlideshow')}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xl text-[#5A4A5E]"
      >
        ✕
      </button>
    </div>
  );
}
