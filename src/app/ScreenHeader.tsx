import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useT } from './useT';

/** Page title with a large back button. Goes back in history, or to `fallback`. */
export function ScreenHeader({
  title,
  subtitle,
  fallback = '/',
  right,
}: {
  title: string;
  subtitle?: string;
  fallback?: string;
  right?: ReactNode;
}) {
  const t = useT();
  const navigate = useNavigate();
  return (
    <header className="flex items-center gap-2 px-3 pt-4 pb-2">
      <button
        type="button"
        onClick={() => {
          if (
            window.history.state &&
            typeof window.history.state.idx === 'number' &&
            window.history.state.idx > 0
          )
            void navigate(-1);
          else void navigate(fallback);
        }}
        aria-label={t('ui.back')}
        className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full text-xl"
      >
        ←
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold">{title}</h1>
        {subtitle && <p className="text-text-muted truncate text-sm">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
