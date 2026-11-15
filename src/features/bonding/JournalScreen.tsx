import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { VoiceRecorder } from '@/components/audio/VoiceRecorder';
import { BottomSheet, Button, Card, ChipGroup, EmptyState, useToast } from '@/components/ui';
import { textareaClass } from '@/components/ui/styles';
import { player } from '@/lib/audio';
import { getTodayISO } from '@/lib/clock';
import { getPrompts, tx } from '@/lib/content';
import { db, type JournalKind } from '@/lib/db';
import { addJournalEntry, useJournal } from '@/lib/journal';
import { logError } from '@/lib/logger';
import { parseLocalDate } from '@/lib/pregnancy';

type Filter = 'all' | Exclude<JournalKind, 'godhBharai'>;

export default function JournalScreen() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const complete = useComplete();
  const { plan } = useTodayPlan();
  const prompt = getPrompts().journal.find((p) => p.id === plan?.journalPromptId);
  const promptText = prompt ? tx(prompt.text, lang) : '';
  const all = useJournal();
  const [filter, setFilter] = useState<Filter>('all');
  const [text, setText] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const open = params.get('new') === '1';
  const setOpen = (v: boolean) => setParams(v ? { new: '1' } : {}, { replace: true });
  const rows = (all ?? []).filter(
    (r) => r.kind !== 'godhBharai' && (filter === 'all' || r.kind === filter),
  );

  async function saveText() {
    if (!text.trim()) return;
    const id = await addJournalEntry({
      kind: 'letter',
      text: text.trim(),
      prompt: promptText || undefined,
    });
    if (id !== null) {
      setText('');
      setOpen(false);
      await complete('journal', String(id), t('journal.saved'));
    }
  }

  async function onVoice(recordingId: number) {
    const id = await addJournalEntry({
      kind: 'letter',
      recordingId,
      prompt: promptText || undefined,
    });
    if (id !== null) {
      setOpen(false);
      await complete('journal', String(id), t('journal.saved'));
    }
  }

  async function remove(id: number) {
    try {
      await db.journal.delete(id);
    } catch (err) {
      void logError(err);
    }
    setConfirmId(null);
    toast({ message: '🗑️' });
  }

  return (
    <>
      <ScreenHeader
        title={t('journal.title')}
        fallback="/me"
        right={
          <Button
            variant="ghost"
            onClick={() => void navigate('/me/keepsake')}
            aria-label={t('journal.keepsake')}
            icon="🖨️"
          />
        }
      />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="primary">
          <p className="text-sm font-semibold">{t('journal.prompt')}</p>
          <p className="mt-1 text-lg font-bold">💌 {promptText}</p>
          <Button className="mt-3" onClick={() => setOpen(true)}>
            {t('journal.new')}
          </Button>
        </Card>
        <ChipGroup<Filter>
          label={t('journal.title')}
          value={filter}
          onChange={setFilter}
          options={(['all', 'letter', 'reflection', 'talk'] as const).map((f) => ({
            value: f,
            label: t(`journal.filter.${f}`),
          }))}
        />
        {rows.length === 0 ? (
          <EmptyState emoji="💌" title={t('journal.empty')} />
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((r) => {
              const d = parseLocalDate(r.date);
              return (
                <li key={r.id} className="rounded-softer bg-surface shadow-soft p-4">
                  <p className="text-text-muted text-sm">{d ? format(d, 'd MMMM yyyy') : r.date}</p>
                  {r.prompt && <p className="mt-1 text-sm italic">{r.prompt}</p>}
                  {r.text && <p className="mt-2 whitespace-pre-line">{r.text}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {r.recordingId !== undefined && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          void player.play({
                            id: `rec:${r.recordingId}`,
                            title: t('journal.voice'),
                            lang: settings.audioLang,
                            recordingId: r.recordingId,
                          })
                        }
                      >
                        ▶ {t('journal.voice')}
                      </Button>
                    )}
                    {confirmId === r.id ? (
                      <span className="flex flex-wrap items-center gap-2 text-sm">
                        {t('journal.deleteConfirm')}
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
                        aria-label={t('journal.delete')}
                        className="text-text-muted ml-auto flex min-h-12 min-w-12 items-center justify-center rounded-full"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={t('journal.new')}
        closeLabel={t('ui.close')}
      >
        <div className="flex flex-col gap-3">
          {promptText && <p className="text-sm italic">💡 {promptText}</p>}
          <textarea
            className={`${textareaClass} min-h-40`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('journal.placeholder')}
            aria-label={t('journal.new')}
          />
          <Button onClick={() => void saveText()} disabled={!text.trim()}>
            {t('journal.save')}
          </Button>
          <p className="text-sm font-semibold">{t('journal.orVoice')}</p>
          <VoiceRecorder
            refId={`journal:${getTodayISO()}`}
            kind="journal"
            onSaved={(id) => void onVoice(id)}
          />
        </div>
      </BottomSheet>
    </>
  );
}
