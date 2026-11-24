import { Link } from 'react-router';
import { SITE_LINKS } from '@/features/home/siteLinks';
import { isStandalone } from '@/lib/notify';
import { useT } from './useT';

/**
 * The website header (logo + menu), the same as on wombtales.in/articles/.
 * In the installed app the website opens in a new window so the app stays open.
 */
export function TopBar({ className = '' }: { className?: string }) {
  const t = useT();
  const newWindow = isStandalone();
  return (
    <header
      className={`border-secondary/60 sticky top-0 z-20 flex-wrap items-center gap-x-3 gap-y-1 border-b bg-[color-mix(in_srgb,var(--gs-background)_88%,transparent)] px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 backdrop-blur ${className}`}
    >
      <Link to="/" className="flex shrink-0 items-center gap-2 py-1 text-lg font-extrabold">
        <img src="./icons/icon.svg" alt="" width={34} height={34} className="rounded-lg" />
        {t('app.name')}
      </Link>
      <nav
        aria-label={t('explore.title')}
        className="order-3 flex basis-full [scrollbar-width:none] gap-1 overflow-x-auto sm:order-none sm:flex-1 sm:basis-auto [&::-webkit-scrollbar]:hidden"
      >
        {SITE_LINKS.filter((l) => l.key !== 'settings.privacyPage').map((l) => (
          <a
            key={l.href}
            href={l.href}
            {...(newWindow ? { target: '_blank', rel: 'noopener' } : {})}
            className="hover:bg-primary flex min-h-10 shrink-0 items-center rounded-full px-3 text-[0.95rem] font-semibold whitespace-nowrap transition-colors"
          >
            {t(l.key)}
          </a>
        ))}
      </nav>
    </header>
  );
}
