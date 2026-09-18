'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Binary, ArrowRight, Flame, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getStreak } from '@/lib/user-progress';
import { Progress } from '@/components/ui/progress';

const DSA_STORAGE_KEY = 'sk-dsa-progress';
const TOTAL_PROBLEMS = 250;

export function PlacementReadinessStrip() {
  const [mounted, setMounted] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(DSA_STORAGE_KEY);
      if (raw) {
        const data: Record<string, boolean> = JSON.parse(raw);
        setSolvedCount(Object.values(data).filter(Boolean).length);
      }
      const streak = getStreak();
      setStreakDays(streak.current);
    } catch {}
  }, []);

  if (!mounted) return null;

  const percent = Math.round((solvedCount / TOTAL_PROBLEMS) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="p-5 md:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm mb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Progress info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              <Binary className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
              Your Readiness Status
            </span>
            {streakDays > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]">
                <Flame className="w-3 h-3 text-[var(--accent-dark)] fill-current" />
                {streakDays}-day streak
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-[var(--text-primary)]">
              {solvedCount > 0 ? (
                <>
                  <span className="font-mono font-bold">{solvedCount}</span> of{' '}
                  <span className="font-mono">{TOTAL_PROBLEMS}</span> problems solved
                </>
              ) : (
                'Start solving curated patterns from Blind 75 and NeetCode 150'
              )}
            </span>
            <span className="font-mono font-bold text-xs text-[var(--text-secondary)]">
              {percent}%
            </span>
          </div>

          <Progress value={solvedCount} max={TOTAL_PROBLEMS} />
        </div>

        {/* Right: Direct action */}
        <div className="shrink-0 sm:pl-4 sm:border-l sm:border-[var(--border-soft)]">
          <Link
            href="/placement/dsa"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:bg-[var(--accent-dark)]/90 transition-all shadow-sm w-full sm:w-auto"
          >
            {solvedCount > 0 ? (
              <>
                <span>Resume Solving</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Launch DSA Sheet</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

