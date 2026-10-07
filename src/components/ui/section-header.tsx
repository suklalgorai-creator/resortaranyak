'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  divider?: boolean;
  className?: string;
  animate?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  divider = true,
  className,
  animate = true,
}: SectionHeaderProps) {
  const Wrapper = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
      }
    : {};

  return (
    <Wrapper
      {...animationProps}
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <h2 className="font-serif text-3xl md:text-5xl text-heading mb-4 font-semibold tracking-wide">
        {title}
      </h2>
      {divider && (
        <div
          className={cn(
            'h-1 rounded-full opacity-80 mb-6',
            align === 'center'
              ? 'w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto'
              : 'w-24 bg-gradient-to-r from-gold to-transparent'
          )}
        />
      )}
      {subtitle && (
        <p
          className={cn(
            'text-bodytext max-w-2xl text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </Wrapper>
  );
}
