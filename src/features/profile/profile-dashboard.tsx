'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Trophy,
  Calendar,
  Target,
  Award,
  Zap,
  Star,
  CheckCircle2,
  BarChart3,
  Crown,
  Shield,
  Rocket,
  LogOut,
  Cloud,
  Share2,
  Code,
  ArrowRight,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { getStreak, getProgressSummary, type StreakData, type ProgressSummary } from '@/lib/user-progress';
import { getXpState, type XpState } from '@/lib/xp';
import { dsaTopicsMeta } from '@/config/placement/dsa-topics';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { pushProgressToCloud } from '@/lib/firebase/user-progress-sync';
import { AchievementShareModal, type AchievementData } from './achievement-share-modal';

const DSA_STORAGE_KEY = 'sk-dsa-progress';
const CS_STORAGE_KEY = 'sk-cs-progress';

interface DsaCategoryStats {
  id: string;
  title: string;
  solved: number;
  total: number;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  stat?: string;
  statLabel?: string;
  color?: string;
}

function HeatmapGrid({ streak }: { streak: StreakData }) {
  const weeks = 24;
  const days = 7;
  const today = new Date();
  const cells: { date: string; level: number; dayOfWeek: number }[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < days; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().split('T')[0];
      const isLastActive = dateStr === streak.lastActiveDate;
      const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      const active = daysAgo < streak.current || isLastActive;
      const level = active ? (daysAgo < 3 ? 3 : daysAgo < 7 ? 2 : 1) : 0;
      cells.push({ date: dateStr, level, dayOfWeek: date.getDay() });
    }
  }

  // Generate month labels
  const monthLabels: { label: string; index: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const colDate = new Date(today);
    colDate.setDate(colDate.getDate() - ((weeks - 1 - w) * 7));
    const m = colDate.getMonth();
    if (m !== lastMonth && w < weeks - 2) {
      monthLabels.push({
        label: colDate.toLocaleDateString('en-US', { month: 'short' }),
        index: w,
      });
      lastMonth = m;
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="min-w-[640px]">
        {/* Month labels */}
        <div className="flex text-[10px] text-[var(--text-subtle)] font-medium mb-1.5 pl-6">
          {Array.from({ length: weeks }, (_, w) => {
            const match = monthLabels.find((m) => m.index === w);
            return (
              <div key={w} className="flex-1 text-left">
                {match ? match.label : ''}
              </div>
            );
          })}
        </div>

        {/* Heatmap Grid with day markers */}
        <div className="flex gap-2">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between text-[9px] text-[var(--text-subtle)] font-medium h-[88px] pr-1 select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid columns */}
          <div className="flex flex-1 justify-between gap-[3px]">
            {Array.from({ length: weeks }, (_, w) => (
              <div key={w} className="flex flex-col gap-[3px] flex-1">
                {Array.from({ length: days }, (_, d) => {
                  const cell = cells[w * 7 + d];
                  return (
                    <div
                      key={d}
                      className="w-full aspect-square rounded-[2px] transition-colors"
                      style={{
                        background:
                          cell.level >= 2
                            ? 'var(--accent-dark)'
                            : cell.level === 1
                            ? 'var(--border-default)'
                            : 'var(--bg-subtle)',
                      }}
                      title={`${cell.date}${cell.level > 0 ? ' • Active day' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge, onShare }: { badge: Badge; onShare?: (badge: Badge) => void }) {
  const Icon = badge.icon;
  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
        badge.earned
          ? 'border-[var(--border-default)] bg-[var(--bg-surface)]'
          : 'border-[var(--border-soft)] bg-[var(--bg-subtle)]/40 opacity-60'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
          badge.earned
            ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
            : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)] border border-[var(--border-soft)]'
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-semibold leading-tight ${
            badge.earned ? 'text-[var(--text-primary)]' : 'text-[var(--text-subtle)]'
          }`}
        >
          {badge.title}
        </p>
        <p className="text-[10px] text-[var(--text-subtle)] truncate mt-0.5">{badge.description}</p>
      </div>
      {badge.earned && onShare && (
        <button
          type="button"
          onClick={() => onShare(badge)}
          className="shrink-0 w-7 h-7 rounded-sm flex items-center justify-center text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title="Share achievement"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
      {badge.earned && !onShare && (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[var(--color-success)]" />
      )}
    </div>
  );
}

function CategoryBar({ cat }: { cat: DsaCategoryStats }) {
  const pct = cat.total > 0 ? (cat.solved / cat.total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-[var(--text-secondary)] w-32 truncate">{cat.title}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-[var(--text-primary)] w-12 text-right tabular-nums">
        {cat.solved}/{cat.total}
      </span>
    </div>
  );
}

export function ProfileDashboard() {
  const { user: authUser, signOut } = useUserAuth();
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [shareAchievement, setShareAchievement] = useState<AchievementData | null>(null);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 });
  const [progress, setProgress] = useState<ProgressSummary>({ totalTopicsCompleted: 0, roadmapsStarted: 0, roadmapsCompleted: 0 });
  const [dsaProgress, setDsaProgress] = useState<Record<string, boolean>>({});
  const [csProgress, setCsProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
    setProgress(getProgressSummary());

    try {
      const dsa = localStorage.getItem(DSA_STORAGE_KEY);
      if (dsa) setDsaProgress(JSON.parse(dsa));
      const cs = localStorage.getItem(CS_STORAGE_KEY);
      if (cs) setCsProgress(JSON.parse(cs));
    } catch {}
  }, []);

  const dsaSolved = useMemo(() => Object.values(dsaProgress).filter(Boolean).length, [dsaProgress]);
  const csSolved = useMemo(() => Object.values(csProgress).filter(Boolean).length, [csProgress]);

  const categoryStats: DsaCategoryStats[] = useMemo(() => {
    const slugsByCategory: Record<string, string[]> = {};
    Object.keys(dsaProgress).forEach((slug) => {
      const matching = dsaTopicsMeta.find((t) => slug.includes(t.id.split('-')[0]));
      const catId = matching?.id || 'arrays-hashing';
      if (!slugsByCategory[catId]) slugsByCategory[catId] = [];
      slugsByCategory[catId].push(slug);
    });

    return dsaTopicsMeta.map((topic) => {
      const slugs = slugsByCategory[topic.id] || [];
      const solved = slugs.filter((s) => dsaProgress[s]).length;
      return { id: topic.id, title: topic.title, solved, total: slugs.length || 0 };
    });
  }, [dsaProgress]);

  const badges: Badge[] = useMemo(
    () => [
      {
        id: 'first-solve',
        title: 'First Blood',
        description: 'Solve your first problem',
        icon: Zap,
        earned: dsaSolved >= 1,
        stat: String(dsaSolved),
        statLabel: 'problems solved',
      },
      {
        id: 'ten-solved',
        title: 'Getting Serious',
        description: 'Solve 10 problems',
        icon: Code,
        earned: dsaSolved >= 10,
        stat: String(dsaSolved),
        statLabel: 'problems solved',
      },
      {
        id: 'fifty-solved',
        title: 'Half Century',
        description: 'Solve 50 problems',
        icon: Target,
        earned: dsaSolved >= 50,
        stat: String(dsaSolved),
        statLabel: 'problems solved',
      },
      {
        id: 'hundred-solved',
        title: 'Centurion',
        description: 'Solve 100 problems',
        icon: Crown,
        earned: dsaSolved >= 100,
        stat: String(dsaSolved),
        statLabel: 'problems solved',
      },
      {
        id: 'streak-3',
        title: 'Consistent',
        description: '3-day streak',
        icon: Flame,
        earned: streak.longest >= 3,
        stat: String(streak.longest),
        statLabel: 'day streak',
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: '7-day streak',
        icon: Flame,
        earned: streak.longest >= 7,
        stat: String(streak.longest),
        statLabel: 'day streak',
      },
      {
        id: 'streak-30',
        title: 'Monthly Master',
        description: '30-day streak',
        icon: Star,
        earned: streak.longest >= 30,
        stat: String(streak.longest),
        statLabel: 'day streak',
      },
      {
        id: 'roadmap-done',
        title: 'Pathfinder',
        description: 'Complete a roadmap',
        icon: Rocket,
        earned: progress.roadmapsCompleted >= 1,
        stat: String(progress.roadmapsCompleted),
        statLabel: 'roadmap completed',
      },
      {
        id: 'cs-10',
        title: 'CS Scholar',
        description: 'Complete 10 CS topics',
        icon: Shield,
        earned: csSolved >= 10,
        stat: String(csSolved),
        statLabel: 'CS topics done',
      },
      {
        id: 'all-rounder',
        title: 'All-Rounder',
        description: 'Solve in 5+ categories',
        icon: Award,
        earned: categoryStats.filter((c) => c.solved > 0).length >= 5,
        stat: String(categoryStats.filter((c) => c.solved > 0).length),
        statLabel: 'categories covered',
      },
    ],
    [dsaSolved, csSolved, streak, progress, categoryStats]
  );

  const earnedCount = badges.filter((b) => b.earned).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const xpState: XpState = useMemo(() => getXpState(), [dsaSolved, csSolved, streak, progress]);
  const level = xpState.level.title;
  const xp = xpState.totalXp;

  async function handleSync() {
    if (!authUser) return;
    setSyncing(true);
    setSyncSuccess(false);
    try {
      await pushProgressToCloud(authUser.uid, {
        displayName: authUser.displayName || '',
        photoURL: authUser.photoURL || '',
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch {
      // Handled silently
    } finally {
      setSyncing(false);
    }
  }

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="container-main max-w-5xl space-y-6">

        {/* Guest Banner if not authenticated */}
        {!authUser && (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-warning)] animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Guest Mode • Offline Progress Stored
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Your streak and completed challenges are saved on this device. Sign in to sync across devices.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shrink-0"
            >
              Sign In to Sync
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Hero Cockpit Card */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Identity & Level */}
            <div className="flex items-start gap-4 min-w-0">
              {authUser?.photoURL ? (
                <Image
                  src={authUser.photoURL}
                  alt={authUser.displayName || 'Profile'}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--border-soft)]"
                  unoptimized
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[var(--accent-dark)] text-[var(--text-inverse)] flex items-center justify-center shrink-0 shadow-xs">
                  {authUser ? (
                    <span className="text-lg font-bold">
                      {(authUser.displayName || authUser.email || 'U')[0].toUpperCase()}
                    </span>
                  ) : (
                    <Trophy className="w-6 h-6 text-[var(--text-inverse)]" />
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] truncate">
                    {authUser?.displayName || 'Student Explorer'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-dark)] text-[var(--text-inverse)]">
                    {level}
                  </span>
                  {authUser && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Cloud Sync Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
                  {authUser?.email || 'Offline local profile'} • {xp.toLocaleString()} Total XP
                </p>

                {/* Level Progress Bar */}
                <div className="mt-2.5 max-w-xs">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-medium mb-1">
                    <span>Level Progress</span>
                    <span className="text-[var(--text-primary)] font-bold tabular-nums">
                      {xpState.xpInLevel} / {xpState.xpInLevel + xpState.xpToNextLevel} XP
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700"
                      style={{ width: `${Math.max(5, xpState.levelProgress * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border-soft)]">
              <div className="p-3 rounded-lg bg-[var(--bg-subtle)]/70 border border-[var(--border-soft)] text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-[var(--accent-dark)] mb-0.5">
                  <Flame className="w-4 h-4" />
                  <span className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{streak.current}</span>
                </div>
                <p className="text-[10px] font-medium text-[var(--text-subtle)]">Day Streak</p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-subtle)]/70 border border-[var(--border-soft)] text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-[var(--accent-dark)] mb-0.5">
                  <Code className="w-4 h-4" />
                  <span className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{dsaSolved}</span>
                </div>
                <p className="text-[10px] font-medium text-[var(--text-subtle)]">Solved</p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-subtle)]/70 border border-[var(--border-soft)] text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-[var(--accent-dark)] mb-0.5">
                  <Calendar className="w-4 h-4" />
                  <span className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{streak.totalActiveDays}</span>
                </div>
                <p className="text-[10px] font-medium text-[var(--text-subtle)]">Active Days</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-[var(--border-soft)] text-xs">
            <div className="flex items-center gap-2">
              {authUser && (
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  {syncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync Progress'}
                </button>
              )}
              <Link
                href="/profile/card"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Dev Card
              </Link>
            </div>

            {authUser ? (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
              >
                Sign in to your account
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* 4 Interactive Command Cards (replaces hollow washer rings) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* DSA Practice Card */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">DSA Practice</span>
                <div className="w-7 h-7 rounded-md bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                  <Code className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">{dsaSolved}</span>
                <span className="text-xs text-[var(--text-subtle)]">solved</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700"
                  style={{ width: `${Math.min(100, (dsaSolved / 50) * 100)}%` }}
                />
              </div>
            </div>
            <Link
              href="/placement/dsa"
              className="inline-flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors pt-2 border-t border-[var(--border-soft)] group"
            >
              <span>Practice Problems</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* CS Core Topics Card */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">CS Core</span>
                <div className="w-7 h-7 rounded-md bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">{csSolved}</span>
                <span className="text-xs text-[var(--text-subtle)]">topics</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700"
                  style={{ width: `${Math.min(100, (csSolved / 30) * 100)}%` }}
                />
              </div>
            </div>
            <Link
              href="/placement"
              className="inline-flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors pt-2 border-t border-[var(--border-soft)] group"
            >
              <span>Explore CS Topics</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Roadmaps Card */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Roadmaps</span>
                <div className="w-7 h-7 rounded-md bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                  <Compass className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">{progress.totalTopicsCompleted}</span>
                <span className="text-xs text-[var(--text-subtle)]">steps completed</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700"
                  style={{ width: `${Math.min(100, (progress.totalTopicsCompleted / 25) * 100)}%` }}
                />
              </div>
            </div>
            <Link
              href="/roadmaps"
              className="inline-flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors pt-2 border-t border-[var(--border-soft)] group"
            >
              <span>View Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Badges Card */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">Skill Badges</span>
                <div className="w-7 h-7 rounded-md bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">{earnedCount}</span>
                <span className="text-xs text-[var(--text-subtle)]">of {badges.length} unlocked</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700"
                  style={{ width: `${(earnedCount / badges.length) * 100}%` }}
                />
              </div>
            </div>
            <Link
              href="/profile/card"
              className="inline-flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors pt-2 border-t border-[var(--border-soft)] group"
            >
              <span>Dev Badge Card</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Activity & Consistency Heatmap Card */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent-dark)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Activity & Daily Consistency</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                <span className="text-[var(--text-primary)] font-semibold">{streak.current} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-subtle)]">
                <Trophy className="w-3.5 h-3.5" />
                <span>Best: {streak.longest} days</span>
              </div>
            </div>
          </div>

          {/* Full Width Grid */}
          <div className="py-2">
            <HeatmapGrid streak={streak} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-soft)] text-[10px] text-[var(--text-subtle)]">
            <span>Recent 24 weeks</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--bg-subtle)]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--border-default)]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--accent-dark)]" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Badges Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Categories */}
          <div className="lg:col-span-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--accent-dark)]" />
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Category Breakdown</h2>
              </div>
              <Link
                href="/placement/dsa"
                className="text-[11px] font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors"
              >
                View all problems
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {dsaSolved > 0 ? (
              <div className="space-y-3.5">
                {categoryStats
                  .filter((c) => c.total > 0)
                  .map((cat) => (
                    <CategoryBar key={cat.id} cat={cat} />
                  ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center rounded-lg bg-[var(--bg-subtle)]/40 border border-dashed border-[var(--border-default)]">
                <Code className="w-8 h-8 text-[var(--text-subtle)] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[var(--text-primary)]">No DSA problems completed yet</p>
                <p className="text-[11px] text-[var(--text-subtle)] max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                  Solve algorithms in Arrays, Strings, or Trees to populate your skill breakdown and unlock achievement badges.
                </p>
                <Link
                  href="/placement/dsa"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                >
                  Solve First DSA Problem
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="lg:col-span-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[var(--accent-dark)]" />
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">Skill Badges</h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-dark)] text-[var(--text-inverse)] tabular-nums">
                  {earnedCount} / {badges.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {badges
                  .sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0))
                  .map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      onShare={
                        badge.earned
                          ? (b) => {
                              const Icon = b.icon;
                              setShareAchievement({
                                id: b.id,
                                title: b.title,
                                description: b.description,
                                stat: b.stat || '',
                                statLabel: b.statLabel || '',
                                icon: <Icon className="w-6 h-6 text-[var(--accent-dark)]" />,
                                color: 'var(--accent-dark)',
                              });
                            }
                          : undefined
                      }
                    />
                  ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-soft)] text-center">
              <Link
                href="/profile/card"
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors"
              >
                Open Shareable Developer Card
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {shareAchievement && (
        <AchievementShareModal
          achievement={shareAchievement}
          userName={authUser?.displayName || 'Student'}
          onClose={() => setShareAchievement(null)}
        />
      )}
    </div>
  );
}
