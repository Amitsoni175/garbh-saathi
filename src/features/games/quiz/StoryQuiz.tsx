import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSettings } from '@/app/settings';
import { useStories } from '@/app/useStories';
import { useTodayPlan } from '@/app/useTodayPlan';
import { useT } from '@/app/useT';
import { Button, EmptyState } from '@/components/ui';
import { tx, type Story } from '@/lib/content';
import { chime } from '@/lib/feedback';
import { GameShell } from '../GameShell';

function QuizRound({ story, onAgain }: { story: Story; onAgain: () => void }) {
  const t = useT();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const [qi, setQi] = useState(0);
  const [feedback, setFeedback] = useState<{ right: boolean; answer: boolean } | null>(null);
  const items = story.quiz;
  const item = items[qi];

  function answer(value: boolean) {
    if (!item || feedback) return;
    const right = value === item.answer;
    if (right) chime();
    setFeedback({ right, answer: item.answer });
    window.setTimeout(() => {
      setFeedback(null);
      setQi((i) => i + 1);
    }, 1600);
  }

  return (
    <GameShell
      gameId="storyQuiz"
      howTo="quiz.how"
      finished={qi >= items.length}
      onPlayAgain={onAgain}
    >
      <p className="text-text-muted text-center text-sm">
        {t('quiz.about', { title: tx(story.title, lang) })}
      </p>
      <div className="relative min-h-64">
        <AnimatePresence mode="popLayout">
          {item && (
            <m.div
              key={qi}
              drag={feedback ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) answer(true);
                else if (info.offset.x < -80) answer(false);
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: feedback?.answer ? 200 : -200 }}
              transition={{ duration: 0.35 }}
              className="rounded-softer bg-surface shadow-soft flex min-h-64 cursor-grab flex-col items-center justify-center p-6 text-center"
            >
              <p className="text-xl leading-snug font-bold">{tx(item.q, lang)}</p>
              {feedback && (
                <p
                  role="status"
                  className={`text-on-fill mt-4 rounded-full px-4 py-2 font-semibold ${feedback.right ? 'bg-calm' : 'bg-accent'}`}
                >
                  {feedback.right
                    ? t('quiz.right')
                    : t('quiz.gentle', {
                        answer: feedback.answer ? t('quiz.true') : t('quiz.false'),
                      })}
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-between gap-3">
        <Button
          variant="accent"
          className="flex-1"
          onClick={() => answer(false)}
          disabled={!!feedback}
        >
          ← {t('quiz.false')}
        </Button>
        <Button
          variant="calm"
          className="flex-1"
          onClick={() => answer(true)}
          disabled={!!feedback}
        >
          {t('quiz.true')} →
        </Button>
      </div>
    </GameShell>
  );
}

export default function StoryQuiz() {
  const t = useT();
  const navigate = useNavigate();
  const [round, setRound] = useState(0);
  const stories = useStories();
  const today = useTodayPlan();
  const yesterday = useTodayPlan(-1);
  if (!stories) return null;
  const id = today.offset > 0 ? yesterday.plan?.storyId : today.plan?.storyId;
  const story =
    stories.find((s) => s.id === id && s.quiz.length > 0) ?? stories.find((s) => s.quiz.length > 0);
  if (!story)
    return (
      <EmptyState
        emoji="📖"
        title={t('quiz.noStory')}
        action={
          <Button onClick={() => void navigate('/stories')}>{t('stories.openLibrary')}</Button>
        }
      />
    );
  return <QuizRound key={round} story={story} onAgain={() => setRound((r) => r + 1)} />;
}
