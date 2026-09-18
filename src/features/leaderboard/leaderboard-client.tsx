'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Trophy, Flame, Code, Brain, TrendingUp, Crown, Medal, Award } from 'lucide-react';
import { subscribeToLeaderboard, type LeaderboardEntry } from '@/lib/firebase/leaderboard';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { isFirebaseConfigured } from '@/lib/firebase/client';

type SortField = 'xp' | 'dsaSolved' | 'streak';

const SORT_OPTIONS: { key: SortField; label: string; icon: React.ElementType }[] = [
  { key: 'xp', label: 'XP', icon: TrendingUp },
  { key: 'dsaSolved', label: 'Problems', icon: Code },
  { key: 'streak', label: 'Streak', icon: Flame },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />;
  if (rank === 2) return <Medal className="w-5 h-5 text-[var(--text-secondary)]" />;
  if (rank === 3) return <Award className="w-5 h-5" style={{ color: 'var(--color-warning)', opacity: 0.6 }} />;
  return (
    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[var(--text-subtle)]">
      {rank}
    </span>
  );
}

function LeaderboardRow({ entry, rank, isCurrentUser, index }: {
  entry: LeaderboardEntry; rank: number; isCurrentUser: boolean; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`flex items-center gap-4 p-4 rounded-sm transition-all ${
        isCurrentUser
          ? 'bg-[var(--bg-subtle)] border-2 border-[var(--accent-dark)] shadow-sm'
          : rank <= 3
          ? 'bg-[var(--bg-surface)] border border-[var(--border-soft)]'
          : 'hover:bg-[var(--bg-subtle)]'
      }`}
    >
      <div className="w-8 flex justify-center shrink-0">
        <RankBadge rank={rank} />
      </div>

      <div className="shrink-0">
        {entry.photoURL ? (
          <Image
            src={entry.photoURL}
            alt={entry.displayName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--accent-dark)] flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--text-inverse)]">
              {entry.displayName[0]?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {entry.displayName}
          {isCurrentUser && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)]">YOU</span>}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] text-[var(--text-subtle)] flex items-center gap-1">
            <Code className="w-3 h-3" />{entry.dsaSolved} solved
          </span>
          <span className="text-[11px] text-[var(--text-subtle)] flex items-center gap-1">
            <Flame className="w-3 h-3" />{entry.longestStreak}d best
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-[var(--text-primary)]">
          {entry.xp.toLocaleString()}
        </p>
        <p className="text-[10px] text-[var(--text-subtle)] uppercase font-medium">XP</p>
      </div>
    </motion.div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="w-8 h-5 rounded-sm bg-[var(--bg-subtle)]" />
          <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded-sm bg-[var(--bg-subtle)]" />
            <div className="h-3 w-24 rounded-sm bg-[var(--bg-subtle)]" />
          </div>
          <div className="w-12 h-6 rounded-sm bg-[var(--bg-subtle)]" />
        </div>
      ))}
    </div>
  );
}

export function LeaderboardClient() {
  const { user } = useUserAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('xp');
  const [loading, setLoading] = useState(true);
  const [liveIndicator, setLiveIndicator] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToLeaderboard(50, sortBy, (data) => {
      setEntries(data);
      setLoading(false);
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 1500);
    });

    return () => unsubscribe();
  }, [sortBy]);

  return (
    <div className="py-8 md:py-12">
      <div className="container-main max-w-3xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-4">
            <Trophy className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Leaderboard
            </span>
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${liveIndicator ? 'scale-125' : ''}`}
              style={{ background: 'var(--color-success)', opacity: liveIndicator ? 1 : 0.5 }}
            />
            <span className="text-[10px] text-[var(--text-subtle)]">Live</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Top Learners
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Realtime rankings based on problems solved, streaks, and learning activity. Sign in and solve problems to climb the board.
          </p>
        </motion.div>

        {/* Sort Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold transition-all ${
                sortBy === key
                  ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Leaderboard List */}
        <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4 md:p-6">
          {loading ? (
            <SkeletonRows />
          ) : entries.length === 0 ? (
            <div className="py-16 text-center">
              <Trophy className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-30 mb-3" />
              <p className="text-sm text-[var(--text-subtle)] mb-1">No entries yet</p>
              <p className="text-xs text-[var(--text-subtle)]">
                Sign in and start solving problems to appear on the leaderboard
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <LeaderboardRow
                  key={entry.uid}
                  entry={entry}
                  rank={i + 1}
                  index={i}
                  isCurrentUser={entry.uid === user?.uid}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-6 text-[11px] text-[var(--text-subtle)]"
          >
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              {entries.reduce((sum, e) => sum + e.dsaSolved, 0).toLocaleString()} problems solved globally
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              {Math.max(...entries.map(e => e.longestStreak))}d longest streak
            </span>
          </motion.div>
        )}

        {/* Not signed in nudge */}
        {!user && entries.length > 0 && (
          <div className="mt-6 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-center">
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              Your progress is tracked locally. Sign in to appear on the leaderboard.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
            >
              Sign in to compete
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
