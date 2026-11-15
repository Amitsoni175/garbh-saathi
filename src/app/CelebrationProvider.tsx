import { useCallback, useState, type ReactNode } from 'react';
import { ConfettiPetals } from '@/components/ui/ConfettiPetals';
import { useToast } from '@/components/ui/toastContext';
import { celebrate } from '@/lib/feedback';
import { CelebrateContext } from './celebrate';

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [burst, setBurst] = useState(0);
  const toast = useToast();
  const fire = useCallback(
    (message?: string) => {
      setBurst((n) => n + 1);
      celebrate();
      if (message) toast({ message });
    },
    [toast],
  );
  return (
    <CelebrateContext.Provider value={fire}>
      {children}
      <ConfettiPetals burst={burst} />
    </CelebrateContext.Provider>
  );
}
