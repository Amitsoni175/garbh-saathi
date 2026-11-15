import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useComplete } from '@/app/useComplete';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { BlobImage, Button, Card, useToast } from '@/components/ui';
import { textareaClass } from '@/components/ui/styles';
import { addJournalEntry, useJournal } from '@/lib/journal';
import { logError } from '@/lib/logger';
import { compressImage, savePhoto, usePhotos } from '@/lib/photos';

export default function GodhBharaiScreen() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const complete = useComplete();
  const state = usePregnancy();
  const photos = usePhotos('godhBharai') ?? [];
  const notes = useJournal('godhBharai') ?? [];
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    if (files.length === 0) return;
    setBusy(true);
    try {
      for (const f of files)
        await savePhoto(await compressImage(f), 'godhBharai', state?.weeks ?? 0);
      await complete('photo', 'godhBharai', t('godh.saved'));
    } catch (err) {
      void logError(err);
      toast({ message: t('photos.failed') });
    } finally {
      setBusy(false);
    }
  }

  async function saveNote() {
    if (!text.trim()) return;
    const id = await addJournalEntry({ kind: 'godhBharai', text: text.trim() });
    if (id !== null) {
      setText('');
      toast({ message: t('godh.saved') });
    }
  }

  return (
    <>
      <ScreenHeader title={t('godh.title')} fallback="/me" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="primary">
          <p className="text-4xl" aria-hidden="true">
            🎉🥥🌸
          </p>
          <p className="mt-2">{t('godh.intro')}</p>
          <Button variant="ghost" className="mt-2 -ml-3" onClick={() => void navigate('/calendar')}>
            📅 {t('godh.addEvent')}
          </Button>
        </Card>
        <Card index={1}>
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            {t('godh.addPhoto')}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void onFile(e)}
          />
          {busy && <p role="status">{t('photos.saving')}</p>}
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <BlobImage
                  key={p.id}
                  blob={p.blob}
                  alt={t('godh.title')}
                  className="rounded-soft aspect-square w-full object-cover"
                />
              ))}
            </div>
          )}
        </Card>
        <Card index={2}>
          <textarea
            className={textareaClass}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('godh.notePlaceholder')}
            aria-label={t('godh.notePlaceholder')}
          />
          <Button
            className="mt-2"
            variant="secondary"
            onClick={() => void saveNote()}
            disabled={!text.trim()}
          >
            {t('godh.saveNote')}
          </Button>
          <ul className="mt-3 flex flex-col gap-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-soft bg-background p-3 whitespace-pre-line">
                💛 {n.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
