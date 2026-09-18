'use client';

import Link from 'next/link';
import { Cpu, RotateCcw, Cloud } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Progress } from '@/components/ui/progress';

interface CsStatsBarProps {
  completedCount: number;
  totalConcepts: number;
  percent: number;
  currentSubjectTitle: string;
  currentSubjectCompleted: number;
  currentSubjectTotal: number;
  currentSubjectPercent: number;
  mounted: boolean;
  onReset: () => void;
  authUser: { uid?: string } | null;
}

export function CsStatsBar({
  completedCount,
  totalConcepts,
  percent,
  currentSubjectTitle,
  currentSubjectCompleted,
  currentSubjectTotal,
  currentSubjectPercent,
  mounted,
  onReset,
  authUser,
}: CsStatsBarProps) {
  return (
    <div className="sticky top-16 md:top-18 z-20 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-soft)] rounded-md p-4 mb-6 shadow-sm transition-all">
      {/* Top row: Mastered count, percentage, reset */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
            <Cpu className="w-4 h-4 text-[var(--accent-dark)]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
              <AnimatedCounter value={mounted ? completedCount : 0} />
              <span className="text-xs font-normal text-[var(--text-subtle)] ml-1">
                / {totalConcepts} concepts mastered
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold font-mono text-[var(--text-primary)]">
            {mounted ? percent : 0}%
          </span>
          <button
            onClick={onReset}
            className="p-1.5 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Reset CS progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={mounted ? completedCount : 0} max={totalConcepts} className="h-2" />

      {/* Current subject focus indicator */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
        <span>
          Current Subject:{' '}
          <strong className="text-[var(--text-primary)] font-medium">{currentSubjectTitle}</strong>
        </span>
        <span className="font-mono">
          {mounted ? currentSubjectCompleted : 0} / {currentSubjectTotal} ({mounted ? currentSubjectPercent : 0}%)
        </span>
      </div>

      {/* Sign-in cloud sync nudge */}
      {!authUser && mounted && completedCount >= 3 && (
        <Link
          href="/login"
          className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)] transition-colors group text-xs"
        >
          <Cloud className="w-4 h-4 text-[var(--accent-dark)] shrink-0" />
          <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            <strong className="text-[var(--text-primary)]">Sign in</strong> to sync your CS Fundamentals progress to the cloud across devices
          </span>
        </Link>
      )}
    </div>
  );
}

