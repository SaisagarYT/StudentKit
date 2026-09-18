'use client';

import Link from 'next/link';
import { Trophy, ArrowRight, FileText, Bookmark, Crown, Medal } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardWidgetProps {
  userRank?: number;
}

const mockTopLearners = [
  { rank: 1, name: 'Arjun M.', xp: 2450, icon: Crown },
  { rank: 2, name: 'Priya S.', xp: 2180, icon: Medal },
  { rank: 3, name: 'Dev R.', xp: 1920, icon: Medal },
];

export function LeaderboardWidget({ userRank = 12 }: LeaderboardWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Leaderboard
            </h4>
          </div>
        </div>

        <Link
          href="/leaderboard"
          className="text-xs font-semibold text-[var(--accent-dark)] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Your Rank Card */}
      <div className="p-3 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)]">Your Standing</span>
          <p className="text-sm font-bold text-[var(--text-primary)]">Top 5% of Learners</p>
        </div>
        <span className="text-base font-extrabold text-[var(--accent-dark)] font-mono">
          #{userRank}
        </span>
      </div>

      {/* Top 3 Preview */}
      <div className="space-y-2">
        {mockTopLearners.map((learner) => {
          const Icon = learner.icon;
          return (
            <div
              key={learner.rank}
              className="flex items-center justify-between p-2 rounded-sm bg-[var(--bg-subtle)]/50 border border-[var(--border-soft)] text-xs"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                <span className="font-semibold text-[var(--text-primary)]">{learner.name}</span>
              </div>
              <span className="font-mono text-[var(--text-secondary)] font-medium">
                {learner.xp.toLocaleString()} XP
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Utilities */}
      <div className="pt-3 border-t border-[var(--border-soft)] grid grid-cols-2 gap-2">
        <Link
          href="/resume-builder"
          className="group flex items-center gap-2 p-2.5 rounded-sm text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
          <span>ATS Resume</span>
        </Link>
        <Link
          href="/notes"
          className="group flex items-center gap-2 p-2.5 rounded-sm text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors shadow-sm"
        >
          <Bookmark className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
          <span>Study Notes</span>
        </Link>
      </div>
    </motion.div>
  );
}
