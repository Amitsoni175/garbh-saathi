import { useNavigate } from 'react-router';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';
import type { PregnancyState } from '@/lib/pregnancy';

/** Gentle cards for the edges of the journey: before it starts, 40+ and 42+ weeks. */
export function StageCard({ state }: { state: PregnancyState }) {
  const t = useT();
  const navigate = useNavigate();
  if (state.stage === 'normal') return null;
  if (state.stage === 'early') {
    return (
      <Card tone="secondary">
        <p>🌱 {t('stage.earlyText')}</p>
      </Card>
    );
  }
  if (state.stage === 'anyDay') {
    return (
      <Card tone="primary">
        <h2 className="text-lg font-bold">{t('stage.anyDayTitle')}</h2>
        <p className="mt-1">{t('stage.anyDayText')}</p>
      </Card>
    );
  }
  return (
    <Card tone="primary">
      <h2 className="text-lg font-bold">{t('stage.overdueTitle')}</h2>
      <p className="mt-1">{t('stage.overdueText')}</p>
      <Button className="mt-3" variant="calm" onClick={() => void navigate('/after-birth')}>
        {t('stage.arrived')}
      </Button>
    </Card>
  );
}
