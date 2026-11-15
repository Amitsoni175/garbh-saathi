import { useState } from 'react';
import { useT } from '@/app/useT';
import { Button, ConfettiPetals, EmptyState, PageHeader, useToast } from '@/components/ui';
import { celebrate } from '@/lib/feedback';

export default function PlayScreen() {
  const t = useT();
  const toast = useToast();
  const [burst, setBurst] = useState(0);
  return (
    <>
      <PageHeader title={t('tab.play')} />
      <EmptyState
        emoji="🎮"
        title={t('play.comingTitle')}
        text={t('play.comingText')}
        action={
          <Button
            breathe
            onClick={() => {
              setBurst((n) => n + 1);
              celebrate();
              toast({ message: t('feedback.wellDone') });
            }}
          >
            {t('play.tryPetals')}
          </Button>
        }
      />
      <ConfettiPetals burst={burst} />
    </>
  );
}
