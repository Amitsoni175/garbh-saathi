import type { StringKey } from '@/lib/i18n';

/** Links to the Wombtales website pages. */
export const SITE_LINKS: { key: StringKey; emoji: string; href: string }[] = [
  { key: 'explore.articles', emoji: '📚', href: './articles/' },
  { key: 'explore.weeks', emoji: '🥭', href: './pregnancy-week/' },
  { key: 'explore.stories', emoji: '📖', href: './stories/' },
  { key: 'explore.thoughts', emoji: '☀️', href: './thoughts/' },
  { key: 'settings.ourStory', emoji: '💛', href: './about/' },
  { key: 'settings.privacyPage', emoji: '🔒', href: './privacy/' },
];
