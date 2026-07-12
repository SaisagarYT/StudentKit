'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { type CGPAResult } from './cgpa.types';

interface Props {
  result: CGPAResult | null;
}

export function CGPAResultDisplay({ result }: Props) {
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
        <p className="text-sm text-[var(--text-subtle)]">
          Add your semester GPAs and credits to calculate CGPA
        </p>
      </div>
    );
  }

  const performance = getPerformanceLabel(result.cgpa);

  return (
    <div
      ref={containerRef}
      className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
        Cumulative GPA
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-5xl md:text-6xl font-bold tracking-tighter">
          {result.cgpa.toFixed(2)}
        </span>
        <span className="text-lg font-medium text-[var(--text-subtle)]">
          / 10
        </span>
      </div>

      {/* Visual bar */}
      <div className="mt-6 h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent-college)] transition-all duration-700 ease-out"
          style={{ width: `${(result.cgpa / 10) * 100}%` }}
        />
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-center">
          <span className="text-xs text-[var(--text-subtle)]">Semesters</span>
          <div className="mt-1 text-lg font-semibold">
            {result.semesterCount}
          </div>
        </div>
        <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-center">
          <span className="text-xs text-[var(--text-subtle)]">Credits</span>
          <div className="mt-1 text-lg font-semibold">
            {result.totalCredits}
          </div>
        </div>
        <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-center">
          <span className="text-xs text-[var(--text-subtle)]">Grade Points</span>
          <div className="mt-1 text-lg font-semibold">
            {result.totalGradePoints.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Performance context */}
      <div className="mt-6 p-4 rounded-xl bg-[var(--accent-college)]/10 border-l-4 border-[var(--accent-college)]">
        <p className="text-sm text-[var(--text-primary)]">
          <span className="font-semibold">{performance.label}</span>{' '}
          {performance.description}
        </p>
      </div>
    </div>
  );
}

function getPerformanceLabel(cgpa: number): {
  label: string;
  description: string;
} {
  if (cgpa >= 9.0) return { label: 'Outstanding', description: 'Top-tier academic performance.' };
  if (cgpa >= 8.0) return { label: 'Excellent', description: 'Well above average performance.' };
  if (cgpa >= 7.0) return { label: 'Very Good', description: 'Strong academic standing.' };
  if (cgpa >= 6.0) return { label: 'Good', description: 'Solid academic performance.' };
  if (cgpa >= 5.0) return { label: 'Average', description: 'Meets minimum requirements.' };
  return { label: 'Below Average', description: 'May need improvement for progression.' };
}
