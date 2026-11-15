import { m } from 'motion/react';
import { NavLink } from 'react-router';
import type { StringKey } from '@/lib/i18n';
import { useT } from './useT';

const tabs: { to: string; emoji: string; label: StringKey; end?: boolean }[] = [
  { to: '/', emoji: '🌅', label: 'tab.today', end: true },
  { to: '/calendar', emoji: '📅', label: 'tab.calendar' },
  { to: '/play', emoji: '🎮', label: 'tab.play' },
  { to: '/me', emoji: '🌸', label: 'tab.me' },
];

export function BottomTabBar() {
  const t = useT();
  return (
    <nav
      aria-label={t('tab.navLabel')}
      className="bg-surface/95 fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(90,74,94,0.08)] backdrop-blur"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-sm transition-colors ${isActive ? 'text-text font-bold' : 'text-text-muted'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <m.span
                      layoutId="tab-pill"
                      className="rounded-soft bg-primary/50 absolute inset-x-3 top-1.5 bottom-1.5 -z-10"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="text-xl" aria-hidden="true">
                    {tab.emoji}
                  </span>
                  <span>{t(tab.label)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
