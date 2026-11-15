import { useNavigate } from 'react-router';
import { useProfile } from '@/app/profile';
import { ScreenHeader } from '@/app/ScreenHeader';
import { useCelebrate } from '@/app/celebrate';
import { useT } from '@/app/useT';
import { Button, Card } from '@/components/ui';

/** Placeholder for the after-birth part of the journey (built later). */
export default function AfterBirthScreen() {
  const t = useT();
  const navigate = useNavigate();
  const celebrate = useCelebrate();
  const { profile, update } = useProfile();
  return (
    <>
      <ScreenHeader title={t('after.title')} />
      <div className="flex flex-col gap-4 px-4 pb-6">
        <Card tone="primary">
          <p className="text-6xl" aria-hidden="true">
            👶🌸
          </p>
          <p className="mt-2">{t('after.text')}</p>
          {!profile?.afterBirth && (
            <Button
              className="mt-3"
              variant="secondary"
              onClick={() => {
                void update({ afterBirth: true });
                celebrate(t('after.marked'));
              }}
            >
              {t('after.mark')}
            </Button>
          )}
        </Card>
        <Card index={1} tone="secondary">
          <h2 className="font-bold">{t('after.coming')}</h2>
          <p className="mt-1">{t('after.list')}</p>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void navigate('/music/lokgeet')}>🌙 {t('after.loris')}</Button>
          <Button variant="calm" onClick={() => void navigate('/bonding/journal')}>
            💌 {t('after.letters')}
          </Button>
        </div>
        <p className="text-text-muted text-sm">{t('after.doctor')}</p>
      </div>
    </>
  );
}
