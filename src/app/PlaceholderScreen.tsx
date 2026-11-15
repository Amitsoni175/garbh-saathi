import { useState } from 'react';
import { t } from '@/lib/i18n';

const swatches = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'calm', className: 'bg-calm' },
] as const;

/**
 * Temporary Phase 0 screen that shows the theme tokens, fonts and motion.
 * The night toggle here is only a preview; real night mode comes in Phase 1.
 */
export function PlaceholderScreen() {
  const [night, setNight] = useState(false);

  function toggleNight() {
    const next = !night;
    setNight(next);
    document.documentElement.dataset.theme = next ? 'night' : 'day';
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="animate-float-in text-center">
        <p className="text-4xl" aria-hidden="true">
          🌸
        </p>
        <h1 className="mt-2 text-2xl font-bold">{t('app.welcome')}</h1>
        <p className="text-text-muted">{t('app.tagline')}</p>
      </header>

      <section
        className="animate-float-in rounded-softer bg-surface shadow-soft p-6 [animation-delay:120ms]"
        aria-labelledby="shloka-title"
      >
        <h2 id="shloka-title" className="text-lg font-semibold">
          {t('placeholder.shlokaTitle')}
        </h2>
        <p lang="sa" className="font-deva mt-3 text-xl leading-loose">
          ॐ सह नाववतु । सह नौ भुनक्तु ।
        </p>
        <p className="text-text-muted mt-1">{t('placeholder.shlokaMeaning')}</p>
      </section>

      <section
        className="animate-float-in rounded-softer bg-surface shadow-soft p-6 [animation-delay:240ms]"
        aria-label={t('placeholder.colours')}
      >
        <div className="grid grid-cols-4 gap-3">
          {swatches.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-1">
              <span className={`rounded-soft h-12 w-12 ${s.className}`} />
              <span className="text-text-muted text-xs">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto flex flex-col items-center gap-4">
        <button
          type="button"
          className="animate-breathe bg-primary text-on-fill shadow-soft min-h-12 rounded-full px-8 py-3 text-lg font-semibold"
        >
          {t('placeholder.begin')}
        </button>
        <button
          type="button"
          onClick={toggleNight}
          aria-pressed={night}
          className="bg-secondary text-on-fill min-h-12 rounded-full px-6 py-2 font-semibold"
        >
          {night ? t('placeholder.dayPreview') : t('placeholder.nightPreview')}
        </button>
        <p className="text-text-muted text-sm">v{__APP_VERSION__}</p>
      </div>
    </main>
  );
}
