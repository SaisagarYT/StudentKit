'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trophy, Flame, Code, Brain, TrendingUp, Crown, Medal, Award, GraduationCap, Users, School } from 'lucide-react';
import {
  subscribeToLeaderboard,
  type LeaderboardEntry,
  DEFAULT_LEADERBOARD_ENTRIES,
  getCampusRankings,
  type CampusLeaderboardEntry,
} from '@/lib/firebase/leaderboard';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { isFirebaseConfigured } from '@/lib/firebase/client';

type SortField = 'xp' | 'dsaSolved' | 'streak';
type LeaderboardTab = 'individuals' | 'campus';

const SORT_OPTIONS: { key: SortField; label: string; icon: React.ElementType }[] = [
  { key: 'xp', label: 'XP', icon: TrendingUp },
  { key: 'dsaSolved', label: 'Problems', icon: Code },
  { key: 'streak', label: 'Streak', icon: Flame },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return (
    <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[var(--text-subtle)]">
      {rank}
    </span>
  );
}

function LeaderboardRow({ entry, rank, isCurrentUser }: { entry: LeaderboardEntry; rank: number; isCurrentUser: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-sm transition-all ${
        isCurrentUser
          ? 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30'
          : 'hover:bg-[var(--bg-subtle)]'
      } ${rank <= 3 ? 'border border-[var(--border-soft)]' : ''}`}
    >
      <div className="w-8 flex justify-center shrink-0">
        <RankBadge rank={rank} />
      </div>

      <div className="shrink-0">
        {entry.photoURL ? (
          <img src={entry.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--accent-dark)]">
              {entry.displayName[0]?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {entry.displayName}
            {isCurrentUser && <span className="ml-2 text-[10px] font-medium text-[var(--accent-dark)]">YOU</span>}
          </p>
          {entry.college && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-soft)]">
              {entry.college}
            </span>
          )}
        </div>
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
    </div>
  );
}

function CampusLeaderboardRow({ campus, rank }: { campus: CampusLeaderboardEntry; rank: number }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-sm transition-all hover:bg-[var(--bg-subtle)] ${
        rank <= 3 ? 'border border-[var(--border-soft)]' : ''
      }`}
    >
      <div className="w-8 flex justify-center shrink-0">
        <RankBadge rank={rank} />
      </div>

      <div className="w-10 h-10 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 text-[var(--accent-primary)]">
        <School className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">
          {campus.college}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--text-subtle)]">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {campus.activeCoders} active {campus.activeCoders === 1 ? 'coder' : 'coders'}
          </span>
          <span className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            {campus.totalSolved} solved
          </span>
          <span className="hidden sm:inline">
            Top: <strong className="text-[var(--text-primary)]">{campus.topPerformer}</strong>
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-[var(--text-primary)]">
          {campus.totalXp.toLocaleString()}
        </p>
        <p className="text-[10px] text-[var(--text-subtle)] uppercase font-medium">CAMPUS XP</p>
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }, (_, i) => (
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
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('individuals');
  const [sortBy, setSortBy] = useState<SortField>('xp');
  const [loading, setLoading] = useState(true);
  const [liveIndicator, setLiveIndicator] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setEntries(DEFAULT_LEADERBOARD_ENTRIES);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToLeaderboard(50, sortBy, (data) => {
      if (data && data.length > 0) {
        setEntries(data);
      } else {
        setEntries(DEFAULT_LEADERBOARD_ENTRIES);
      }
      setLoading(false);
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 1500);
    });

    return () => unsubscribe();
  }, [sortBy]);

  const campusRankings = useMemo(() => getCampusRankings(entries), [entries]);

  return (
    <div className="py-8 md:py-12">
      <div className="container-main max-w-3xl">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-4">
            <Trophy className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Leaderboard & Campus Wars
            </span>
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${liveIndicator ? 'bg-green-500 scale-125' : 'bg-green-500/50'}`} />
            <span className="text-[10px] text-[var(--text-subtle)]">Live</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Top Learners & Campus Rankings
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Realtime rankings based on problems solved, streaks, and learning activity. Represent your college and climb the board.
          </p>

          {/* Mode Switcher */}
          <div className="mt-6 inline-flex p-1 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] gap-1">
            <button
              onClick={() => setActiveTab('individuals')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                activeTab === 'individuals'
                  ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Individual Coders
            </button>
            <button
              onClick={() => setActiveTab('campus')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                activeTab === 'campus'
                  ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              College / Campus War
            </button>
          </div>
        </div>

        {/* Sort Tabs for Individual View */}
        {activeTab === 'individuals' && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold transition-all ${
                  sortBy === key
                    ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Leaderboard List */}
        <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4 md:p-6">
          {loading ? (
            <SkeletonRows />
          ) : entries.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="w-10 h-10 mx-auto text-[var(--text-subtle)] mb-3 opacity-40" />
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {activeTab === 'individuals' ? 'No learners on the leaderboard yet' : 'No campus rankings yet'}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                Start solving DSA problems or complete roadmap topics to claim the #1 spot!
              </p>
            </div>
          ) : activeTab === 'individuals' ? (
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <LeaderboardRow
                  key={entry.uid}
                  entry={entry}
                  rank={i + 1}
                  isCurrentUser={entry.uid === user?.uid}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {campusRankings.map((campus, i) => (
                <CampusLeaderboardRow
                  key={campus.college}
                  campus={campus}
                  rank={i + 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {entries.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-[var(--text-subtle)]">
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              {entries.reduce((sum, e) => sum + e.dsaSolved, 0).toLocaleString()} problems solved globally
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              {Math.max(...entries.map(e => e.longestStreak))}d longest streak
            </span>
          </div>
        )}

        {/* Not signed in nudge */}
        {!user && entries.length > 0 && (
          <div className="mt-6 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-center">
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              Your progress is tracked locally. Sign in to appear on the leaderboard.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
            >
              Sign in to compete
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
