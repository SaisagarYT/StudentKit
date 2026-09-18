'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { animate } from 'animejs';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1600,
  className,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || animatedRef.current) return;
    animatedRef.current = true;

    const counterObj = { val: 0 };
    animate(counterObj, {
      val: value,
      duration,
      ease: 'outExpo',
      onUpdate: () => {
        setDisplayValue(Math.round(counterObj.val));
      },
    });
  }, [isInView, value, duration]);

  return (
    <span ref={containerRef} className={cn('tabular-nums font-bold', className)}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

