import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { usePlayer } from '@/app/usePlayer';
import { useStories } from '@/app/useStories';
import { useT } from '@/app/useT';
import { RecordingList } from '@/components/audio/RecordingList';
import { VoiceRecorder } from '@/components/audio/VoiceRecorder';
import { Button, Card, EmptyState, Toggle, useToast } from '@/components/ui';
import { useFloatBurst } from '@/components/ui/FloatBurst';
import { textareaClass } from '@/components/ui/styles';
import { player } from '@/lib/audio';
import { tx, type Story } from '@/lib/content';
import { db } from '@/lib/db';
import { celebrate, chime, vibrate } from '@/lib/feedback';
import { addJournalEntry } from '@/lib/journal';

type Step =
  { kind: 'card'; index: number } | { kind: 'moral' } | { kind: 'check' } | { kind: 'reflection' };

function buildSteps(story: Story): Step[] {
  return [
    ...story.cards.map((_, index) => ({ kind: 'card' as const, index })),
    { kind: 'moral' },
    ...(story.quiz.length > 0 ? [{ kind: 'check' as const }] : []),
    { kind: 'reflection' },
  ];
}

const REACTIONS = ['💛', '😊', '😮', '🙏'];

/** Card-by-card story with swipe, read-aloud mode, choices, moral, reflection and family voice. */
export default function StoryPlayerScreen() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const stories = useStories();
  const { settings } = useSettings();
  const complete = useComplete();
  const audio = usePlayer();
  const story = stories?.find((s) => s.id === id);
  const lang = settings.textLang;

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [readAloud, setReadAloud] = useState(false);
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [useFamilyVoice, setUseFamilyVoice] = useState(true);
  const [said, setSaid] = useState<Record<number, boolean>>({});
  const [reacted, setReacted] = useState<Record<number, string>>({});
  const [checkAnswer, setCheckAnswer] = useState<boolean | null>(null);
  const [wiggle, setWiggle] = useState(0);
  const { burst, layer } = useFloatBurst();

  const refId = `story:${id ?? ''}`;
  const familyCount =
    useLiveQuery(() => db.recordings.where('refId').equals(refId).count(), [refId]) ?? 0;
  const steps = useMemo(() => (story ? buildSteps(story) : []), [story]);

  // Stop this story's audio when leaving the screen.
  useEffect(() => {
    return () => {
      if (player.getState().track?.id === refId) player.stop();
    };
  }, [refId]);

  if (!stories) return <EmptyState emoji="📖" title={t('stories.loading')} />;
  if (!story) {
    return (
      <>
        <ScreenHeader title={t('stories.title')} fallback="/stories" />
        <EmptyState
          emoji="📖"
          title={t('stories.notFound')}
          action={
            <Button onClick={() => void navigate('/stories')}>{t('stories.openLibrary')}</Button>
          }
        />
      </>
    );
  }

  const step = steps[stepIndex] ?? steps[0];
  const isPlayingThis =
    audio.track?.id === refId && (audio.status === 'playing' || audio.status === 'loading');
  const seriesParts = stories.filter((s) => s.series && s.series === story.series).length;

  function go(delta: number) {
    const next = Math.min(steps.length - 1, Math.max(0, stepIndex + delta));
    if (next === stepIndex) return;
    setDirection(delta);
    setStepIndex(next);
    const s = steps[next];
    // If the phone voice is reading, keep it in step with the card she swiped to.
    if (s?.kind === 'card' && isPlayingThis && audio.track?.kind === 'tts') player.seek(s.index);
  }

  function listen() {
    if (!story) return;
    if (isPlayingThis) {
      player.pause();
      return;
    }
    if (audio.track?.id === refId && audio.status === 'paused') {
      player.resume();
      return;
    }
    const startAt = step?.kind === 'card' ? step.index : 0;
    void player
      .play({
        id: refId,
        title: tx(story.title, lang),
        lang: settings.audioLang,
        recordingRef: refId,
        preferRecording: useFamilyVoice,
        file: story.audio[settings.audioLang] ?? story.id,
        tts: {
          hi: story.cards.map((c) => c.text.hi ?? c.text.hinglish),
          en: story.cards.map((c) => c.text.en),
        },
        onSegment: (i) => {
          setDirection(1);
          setStepIndex(i);
        },
      })
      .then((kind) => {
        if (kind === 'tts' && startAt > 0) player.seek(startAt);
      });
  }

  async function saveReflection(recordingId?: number) {
    if (!story) return;
    const text = reflection.trim();
    if (!text && recordingId === undefined) return;
    const saved = await addJournalEntry({
      kind: 'reflection',
      text: text || undefined,
      recordingId,
      prompt: tx(story.reflection, lang),
      refId: story.id,
    });
    if (saved !== null) {
      setReflectionSaved(true);
      toast({ message: t('talk.saved') });
    }
  }

  async function finish() {
    if (!story) return;
    if (reflection.trim() && !reflectionSaved) await saveReflection();
    if (isPlayingThis) player.stop();
    await complete('story', story.id, t('story.finished'));
    void navigate('/');
  }

  const textSize = readAloud ? 'text-2xl leading-relaxed' : 'text-lg leading-relaxed';

  return (
    <>
      <ScreenHeader
        title={tx(story.title, lang)}
        fallback="/stories"
        right={
          <button
            type="button"
            onClick={() => setReadAloud((r) => !r)}
            aria-pressed={readAloud}
            aria-label={t('story.readAloud')}
            className={`flex min-h-12 min-w-12 items-center justify-center rounded-full font-bold ${readAloud ? 'bg-primary text-on-fill' : 'bg-surface shadow-soft'}`}
          >
            Aa
          </button>
        }
      />

      <div className="flex flex-col gap-3 px-4 pb-4">
        {/* Audio + recording controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={listen} icon={isPlayingThis ? '⏸' : '🔊'}>
            {isPlayingThis ? t('story.pause') : t('story.listen')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowRecorder((v) => !v)}
            aria-expanded={showRecorder}
          >
            {t('story.recordButton')}
          </Button>
        </div>
        {familyCount > 0 && (
          <Toggle
            label={useFamilyVoice ? t('story.familyVoice') : t('story.defaultVoice')}
            checked={useFamilyVoice}
            onChange={(v) => {
              setUseFamilyVoice(v);
              if (audio.track?.id === refId) player.stop();
            }}
          />
        )}
        {showRecorder && (
          <Card tone="secondary">
            <h2 className="font-semibold">{t('story.recordTitle')}</h2>
            <p className="mb-3 text-sm">{t('story.recordHint')}</p>
            <VoiceRecorder refId={refId} kind="story" askWho label={tx(story.title, lang)} />
            <div className="mt-3">
              <RecordingList refId={refId} title={t('rec.list')} />
            </div>
          </Card>
        )}
        {readAloud && <p className="text-text-muted text-sm">{t('story.readAloudHint')}</p>}

        {/* The card */}
        <div className="relative min-h-[22rem] overflow-hidden">
          {layer}
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <m.article
              key={stepIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              className="rounded-softer bg-surface shadow-soft p-5"
              aria-live="polite"
            >
              {step?.kind === 'card' &&
                (() => {
                  const card = story.cards[step.index];
                  if (!card) return null;
                  const picked = choices[step.index];
                  return (
                    <>
                      <m.button
                        type="button"
                        key={wiggle}
                        onClick={() => {
                          setWiggle((w) => w + 1);
                          burst(['✨', card.image ?? story.emoji, '💫'], 5);
                          vibrate(10);
                        }}
                        animate={wiggle ? { rotate: [0, -10, 10, -6, 0], scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 0.5 }}
                        className="bg-secondary/50 mx-auto mb-1 flex h-24 w-24 items-center justify-center rounded-full text-5xl"
                        aria-label={t('story.tapPicture')}
                      >
                        <span aria-hidden="true">{card.image ?? story.emoji}</span>
                      </m.button>
                      {step.index === 0 && (
                        <p className="text-text-muted mb-3 text-center text-xs">
                          👆 {t('story.tapPicture')}
                        </p>
                      )}
                      {step.index > 0 && <div className="mb-3" />}
                      <p className={textSize}>{tx(card.text, lang)}</p>
                      {card.say && (
                        <div
                          className={`rounded-soft bg-primary/40 mt-4 p-4 ${readAloud ? 'text-xl' : ''}`}
                        >
                          <p className="text-sm font-semibold">💛 {t('story.sayThis')}</p>
                          <p className="mt-1 font-semibold">{tx(card.say, lang)}</p>
                          <Button
                            variant={said[step.index] ? 'primary' : 'ghost'}
                            className="bg-surface mt-3"
                            onClick={() => {
                              if (!said[step.index]) chime();
                              setSaid((s) => ({ ...s, [step.index]: true }));
                              burst(['💛', '💗', '🌸'], 7);
                            }}
                          >
                            {said[step.index] ? `💛 ${t('story.saidIt')}` : t('story.iSaidIt')}
                          </Button>
                        </div>
                      )}
                      {card.choice && (
                        <div className="rounded-soft bg-calm/60 mt-4 p-4">
                          <p className="font-bold">🤔 {tx(card.choice.question, lang)}</p>
                          <div className="mt-3 flex flex-col gap-2">
                            {card.choice.options.map((opt, oi) => (
                              <Button
                                key={oi}
                                variant={picked === oi ? 'primary' : 'ghost'}
                                className="bg-surface justify-start text-left"
                                onClick={() => setChoices((c) => ({ ...c, [step.index]: oi }))}
                              >
                                {tx(opt.label, lang)}
                              </Button>
                            ))}
                          </div>
                          {picked !== undefined && (
                            <m.p
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 font-semibold"
                            >
                              ✨ {tx(card.choice.options[picked]?.lesson, lang)}
                            </m.p>
                          )}
                        </div>
                      )}
                      <div
                        className="mt-4 flex items-center justify-center gap-2"
                        role="group"
                        aria-label={t('story.howFeel')}
                      >
                        {REACTIONS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setReacted((x) => ({ ...x, [step.index]: r }));
                              burst(r, 4);
                              vibrate(10);
                            }}
                            aria-pressed={reacted[step.index] === r}
                            aria-label={t('story.react', { emoji: r })}
                            className={`flex min-h-12 min-w-12 items-center justify-center rounded-full text-2xl transition-transform ${reacted[step.index] === r ? 'bg-primary/50 scale-110' : 'bg-background'}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}

              {step?.kind === 'moral' && (
                <div className="text-center">
                  <p className="text-5xl" aria-hidden="true">
                    🌟
                  </p>
                  <h2 className="text-text-muted mt-2 text-sm font-semibold">{t('story.moral')}</h2>
                  <p className={`mt-2 font-bold ${readAloud ? 'text-2xl' : 'text-xl'}`}>
                    {tx(story.moral, lang)}
                  </p>
                  {story.series && story.part && story.part < seriesParts && (
                    <p className="bg-secondary text-on-fill mt-4 rounded-full px-4 py-2 font-semibold">
                      {t('story.nextPartTomorrow', { part: story.part + 1 })}
                    </p>
                  )}
                </div>
              )}

              {step?.kind === 'check' &&
                (() => {
                  const q = story.quiz[0];
                  if (!q) return null;
                  const right = checkAnswer !== null && checkAnswer === q.answer;
                  return (
                    <div className="flex flex-col gap-4 text-center">
                      <h2 className="text-text-muted text-sm font-semibold">
                        🧠 {t('story.quickCheck')}
                      </h2>
                      <p className="text-xl font-bold">{tx(q.q, lang)}</p>
                      <div className="flex justify-center gap-3">
                        {[true, false].map((v) => (
                          <Button
                            key={String(v)}
                            size="lg"
                            variant={checkAnswer === v ? 'primary' : 'secondary'}
                            disabled={checkAnswer !== null && checkAnswer !== v}
                            onClick={() => {
                              if (checkAnswer !== null) return;
                              setCheckAnswer(v);
                              if (v === q.answer) {
                                celebrate();
                                burst(['🌸', '⭐', '💛'], 8);
                              }
                            }}
                          >
                            {v ? t('quiz.true') : t('quiz.false')}
                          </Button>
                        ))}
                      </div>
                      {checkAnswer !== null && (
                        <m.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          role="status"
                          className="font-semibold"
                        >
                          {right
                            ? t('story.checkRight')
                            : t('story.checkGentle', {
                                answer: q.answer ? t('quiz.true') : t('quiz.false'),
                              })}
                        </m.p>
                      )}
                    </div>
                  );
                })()}

              {step?.kind === 'reflection' && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-text-muted text-sm font-semibold">{t('story.reflection')}</h2>
                  <p className="text-xl font-bold">{tx(story.reflection, lang)}</p>
                  <textarea
                    className={textareaClass}
                    value={reflection}
                    onChange={(e) => {
                      setReflection(e.target.value);
                      setReflectionSaved(false);
                    }}
                    placeholder={t('story.reflectionPlaceholder')}
                    aria-label={tx(story.reflection, lang)}
                  />
                  <div className="flex flex-wrap items-start gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => void saveReflection()}
                      disabled={!reflection.trim() || reflectionSaved}
                    >
                      {reflectionSaved ? '✓' : '💌'} {t('story.saveReflection')}
                    </Button>
                  </div>
                  <VoiceRecorder
                    refId={`reflection:${story.id}`}
                    kind="reflection"
                    onSaved={(rid) => void saveReflection(rid)}
                  />
                </div>
              )}
            </m.article>
          </AnimatePresence>
        </div>

        {/* Progress + navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => go(-1)}
            disabled={stepIndex === 0}
            aria-label={t('story.prev')}
          >
            ←
          </Button>
          <div
            className="flex flex-wrap justify-center gap-1.5"
            aria-label={t('story.cardOf', { n: stepIndex + 1, total: steps.length })}
            role="img"
          >
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === stepIndex ? 'bg-primary w-6' : 'bg-secondary w-2'}`}
              />
            ))}
          </div>
          {stepIndex < steps.length - 1 ? (
            <Button onClick={() => go(1)}>{t('story.next')} →</Button>
          ) : (
            <Button breathe onClick={() => void finish()}>
              {t('story.finish')}
            </Button>
          )}
        </div>
        {stepIndex === 0 && (
          <p className="text-text-muted text-center text-sm">{t('story.swipeHint')}</p>
        )}
      </div>
    </>
  );
}
