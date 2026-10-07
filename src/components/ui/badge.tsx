import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'forest' | 'neutral' | 'custom';
  className?: string;
}

const variantStyles: Record<string, string> = {
  gold: 'bg-gold/10 text-gold border-gold/20',
  forest: 'bg-forest/10 text-forest border-forest/20',
  neutral: 'bg-foreground/5 text-bodytext border-foreground/10',
  custom: '',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
