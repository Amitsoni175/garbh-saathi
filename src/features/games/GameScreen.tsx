import { Suspense } from 'react';
import { useParams } from 'react-router';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { useT } from '@/app/useT';
import { EmptyState } from '@/components/ui';
import { GAMES } from './registry';

/** /play/:gameId: each game in its own error boundary, loaded on demand. */
export default function GameScreen() {
  const t = useT();
  const { gameId } = useParams();
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return <EmptyState emoji="🎮" title={t('shell.notFound')} />;
  const { Component } = game;
  return (
    <ErrorBoundary>
      <Suspense fallback={<EmptyState emoji={game.emoji} title={t(`game.${game.id}.name`)} />}>
        <Component key={game.id} />
      </Suspense>
    </ErrorBoundary>
  );
}
