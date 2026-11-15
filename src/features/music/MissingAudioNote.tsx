import { useT } from '@/app/useT';

/** Friendly "add an audio file" instructions instead of an error. */
export function MissingAudioNote({ file, dir }: { file: string; dir: string }) {
  const t = useT();
  return (
    <div className="rounded-soft bg-accent/60 text-on-fill p-4" role="note">
      <p className="font-semibold">{t('audio.missingTitle')}</p>
      <p className="mt-1 text-sm">
        {t('audio.missingText', { file: `${file}.mp3`, folder: `public/audio/${dir}/` })}
      </p>
    </div>
  );
}
