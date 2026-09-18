'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, ArrowRight, FileText, Bookmark, Crown, Medal, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { subscribeToLeaderboard, type LeaderboardEntry } from '@/lib/firebase/leaderboard';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { isFirebaseConfigured } from '@/lib/firebase/client';

interface LeaderboardWidgetProps {
  userRank?: number;
}

const RANK_ICONS = [Crown, Medal, Award];

export function LeaderboardWidget({ userRank }: LeaderboardWidgetProps) {
  const { user } = useUserAuth();
  const [topLearners, setTopLearners] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToLeaderboard(3, 'xp', (entries) => {
      setTopLearners(entries);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const currentUserEntryIndex = topLearners.findIndex((l) => user && l.uid === user.uid);
  const displayRank =
    currentUserEntryIndex !== -1
      ? `#${currentUserEntryIndex + 1}`
      : userRank
      ? `#${userRank}`
      : 'Unranked';

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
          <p className="text-sm font-bold text-[var(--text-primary)]">
            {displayRank === 'Unranked' ? 'Join the Competition' : `Ranked ${displayRank}`}
          </p>
        </div>
        <span className="text-base font-extrabold text-[var(--accent-dark)] font-mono">
          {displayRank}
        </span>
      </div>

      {/* Top 3 Preview or Empty State */}
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2 py-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 rounded-sm bg-[var(--bg-subtle)] animate-pulse" />
            ))}
          </div>
        ) : topLearners.length === 0 ? (
          <div className="py-6 text-center p-3 rounded-md bg-[var(--bg-subtle)]/40 border border-dashed border-[var(--border-soft)]">
            <Trophy className="w-6 h-6 mx-auto text-[var(--text-subtle)] opacity-40 mb-1.5" />
            <p className="text-xs font-semibold text-[var(--text-primary)]">No Learners Ranked Yet</p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              Solve problems and earn XP to take the #1 spot on the leaderboard!
            </p>
          </div>
        ) : (
          topLearners.map((learner, index) => {
            const Icon = RANK_ICONS[index] || Medal;
            const isMe = user && learner.uid === user.uid;
            return (
              <div
                key={learner.uid || index}
                className={`flex items-center justify-between p-2 rounded-sm border text-xs transition-colors ${
                  isMe
                    ? 'bg-[var(--accent-dark)]/10 border-[var(--accent-dark)]'
                    : 'bg-[var(--bg-subtle)]/50 border-[var(--border-soft)]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0" />
                  <span className="font-semibold text-[var(--text-primary)] truncate">
                    {learner.displayName || 'Anonymous'}
                    {isMe && ' (You)'}
                  </span>
                </div>
                <span className="font-mono text-[var(--text-secondary)] font-medium shrink-0 ml-2">
                  {(learner.xp || 0).toLocaleString()} XP
                </span>
              </div>
            );
          })
        )}
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
