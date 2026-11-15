import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { disarmCrash } from '@/lib/debugCrash';
import { logError } from '@/lib/logger';
import { useT } from './useT';

interface BoundaryProps {
  children: ReactNode;
  fallback: (reset: () => void) => ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

/** Catches render errors in one tab or game so the rest of the app keeps working. */
class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    const err = error instanceof Error ? error : new Error(String(error));
    if (info.componentStack)
      err.stack = `${err.stack ?? ''}\nComponent stack:${info.componentStack}`;
    void logError(err, 'boundary');
    disarmCrash(); // only matters for the debug panel's simulated error
  }

  reset = () => this.setState({ hasError: false });

  render() {
    return this.state.hasError ? this.props.fallback(this.reset) : this.props.children;
  }
}

function FriendlyError({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  const t = useT();
  return (
    <div
      role="alert"
      className="rounded-softer bg-surface shadow-soft mx-auto flex max-w-sm flex-col items-center gap-4 p-8 text-center"
    >
      <span className="text-5xl" aria-hidden="true">
        🌷
      </span>
      <h2 className="text-xl font-bold">{t('error.title')}</h2>
      <p className="text-text-muted">{t('error.text')}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry}>{t('error.tryAgain')}</Button>
        <Button variant="secondary" onClick={onHome}>
          {t('error.goHome')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Wrap each tab and each game in this. It resets itself when the route changes,
 * so "Go home" (or tapping another tab) always gets her out of a broken screen.
 */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Boundary
      key={pathname}
      fallback={(reset) => (
        <div className="px-4 py-10">
          <FriendlyError
            onRetry={reset}
            onHome={() => {
              reset();
              void navigate('/');
            }}
          />
        </div>
      )}
    >
      {children}
    </Boundary>
  );
}

/** Used by the router when something fails outside a tab (e.g. a bad route). */
export function RouteErrorFallback() {
  return (
    <div className="px-4 py-10">
      <FriendlyError
        onRetry={() => window.location.reload()}
        onHome={() => window.location.assign('#/')}
      />
    </div>
  );
}
