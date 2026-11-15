import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useT } from '@/app/useT';
import { RecordingList } from '@/components/audio/RecordingList';
import { VoiceRecorder } from '@/components/audio/VoiceRecorder';
import { Button, Card } from '@/components/ui';
import { inputClass } from '@/components/ui/styles';
import { player } from '@/lib/audio';
import { getLokGeet, tx, type LokGeet } from '@/lib/content';
import { useAudioFile } from './useAudioFile';

function SongCard({ song, index }: { song: LokGeet; index: number }) {
  const t = useT();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const complete = useComplete();
  const lang = settings.textLang;
  const [recording, setRecording] = useState(song.lines.length === 0);
  const file = useAudioFile(song.id, 'lokgeet');
  return (
    <Card index={index}>
      <p className="text-text-muted text-sm font-semibold">{t(`lok.type.${song.type}`)}</p>
      <h2 className="text-lg font-bold">
        {song.emoji} {tx(song.title, lang)}
      </h2>
      <p className="mt-1 text-sm">{tx(song.about, lang)}</p>
      {song.lines.length > 0 && (
        <p className="text-text-muted mt-2 line-clamp-2 text-sm italic">
          {song.lines.slice(0, 2).join(' ')}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {song.lines.length > 0 && (
          <Button variant="secondary" onClick={() => void navigate(`/music/sing/${song.id}`)}>
            🎤 {t('lok.singAlong')}
          </Button>
        )}
        {file === 'present' && (
          <Button
            variant="ghost"
            onClick={() =>
              void player.play({
                id: `song:${song.id}`,
                title: tx(song.title, lang),
                lang: settings.audioLang,
                file: song.id,
                fileDir: 'lokgeet',
              })
            }
          >
            ▶ {t('lok.listen')}
          </Button>
        )}
        {!recording && (
          <Button variant="ghost" onClick={() => setRecording(true)}>
            🎙️ {t('lok.recordThis')}
          </Button>
        )}
      </div>
      {recording && (
        <div className="mt-3">
          <VoiceRecorder
            refId={`song:${song.id}`}
            kind="song"
            askWho
            label={tx(song.title, lang)}
            onSaved={() => void complete('song', song.id)}
            big={song.lines.length === 0}
          />
        </div>
      )}
      <div className="mt-3">
        <RecordingList refId={`song:${song.id}`} />
      </div>
    </Card>
  );
}

export default function LokGeetScreen() {
  const t = useT();
  const complete = useComplete();
  const [name, setName] = useState('');
  return (
    <>
      <ScreenHeader title={t('lok.title')} subtitle={t('music.lokgeetText')} fallback="/music" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="primary">
          <h2 className="text-lg font-bold">🎙️ {t('lok.recordNew')}</h2>
          <label className="mt-2 flex flex-col gap-1">
            <span className="text-sm font-semibold">{t('lok.songName')}</span>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('lok.songNamePlaceholder')}
            />
          </label>
          <div className="mt-3">
            <VoiceRecorder
              refId="song:family"
              kind="song"
              askWho
              label={name.trim() || undefined}
              big
              startLabel={t('lok.recordNew')}
              onSaved={() => void complete('song', 'family')}
            />
          </div>
        </Card>
        <Card>
          <RecordingList refId="song:family" title={t('lok.familySongs')} showEmpty />
        </Card>
        {getLokGeet().map((song, i) => (
          <SongCard key={song.id} song={song} index={i} />
        ))}
      </div>
    </>
  );
}
