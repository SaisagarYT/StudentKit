'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { type AttendanceResult } from './attendance.types';

interface Props {
  result: AttendanceResult | null;
}

export function AttendanceResultDisplay({ result }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, [result]);

  if (!result) {
    return (
      <div className="flex items-center justify-center p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] border-dashed">
        <div className="text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            Enter your attendance details to see results
          </p>
        </div>
      </div>
    );
  }

  const { currentPercentage, isAboveTarget, classesCanMiss, classesNeededToAttend, targetPercentage } = result;

  const statusColor = isAboveTarget
    ? 'var(--color-success)'
    : currentPercentage > targetPercentage * 0.9
      ? 'var(--color-warning)'
      : 'var(--color-error)';

  return (
    <div
      ref={containerRef}
      className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]"
    >
      {/* Main percentage */}
      <div className="mb-6">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
          Current Attendance
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-bold tracking-tighter">
            {currentPercentage.toFixed(1)}
          </span>
          <span className="text-2xl font-bold text-[var(--text-subtle)]">%</span>
        </div>
      </div>

      {/* Progress visualization */}
      <div className="relative mb-8">
        <div className="h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(currentPercentage, 100)}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
        {/* Target marker */}
        <div
          className="absolute top-0 h-3 w-0.5 bg-[var(--text-primary)]"
          style={{ left: `${Math.min(targetPercentage, 100)}%` }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[var(--text-subtle)]">0%</span>
          <span
            className="text-xs text-[var(--text-subtle)] -translate-x-1/2"
            style={{ marginLeft: `${targetPercentage}%` }}
          >
            Target: {targetPercentage}%
          </span>
          <span className="text-xs text-[var(--text-subtle)]">100%</span>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
          <span className="text-xs text-[var(--text-subtle)]">Attended</span>
          <div className="mt-1 text-lg font-semibold">
            {result.attendedClasses}/{result.totalClasses}
          </div>
        </div>
        <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
          <span className="text-xs text-[var(--text-subtle)]">Missed</span>
          <div className="mt-1 text-lg font-semibold">
            {result.totalClasses - result.attendedClasses}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div
        className="p-4 rounded-xl border-l-4"
        style={{ borderLeftColor: statusColor, backgroundColor: `color-mix(in srgb, ${statusColor} 8%, transparent)` }}
      >
        {isAboveTarget ? (
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            <span className="font-semibold">You&apos;re on track.</span> You can
            safely miss{' '}
            <span className="font-semibold">{classesCanMiss}</span> more
            class{classesCanMiss !== 1 ? 'es' : ''} and still stay above{' '}
            {targetPercentage}%.
          </p>
        ) : classesNeededToAttend === Infinity ? (
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            <span className="font-semibold">100% target is unreachable</span>{' '}
            since you&apos;ve already missed classes.
          </p>
        ) : (
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            <span className="font-semibold">Below target.</span> Attend the next{' '}
            <span className="font-semibold">{classesNeededToAttend}</span>{' '}
            class{classesNeededToAttend !== 1 ? 'es' : ''} consecutively to reach{' '}
            {targetPercentage}%.
          </p>
        )}
      </div>
    </div>
  );
}
