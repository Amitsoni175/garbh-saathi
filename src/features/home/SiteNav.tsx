import { useT } from '@/app/useT';
import { SITE_LINKS } from './siteLinks';

/** The website menu, shown at the top of Today (same links as the website header). */
export function SiteNav() {
  const t = useT();
  return (
    <nav
      aria-label={t('explore.title')}
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden"
    >
      {SITE_LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener"
          className="bg-surface shadow-soft flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap"
        >
          <span aria-hidden="true">{l.emoji}</span>
          {t(l.key)}
        </a>
      ))}
    </nav>
  );
}
