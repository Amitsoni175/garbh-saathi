import { getFestivals, tx, type L10n } from '@/lib/content';
import type { Lang, StringKey } from '@/lib/i18n';
import { dateForWeek } from '@/lib/pregnancy';

export interface Marker {
  date: string;
  emoji: string;
  label: { key: StringKey } | { text: L10n };
  kind: 'milestone' | 'festival';
  festivalId?: string;
}

/** Automatic calendar markers: trimester changes, week 20/28/37, EDD and Haryana festivals. */
export function buildMarkers(lmp: string | undefined, edd: string | undefined): Marker[] {
  const out: Marker[] = [];
  if (lmp && edd) {
    out.push(
      { date: dateForWeek(lmp, 14), emoji: '🌿', label: { key: 'mile.tri2' }, kind: 'milestone' },
      { date: dateForWeek(lmp, 20), emoji: '🦶', label: { key: 'mile.w20' }, kind: 'milestone' },
      { date: dateForWeek(lmp, 28), emoji: '🌳', label: { key: 'mile.tri3' }, kind: 'milestone' },
      { date: dateForWeek(lmp, 37), emoji: '🌼', label: { key: 'mile.w37' }, kind: 'milestone' },
      { date: edd, emoji: '👶', label: { key: 'mile.edd' }, kind: 'milestone' },
    );
  }
  const { list, dates } = getFestivals();
  for (const d of dates) {
    const f = list.find((x) => x.id === d.id);
    if (f)
      out.push({
        date: d.date,
        emoji: f.emoji,
        label: { text: f.name },
        kind: 'festival',
        festivalId: f.id,
      });
  }
  return out;
}

export function markerText(m: Marker, t: (k: StringKey) => string, lang: Lang): string {
  return 'key' in m.label ? t(m.label.key) : tx(m.label.text, lang);
}
