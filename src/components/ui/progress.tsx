'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
  animate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      indicatorClassName,
      animate = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, Math.round(((value || 0) / (max || 100)) * 100)));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]',
          className
        )}
        {...props}
      >
        {animate ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full bg-[var(--accent-dark)] transition-all',
              indicatorClassName
            )}
          />
        ) : (
          <div
            style={{ width: `${percentage}%` }}
            className={cn(
              'h-full rounded-full bg-[var(--accent-dark)] transition-all',
              indicatorClassName
            )}
          />
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

