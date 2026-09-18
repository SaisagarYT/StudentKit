'use client';

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { getStreak, getProgressSummary, type StreakData, type ProgressSummary } from '@/lib/user-progress';
import { getXpState, type XpState } from '@/lib/xp';
import { fetchAllRoadmaps } from '@/lib/firebase/roadmaps';

import { DashboardHeader } from './components/dashboard-header';
import { DailySprintBar } from './components/daily-sprint-bar';
import { ActiveRoadmapHero } from './components/active-roadmap-hero';
import { DsaPatternRadar } from './components/dsa-pattern-radar';
import { ActivityHeatmap } from './components/activity-heatmap';
import { DailyChallengeWidget } from './components/daily-challenge-widget';
import { LeaderboardWidget } from './components/leaderboard-widget';

const DSA_STORAGE_KEY = 'sk-dsa-progress';

export interface ActiveRoadmap {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
}

function getActiveRoadmaps(backendRoadmaps: { slug: string; title: string }[] = []): ActiveRoadmap[] {
  if (typeof window === 'undefined') return [];
  const active: ActiveRoadmap[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('roadmap-progress-')) {
        const slug = key.replace('roadmap-progress-', '');
        const raw = localStorage.getItem(key);
        if (raw) {
          const progress: Record<string, boolean> = JSON.parse(raw);
          const completed = Object.values(progress).filter(Boolean).length;
          const total = Object.keys(progress).length;
          if (completed > 0 && total > 0) {
            const roadmap = backendRoadmaps.find((r) => r.slug === slug);
            const fallbackTitle = slug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            active.push({
              slug,
              title: roadmap?.title || fallbackTitle,
              completed,
              total,
              percent: Math.round((completed / total) * 100),
            });
          }
        }
      }
    }
  } catch {}

  return active.sort((a, b) => b.percent - a.percent);
}

function getDsaSolved(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(DSA_STORAGE_KEY);
    if (!raw) return 0;
    const data: Record<string, boolean> = JSON.parse(raw);
    return Object.values(data).filter(Boolean).length;
  } catch {
    return 0;
  }
}

export function ReturningDashboard() {
  const { user } = useUserAuth();
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 });
  const [progress, setProgress] = useState<ProgressSummary>({ totalTopicsCompleted: 0, roadmapsStarted: 0, roadmapsCompleted: 0 });
  const [activeRoadmaps, setActiveRoadmaps] = useState<ActiveRoadmap[]>([]);
  const [dsaSolved, setDsaSolved] = useState(0);
  const [xpState, setXpState] = useState<XpState>(getXpState());

  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
    setProgress(getProgressSummary());
    setDsaSolved(getDsaSolved());
    setXpState(getXpState());

    // Initially populate from local storage with formatted slugs
    setActiveRoadmaps(getActiveRoadmaps([]));

    // Refine with backend roadmap titles when loaded
    fetchAllRoadmaps()
      .then((backendRoadmaps) => {
        setActiveRoadmaps(getActiveRoadmaps(backendRoadmaps));
      })
      .catch(() => {});
  }, []);

  if (!mounted) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const isDsaSolvedToday = streak.lastActiveDate === todayStr && dsaSolved > 0;
  const isRoadmapDoneToday = streak.lastActiveDate === todayStr && progress.totalTopicsCompleted > 0;
  const isProjectDoneToday = streak.lastActiveDate === todayStr;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1. Cockpit Header with User profile, Streak & XP Level */}
        <DashboardHeader user={user} streak={streak} xpState={xpState} />

        {/* 2. Interactive Daily Sprint Goal Checklist */}
        <DailySprintBar
          dsaSolvedToday={isDsaSolvedToday}
          roadmapTopicDoneToday={isRoadmapDoneToday}
          projectTaskDoneToday={isProjectDoneToday}
        />

        {/* 3. Main Dashboard 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Roadmap Engine, DSA Radar & Activity Heatmap */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Roadmap with Next Lesson CTA */}
            <ActiveRoadmapHero activeRoadmaps={activeRoadmaps} />

            {/* Placement Readiness & Algorithmic Pattern Radar */}
            <DsaPatternRadar dsaSolved={dsaSolved} />

            {/* GitHub-style 60-Day Activity Heatmap */}
            <ActivityHeatmap
              totalActiveDays={streak.totalActiveDays}
              currentStreak={streak.current}
            />
          </div>

          {/* Right Column (4 cols): Problem of the Day & Leaderboard */}
          <div className="lg:col-span-4 space-y-6">
            {/* Daily Challenge Spotlight */}
            <DailyChallengeWidget isSolved={isDsaSolvedToday} />

            {/* Community Leaderboard Preview & Fast Links */}
            <LeaderboardWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

export function hasExistingProgress(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const streak = getStreak();
    const progress = getProgressSummary();
    return streak.totalActiveDays > 0 || progress.totalTopicsCompleted > 0;
  } catch {
    return false;
  }
}
