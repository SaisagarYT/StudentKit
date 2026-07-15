'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { getStreak, recordActivity, type StreakData, getProgressSummary, type ProgressSummary } from '@/lib/user-progress';

export function StreakBanner() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const updated = recordActivity();
    setStreak(updated);
    setProgress(getProgressSummary());
  }, []);

  if (!streak || streak.totalActiveDays === 0) return null;

  return (
    <div className="container-main mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          {/* Streak */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
                <Flame className="w-6 h-6 text-white" />
              </div>
              {streak.current >= 7 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-[var(--accent-dark)]" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{streak.current}</span>
                <span className="text-sm text-[var(--text-secondary)]">day{streak.current !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-xs text-[var(--text-subtle)]">Current streak</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-[var(--border-soft)]" />

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--text-subtle)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{streak.totalActiveDays}</p>
                <p className="text-[10px] text-[var(--text-subtle)]">Total days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--text-subtle)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{streak.longest}</p>
                <p className="text-[10px] text-[var(--text-subtle)]">Best streak</p>
              </div>
            </div>
            {progress && progress.totalTopicsCompleted > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--text-subtle)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{progress.totalTopicsCompleted}</p>
                  <p className="text-[10px] text-[var(--text-subtle)]">Topics done</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Motivational message */}
        {streak.current >= 3 && (
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {streak.current >= 30 ? "You're unstoppable! A month-long streak!" :
             streak.current >= 14 ? "Two weeks strong! You're building a real habit." :
             streak.current >= 7 ? "A full week! Keep this momentum going." :
             "Great consistency! Keep showing up."}
          </p>
        )}

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-full" />
      </div>
    </div>
  );
}
