import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useComplete } from '@/app/useComplete';
import { useT } from '@/app/useT';
import { BottomSheet, Button, Card } from '@/components/ui';
import type { StringKey } from '@/lib/i18n';
import type { GameId } from '@/lib/plan';

export interface GameShellProps {
  gameId: GameId;
  howTo: StringKey;
  /** Shown as a soft hint message when the Hint button is tapped. */
  hintText?: string;
  onHint?: () => void;
  /** Set to true when she has finished: records a flower and shows the finish card. */
  finished: boolean;
  onPlayAgain: () => void;
  children: ReactNode;
}

/**
 * Shared frame for every game: title, how-to-play sheet, hint button,
 * optional relaxed timer, finish card and the garden reward. No scores, no losing.
 */
export function GameShell({
  gameId,
  howTo,
  hintText,
  onHint,
  finished,
  onPlayAgain,
  children,
}: GameShellProps) {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { settings } = useSettings();
  const complete = useComplete();
  const [howOpen, setHowOpen] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorded = useRef(false);

  // Relaxed count-up timer (only if she turned it on). Never a countdown.
  useEffect(() => {
    if (!settings.relaxedTimer || finished) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [settings.relaxedTimer, finished]);

  useEffect(() => {
    if (finished && !recorded.current) {
      recorded.current = true;
      void complete('game', gameId, t('shell.finishText'));
    }
    if (!finished) recorded.current = false;
  }, [finished, complete, gameId, t]);

  return (
    <>
      <ScreenHeader
        title={t(`game.${gameId}.name`)}
        fallback="/play"
        right={
          <button
            type="button"
            onClick={() => setHowOpen(true)}
            aria-label={t('shell.howTo')}
            className="bg-surface shadow-soft flex min-h-12 min-w-12 items-center justify-center rounded-full text-lg font-bold"
          >
            ?
          </button>
        }
      />
      <div className="flex flex-col gap-3 px-4 pb-6">
        <div className="flex min-h-12 items-center justify-between gap-2">
          {settings.relaxedTimer ? (
            <span className="text-text-muted text-sm">⏱️ {t('shell.timer', { sec: seconds })}</span>
          ) : (
            <span />
          )}
          {(onHint || hintText) && !finished && (
            <Button
              variant="calm"
              onClick={() => {
                onHint?.();
                setHintShown(true);
                window.setTimeout(() => setHintShown(false), 3500);
              }}
              icon="💡"
            >
              {t('shell.hint')}
            </Button>
          )}
        </div>
        <AnimatePresence>
          {hintShown && hintText && (
            <m.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="rounded-soft bg-calm/60 text-on-fill p-3"
            >
              💡 {hintText}
            </m.p>
          )}
        </AnimatePresence>

        {finished ? (
          <Card tone="primary">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="text-6xl" aria-hidden="true">
                🌸
              </span>
              <h2 className="text-2xl font-bold">{t('shell.finishTitle')}</h2>
              <p>{t('shell.finishText')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="secondary" onClick={onPlayAgain}>
                  🔄 {t('shell.playAgain')}
                </Button>
                <Button onClick={() => void navigate(params.get('daily') ? '/' : '/play')}>
                  {t('shell.done')}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          children
        )}
      </div>
      <BottomSheet
        open={howOpen}
        onClose={() => setHowOpen(false)}
        title={t('shell.howTo')}
        closeLabel={t('ui.close')}
      >
        <p className="mb-4">{t(howTo)}</p>
        <Button onClick={() => setHowOpen(false)}>{t('shell.start')}</Button>
      </BottomSheet>
    </>
  );
}
