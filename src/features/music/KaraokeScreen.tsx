import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useT } from '@/app/useT';
import { Button, ChipGroup, EmptyState, Toggle } from '@/components/ui';
import { player } from '@/lib/audio';
import { getLokGeet, tx } from '@/lib/content';

type Pace = 'slow' | 'normal';
const SECONDS: Record<Pace, number> = { slow: 6, normal: 4 };

/** Lyrics that scroll line by line while she sings, with optional background audio. */
export default function KaraokeScreen() {
  const t = useT();
  const { id } = useParams();
  const { settings } = useSettings();
  const complete = useComplete();
  const song = getLokGeet().find((s) => s.id === id);
  const [line, setLine] = useState(0);
  const [running, setRunning] = useState(false);
  const [pace, setPace] = useState<Pace>('slow');
  const [music, setMusic] = useState(false);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const total = song?.lines.length ?? 0;
  const songId = song?.id;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setLine((l) => {
        if (l + 1 >= total) {
          window.clearInterval(timer);
          setRunning(false);
          return l;
        }
        return l + 1;
      });
    }, SECONDS[pace] * 1000);
    return () => window.clearInterval(timer);
  }, [running, pace, total]);

  // Keep the current line in view.
  useEffect(() => {
    lineRefs.current[line]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [line]);

  if (!song) return <EmptyState emoji="🎶" title={t('sing.noLyrics')} />;
  if (total === 0) return <EmptyState emoji="🎶" title={t('sing.noLyrics')} />;
  const atEnd = !running && line >= total - 1;

  function start() {
    if (!song) return;
    if (atEnd) setLine(0);
    setRunning(true);
    if (music) {
      void player.play({
        id: `song:${song.id}`,
        title: tx(song.title, settings.textLang),
        lang: settings.audioLang,
        recordingRef: `song:${song.id}`,
        file: song.id,
        fileDir: 'lokgeet',
      });
    }
  }

  return (
    <>
      <ScreenHeader
        title={t('sing.title')}
        subtitle={tx(song.title, settings.textLang)}
        fallback="/music"
      />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <ChipGroup<Pace>
          label={t('sing.pace')}
          value={pace}
          onChange={setPace}
          options={[
            { value: 'slow', label: t('sing.slow') },
            { value: 'normal', label: t('sing.normal') },
          ]}
        />
        <Toggle label={t('sing.music')} checked={music} onChange={setMusic} />
        <ol
          className="rounded-softer bg-surface shadow-soft flex max-h-[50dvh] flex-col gap-2 overflow-y-auto p-4"
          aria-label={tx(song.title, settings.textLang)}
        >
          {song.lines.map((l, i) => (
            <li key={i} ref={(el) => void (lineRefs.current[i] = el)}>
              <button
                type="button"
                onClick={() => setLine(i)}
                aria-current={i === line}
                className={`rounded-soft w-full px-3 py-2 text-left transition-all duration-500 ${i === line ? 'bg-primary text-on-fill text-2xl font-bold' : i < line ? 'text-text-muted text-lg' : 'text-lg'}`}
              >
                {l}
              </button>
            </li>
          ))}
        </ol>
        <p className="text-text-muted text-center text-sm">{t('sing.tapLine')}</p>
        <div className="flex justify-center gap-2">
          {running ? (
            <Button variant="secondary" onClick={() => setRunning(false)}>
              ⏸ {t('sing.pause')}
            </Button>
          ) : (
            <Button size="lg" breathe onClick={start}>
              🎤 {t('sing.start')}
            </Button>
          )}
          {atEnd && songId && (
            <Button
              variant="calm"
              onClick={() => void complete('song', songId, t('sing.finished'))}
            >
              {t('shell.done')} 🌸
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
