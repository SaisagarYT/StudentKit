'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Flame, Trophy, Calendar, TrendingUp, Code, BookOpen,
  Target, Award, Zap, Star, CheckCircle2, BarChart3,
  Crown, Shield, Rocket, LogOut, Cloud
} from 'lucide-react';
import { getStreak, getProgressSummary, type StreakData, type ProgressSummary } from '@/lib/user-progress';
import { dsaTopicsMeta } from '@/config/placement/dsa-topics';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { pushProgressToCloud } from '@/lib/firebase/user-progress-sync';

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
}

function AnimatedRing({ value, max, size = 100, strokeWidth = 8, label, sublabel }: {
  value: number; max: number; size?: number; strokeWidth?: number; label: string; sublabel: string;
}) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = max > 0 ? Math.min(value / max, 1) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  const offset = circumference - animated * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--border-soft)" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--accent-primary)" strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[var(--text-primary)]">{value}</span>
          <span className="text-[9px] text-[var(--text-subtle)] font-medium">{sublabel}</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">{label}</span>
    </div>
  );
}

function HeatmapGrid({ streak }: { streak: StreakData }) {
  const weeks = 12;
  const days = 7;
  const today = new Date();
  const cells: { date: string; level: number }[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < days; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().split('T')[0];
      const isLastActive = dateStr === streak.lastActiveDate;
      const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      const active = daysAgo < streak.current || isLastActive;
      const level = active ? (daysAgo < 3 ? 3 : daysAgo < 7 ? 2 : 1) : 0;
      cells.push({ date: dateStr, level });
    }
  }

  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: weeks }, (_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }, (_, d) => {
            const cell = cells[w * 7 + d];
            return (
              <div
                key={d}
                className="w-[10px] h-[10px] rounded-sm"
                style={{
                  background: cell.level === 3 ? 'var(--accent-primary)' :
                    cell.level === 2 ? 'var(--accent-primary)' :
                    cell.level === 1 ? 'var(--border-default)' :
                    'var(--bg-subtle)'
                }}
                title={cell.date}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = badge.icon;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      badge.earned
        ? 'border-[var(--border-soft)] bg-[var(--bg-surface)]'
        : 'border-transparent bg-[var(--bg-subtle)] opacity-50'
    }`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
        badge.earned ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-soft)]'
      }`}>
        <Icon className="w-4 h-4" style={{ color: badge.earned ? 'var(--accent-dark)' : 'var(--text-subtle)' }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold ${badge.earned ? 'text-[var(--text-primary)]' : 'text-[var(--text-subtle)]'}`}>
          {badge.title}
        </p>
        <p className="text-[10px] text-[var(--text-subtle)]">{badge.description}</p>
      </div>
      {badge.earned && (
        <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--accent-dark)]" />
      )}
    </div>
  );
}

function CategoryBar({ cat, index }: { cat: DsaCategoryStats; index: number }) {
  const pct = cat.total > 0 ? (cat.solved / cat.total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium text-[var(--text-secondary)] w-28 truncate">{cat.title}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-[var(--text-primary)] w-8 text-right">{cat.solved}/{cat.total}</span>
    </div>
  );
}

export function ProfileDashboard() {
  const { user: authUser, signOut } = useUserAuth();
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
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
    Object.keys(dsaProgress).forEach(slug => {
      const matching = dsaTopicsMeta.find(t =>
        slug.includes(t.id.split('-')[0])
      );
      const catId = matching?.id || 'arrays-hashing';
      if (!slugsByCategory[catId]) slugsByCategory[catId] = [];
      slugsByCategory[catId].push(slug);
    });

    return dsaTopicsMeta.map(topic => {
      const slugs = slugsByCategory[topic.id] || [];
      const solved = slugs.filter(s => dsaProgress[s]).length;
      return { id: topic.id, title: topic.title, solved, total: slugs.length || 0 };
    });
  }, [dsaProgress]);

  const badges: Badge[] = useMemo(() => [
    { id: 'first-solve', title: 'First Blood', description: 'Solve your first problem', icon: Zap, earned: dsaSolved >= 1 },
    { id: 'ten-solved', title: 'Getting Serious', description: 'Solve 10 problems', icon: Code, earned: dsaSolved >= 10 },
    { id: 'fifty-solved', title: 'Half Century', description: 'Solve 50 problems', icon: Target, earned: dsaSolved >= 50 },
    { id: 'hundred-solved', title: 'Centurion', description: 'Solve 100 problems', icon: Crown, earned: dsaSolved >= 100 },
    { id: 'streak-3', title: 'Consistent', description: '3-day streak', icon: Flame, earned: streak.longest >= 3 },
    { id: 'streak-7', title: 'Week Warrior', description: '7-day streak', icon: Flame, earned: streak.longest >= 7 },
    { id: 'streak-30', title: 'Monthly Master', description: '30-day streak', icon: Star, earned: streak.longest >= 30 },
    { id: 'roadmap-done', title: 'Pathfinder', description: 'Complete a roadmap', icon: Rocket, earned: progress.roadmapsCompleted >= 1 },
    { id: 'cs-10', title: 'CS Scholar', description: 'Complete 10 CS topics', icon: Shield, earned: csSolved >= 10 },
    { id: 'all-rounder', title: 'All-Rounder', description: 'Solve in 5+ categories', icon: Award, earned: categoryStats.filter(c => c.solved > 0).length >= 5 },
  ], [dsaSolved, csSolved, streak, progress, categoryStats]);

  const earnedCount = badges.filter(b => b.earned).length;
  const level = dsaSolved >= 100 ? 'Master' : dsaSolved >= 50 ? 'Expert' : dsaSolved >= 25 ? 'Intermediate' : dsaSolved >= 5 ? 'Beginner' : 'Newbie';
  const xp = dsaSolved * 10 + csSolved * 5 + streak.totalActiveDays * 3 + progress.totalTopicsCompleted * 8;

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container-main max-w-5xl">

        {/* Hero */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Avatar */}
            {authUser?.photoURL ? (
              <img src={authUser.photoURL} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center shrink-0">
                {authUser ? (
                  <span className="text-xl font-bold text-[var(--accent-dark)]">
                    {(authUser.displayName || authUser.email || 'U')[0].toUpperCase()}
                  </span>
                ) : (
                  <Trophy className="w-7 h-7 text-[var(--accent-dark)]" />
                )}
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  {authUser?.displayName || 'Your Progress'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--accent-primary)] text-[var(--accent-dark)]">
                  {level}
                </span>
              </div>
              <p className="text-sm text-[var(--text-subtle)]">
                {xp.toLocaleString()} XP · {earnedCount} badge{earnedCount !== 1 ? 's' : ''} earned
              </p>

              {/* XP bar */}
              <div className="mt-3 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Next level</span>
                  <span className="text-[9px] font-bold text-[var(--text-primary)]">{xp % 500}/500</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent-dark)] transition-all duration-1000"
                    style={{ width: `${(xp % 500) / 5}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick numbers */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">{streak.current}</p>
                <p className="text-[9px] text-[var(--text-subtle)] font-medium mt-0.5">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">{dsaSolved}</p>
                <p className="text-[9px] text-[var(--text-subtle)] font-medium mt-0.5">Solved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">{streak.totalActiveDays}</p>
                <p className="text-[9px] text-[var(--text-subtle)] font-medium mt-0.5">Active Days</p>
              </div>
            </div>
          </div>

          {/* Auth actions */}
          {authUser && (
            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-[var(--border-soft)]">
              <button
                onClick={async () => {
                  setSyncing(true);
                  await pushProgressToCloud(authUser.uid);
                  setSyncing(false);
                }}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors disabled:opacity-50"
              >
                <Cloud className="w-3.5 h-3.5" />
                {syncing ? 'Syncing...' : 'Sync Progress'}
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
              <span className="ml-auto text-[10px] text-[var(--text-subtle)]">
                {authUser.email}
              </span>
            </div>
          )}
          {!authUser && (
            <div className="mt-5 pt-5 border-t border-[var(--border-soft)]">
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
              >
                Sign in to sync progress across devices
              </a>
            </div>
          )}
        </div>

        {/* Rings Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex justify-center">
            <AnimatedRing value={dsaSolved} max={Math.max(dsaSolved, 50)} label="DSA" sublabel="solved" />
          </div>
          <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex justify-center">
            <AnimatedRing value={csSolved} max={Math.max(csSolved, 30)} label="CS Topics" sublabel="done" />
          </div>
          <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex justify-center">
            <AnimatedRing value={progress.totalTopicsCompleted} max={Math.max(progress.totalTopicsCompleted, 20)} label="Roadmaps" sublabel="topics" />
          </div>
          <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex justify-center">
            <AnimatedRing value={earnedCount} max={badges.length} label="Badges" sublabel={`of ${badges.length}`} />
          </div>
        </div>

        {/* Heatmap */}
        <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Activity</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">{streak.current} day streak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                <span className="text-xs text-[var(--text-subtle)]">Best: {streak.longest}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center py-3">
            <HeatmapGrid streak={streak} />
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-[9px] text-[var(--text-subtle)]">Less</span>
            <div className="w-[10px] h-[10px] rounded-sm bg-[var(--bg-subtle)]" />
            <div className="w-[10px] h-[10px] rounded-sm bg-[var(--border-default)]" />
            <div className="w-[10px] h-[10px] rounded-sm bg-[var(--accent-primary)]" />
            <span className="text-[9px] text-[var(--text-subtle)]">More</span>
          </div>
        </div>

        {/* Categories + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Categories */}
          <div className="lg:col-span-3 p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Category Breakdown</h2>
            </div>

            {dsaSolved > 0 ? (
              <div className="space-y-3">
                {categoryStats.filter(c => c.total > 0).map((cat, i) => (
                  <CategoryBar key={cat.id} cat={cat} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Code className="w-7 h-7 text-[var(--text-subtle)] mx-auto mb-2 opacity-30" />
                <p className="text-xs text-[var(--text-subtle)]">Solve DSA problems to see your category breakdown</p>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="lg:col-span-2 p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[var(--text-secondary)]" />
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Badges</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-dark)]">
                {earnedCount}/{badges.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {badges.sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0)).map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
