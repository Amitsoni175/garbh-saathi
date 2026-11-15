import { createContext, useContext } from 'react';

export interface ToastOptions {
  message: string;
  emoji?: string;
  action?: { label: string; onClick: () => void };
  /** ms before it fades away; 0 = stays until dismissed. Default 3500. */
  duration?: number;
}

export const ToastContext = createContext<(options: ToastOptions) => void>(() => undefined);

/** `const toast = useToast(); toast({ message: 'Saved 🌸' })`. Never use alert(). */
export function useToast() {
  return useContext(ToastContext);
}
