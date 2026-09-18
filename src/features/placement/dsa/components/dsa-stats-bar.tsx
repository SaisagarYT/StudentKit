'use client';

import Link from 'next/link';
import { Trophy, RotateCcw, Cloud } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Progress } from '@/components/ui/progress';

interface DsaStatsBarProps {
  completedCount: number;
  totalProblems: number;
  percent: number;
  mounted: boolean;
  onReset: () => void;
  authUser: { uid?: string } | null;
}

export function DsaStatsBar({
  completedCount,
  totalProblems,
  percent,
  mounted,
  onReset,
  authUser,
}: DsaStatsBarProps) {
  return (
    <div className="sticky top-16 md:top-18 z-20 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-soft)] rounded-md p-4 mb-6 shadow-sm transition-all">
      {/* Top row: Solved count, percentage, reset */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
            <Trophy className="w-4 h-4 text-[var(--accent-dark)]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
              <AnimatedCounter value={mounted ? completedCount : 0} />
              <span className="text-xs font-normal text-[var(--text-subtle)] ml-1">
                / {totalProblems} solved
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
            className="p-1.5 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            title="Reset progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reusable Progress bar */}
      <Progress value={mounted ? completedCount : 0} max={totalProblems} className="h-2" />

      {/* Sign-in cloud sync nudge */}
      {!authUser && mounted && completedCount >= 3 && (
        <Link
          href="/login"
          className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/60 hover:bg-[var(--bg-subtle)] transition-colors group text-xs"
        >
          <Cloud className="w-4 h-4 text-[var(--accent-dark)] shrink-0" />
          <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
            <strong className="text-[var(--text-primary)]">Sign in</strong> to sync your DSA progress to the cloud across devices
          </span>
        </Link>
      )}
    </div>
  );
}

