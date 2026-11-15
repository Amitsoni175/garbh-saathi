import { m, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'calm' | 'accent' | 'ghost';
type Size = 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-on-fill shadow-soft',
  secondary: 'bg-secondary text-on-fill',
  calm: 'bg-calm text-on-fill',
  accent: 'bg-accent text-on-fill',
  ghost: 'bg-transparent text-text',
};

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-6 py-2 text-base',
  lg: 'min-h-14 px-8 py-3 text-lg',
};

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  /** The gentle "breathing" animation for the main action on a screen. */
  breathe?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  breathe = false,
  icon,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <m.button
      type={type}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-opacity disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${breathe ? 'animate-breathe' : ''} ${className}`}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </m.button>
  );
}
