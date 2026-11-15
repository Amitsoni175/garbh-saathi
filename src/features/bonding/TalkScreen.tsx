import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { VoiceRecorder } from '@/components/audio/VoiceRecorder';
import { Button, Card, useToast } from '@/components/ui';
import { getTodayISO } from '@/lib/clock';
import { getPrompts, tx } from '@/lib/content';
import { addJournalEntry } from '@/lib/journal';
import { rotate } from '@/lib/plan';

/** Today's talk-to-baby prompt, with an optional voice recording saved to her letters. */
export default function TalkScreen() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const complete = useComplete();
  const { plan, offset } = useTodayPlan();
  const talk = getPrompts().talk;
  const [shift, setShift] = useState(0);
  const base = talk.findIndex((p) => p.id === plan?.promptId);
  const prompt = rotate(talk, (base < 0 ? offset : base) + shift);
  const refId = `talk:${getTodayISO()}`;

  async function onSaved(recordingId: number) {
    const id = await addJournalEntry({
      kind: 'talk',
      recordingId,
      prompt: prompt ? tx(prompt.text, settings.textLang) : undefined,
    });
    if (id !== null) toast({ message: t('talk.saved') });
  }

  return (
    <>
      <ScreenHeader title={t('talk.title')} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="primary">
          <p className="text-sm font-semibold">{t('talk.promptOfDay')}</p>
          <p className="mt-2 text-xl leading-snug font-bold">
            💌 {prompt ? tx(prompt.text, settings.textLang) : ''}
          </p>
          <Button variant="ghost" className="mt-2 -ml-3" onClick={() => setShift((s) => s + 1)}>
            🔄 {t('talk.another')}
          </Button>
        </Card>
        <p className="text-text-muted">{t('talk.howTo')}</p>
        <Card index={1}>
          <h2 className="mb-3 font-semibold">{t('talk.record')}</h2>
          <VoiceRecorder refId={refId} kind="talk" onSaved={(id) => void onSaved(id)} />
        </Card>
        <div className="flex justify-center">
          <Button
            size="lg"
            breathe
            onClick={() => void complete('talk', prompt?.id).then(() => navigate('/'))}
          >
            {t('talk.done')}
          </Button>
        </div>
      </div>
    </>
  );
}
