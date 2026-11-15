import { format } from 'date-fns';
import { m } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useSettings } from '@/app/settings';
import { useNow } from '@/app/useClock';
import { useT } from '@/app/useT';
import { Button, Card, EmptyState } from '@/components/ui';
import { getFestivals, tx } from '@/lib/content';
import { parseLocalDate, toLocalISO } from '@/lib/pregnancy';

/** A soft swing under a neem branch for Hariyali Teej. */
function TeejSwing() {
  return (
    <svg viewBox="0 0 200 160" className="mx-auto w-64" role="img" aria-label="🌿">
      <path
        d="M10 20 Q100 0 190 20"
        stroke="#7FB39A"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {[30, 60, 140, 170].map((x) => (
        <ellipse key={x} cx={x} cy={18} rx={10} ry={5} fill="#CDEBDD" />
      ))}
      <m.g
        style={{ originX: '100px', originY: '14px' }}
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="75" y1="14" x2="75" y2="120" stroke="#C99AA6" strokeWidth="3" />
        <line x1="125" y1="14" x2="125" y2="120" stroke="#C99AA6" strokeWidth="3" />
        <rect x="65" y="118" width="70" height="10" rx="5" fill="#F4C2C2" />
        <text x="100" y="112" textAnchor="middle" fontSize="22">
          🌸
        </text>
      </m.g>
    </svg>
  );
}

export default function FestivalScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useSettings();
  const lang = settings.textLang;
  const today = toLocalISO(useNow());
  const { list, dates } = getFestivals();
  const festival = list.find((f) => f.id === id);
  if (!festival) return <EmptyState emoji="🪔" title={t('fest.notFound')} />;
  const myDates = dates.filter((d) => d.id === festival.id);

  return (
    <>
      <ScreenHeader title={tx(festival.name, lang)} fallback="/festivals" />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="accent">
          <p className="text-6xl" aria-hidden="true">
            {festival.emoji}
          </p>
          <p className="mt-2 text-lg">{tx(festival.blurb, lang)}</p>
          <ul className="mt-2 text-sm">
            {myDates.map((d) => {
              const date = parseLocalDate(d.date);
              return (
                <li key={d.date} className={d.date === today ? 'font-bold' : ''}>
                  📅 {date ? format(date, 'EEEE, d MMMM yyyy') : d.date}
                </li>
              );
            })}
          </ul>
        </Card>
        {festival.id === 'hariyali-teej' && (
          <Card index={1}>
            <h2 className="text-center font-bold">{t('fest.swing')}</h2>
            <TeejSwing />
            <div className="flex justify-center">
              <Button variant="calm" onClick={() => void navigate('/music/sing/saawan-teej')}>
                {t('fest.song')}
              </Button>
            </div>
          </Card>
        )}
        {festival.caution && (
          <Card index={2} tone="secondary">
            <h2 className="font-semibold">💛 {t('fest.careNote')}</h2>
            <p className="mt-1">{tx(festival.caution, lang)}</p>
          </Card>
        )}
        {festival.activity.to !== `/festival/${festival.id}` && (
          <Button size="lg" breathe onClick={() => void navigate(festival.activity.to)}>
            {tx(festival.activity.label, lang)}
          </Button>
        )}
      </div>
    </>
  );
}
