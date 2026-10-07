import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glowColor?: string;
  as?: 'div' | 'article';
}

export function Card({
  children,
  className,
  hover = true,
  glowColor,
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:shadow-lg',
        className
      )}
      style={
        glowColor
          ? ({ '--glow-color': glowColor } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Component>
  );
}
