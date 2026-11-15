import { useNavigate } from 'react-router';
import { usePregnancy } from '@/app/usePregnancy';
import { useT } from '@/app/useT';
import { moodEmoji } from '@/lib/wellness';
import { useCare } from './useCare';

/** Four small care tiles on Today: tablet, water, mood, kicks. */
export function CareRow() {
  const t = useT();
  const navigate = useNavigate();
  const care = useCare();
  const state = usePregnancy();
  const tiles = [
    {
      key: 'tablet',
      emoji: care.tablet ? '✅' : '💊',
      label: t('care.tablet'),
      value: care.tablet ? '✓' : '',
      to: '/wellness',
      done: care.tablet,
    },
    {
      key: 'water',
      emoji: '💧',
      label: t('care.water'),
      value: `${care.water}/${care.goal}`,
      to: '/wellness',
      done: care.water >= care.goal,
    },
    {
      key: 'mood',
      emoji: moodEmoji(care.mood) ?? '🙂',
      label: t('care.mood'),
      value: '',
      to: '/wellness',
      done: care.mood !== undefined,
    },
    {
      key: 'kicks',
      emoji: '👣',
      label: t('care.kicks'),
      value: (state?.weeks ?? 0) >= 28 ? '' : '',
      to: '/bonding/kicks',
      done: false,
    },
  ];
  return (
    <section aria-label={t('care.title')}>
      <ul className="grid grid-cols-4 gap-2">
        {tiles.map((tile) => (
          <li key={tile.key}>
            <button
              type="button"
              onClick={() => void navigate(tile.to)}
              className={`rounded-soft shadow-soft flex min-h-20 w-full flex-col items-center justify-center px-1 py-2 ${tile.done ? 'bg-calm text-on-fill' : 'bg-surface'}`}
            >
              <span className="text-2xl" aria-hidden="true">
                {tile.emoji}
              </span>
              <span className="text-xs font-semibold">{tile.label}</span>
              {tile.value && <span className="text-xs">{tile.value}</span>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
