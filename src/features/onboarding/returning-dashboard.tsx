'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  ArrowRight,
  BookOpen,
  Code,
  Target,
  Trophy,
  Zap,
  Calendar,
} from 'lucide-react';
import { getStreak, getProgressSummary, type StreakData, type ProgressSummary } from '@/lib/user-progress';
import { getXpState, type XpState } from '@/lib/xp';
import { roadmaps } from '@/config/roadmaps';
import { cn } from '@/lib/utils';

const ONBOARDING_KEY = 'sk-onboarding';
const DSA_STORAGE_KEY = 'sk-dsa-progress';

interface OnboardingData {
  goal: string;
  level: string;
  startedAt: string;
}

interface ActiveRoadmap {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
}

function getActiveRoadmaps(): ActiveRoadmap[] {
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
            const roadmap = roadmaps.find((r) => r.slug === slug);
            active.push({
              slug,
              title: roadmap?.title || slug.replace(/-/g, ' '),
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

function StatCard({ icon: Icon, value, label, color }: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
      <div
        className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-bold text-[var(--text-primary)] leading-tight tabular-nums">{value}</p>
        <p className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

function RoadmapProgress({ roadmap }: { roadmap: ActiveRoadmap }) {
  return (
    <Link
      href={`/roadmaps/view?slug=${roadmap.slug}`}
      className="group flex items-center gap-4 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate capitalize">
          {roadmap.title}
        </p>
        <p className="text-[11px] text-[var(--text-subtle)] mt-0.5 tabular-nums">
          {roadmap.completed}/{roadmap.total} topics completed
        </p>
        <div className="mt-2.5 h-1 rounded-sm bg-[var(--bg-subtle)] overflow-hidden">
          <div
            className="h-full rounded-sm bg-[var(--accent-dark)] transition-all duration-500"
            style={{ width: `${roadmap.percent}%` }}
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-base font-bold text-[var(--accent-dark)] tabular-nums">{roadmap.percent}%</span>
        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] group-hover:text-[var(--accent-dark)] group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

export function ReturningDashboard() {
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 });
  const [progress, setProgress] = useState<ProgressSummary>({ totalTopicsCompleted: 0, roadmapsStarted: 0, roadmapsCompleted: 0 });
  const [activeRoadmaps, setActiveRoadmaps] = useState<ActiveRoadmap[]>([]);
  const [dsaSolved, setDsaSolved] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
    setProgress(getProgressSummary());
    setActiveRoadmaps(getActiveRoadmaps());
    setDsaSolved(getDsaSolved());

    try {
      const raw = localStorage.getItem(ONBOARDING_KEY);
      if (raw) {
        const data: OnboardingData = JSON.parse(raw);
        setGoal(data.goal);
      }
    } catch {}
  }, []);

  if (!mounted) return null;

  const primaryRoadmap = activeRoadmaps[0];
  const todaySuggestions = getSuggestions(activeRoadmaps, dsaSolved, goal);
  const xpState: XpState = getXpState();

  return (
    <section className="py-10 md:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {primaryRoadmap
                ? `Continue your ${primaryRoadmap.title} journey`
                : 'Pick up where you left off'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)]">
              <Zap className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
              <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{xpState.totalXp} XP</span>
              <span className="text-[10px] font-medium text-[var(--text-subtle)] uppercase">{xpState.level.title}</span>
            </div>
            {streak.current > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)]">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{streak.current}-day streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          <StatCard icon={BookOpen} value={progress.totalTopicsCompleted} label="Topics learned" color="#3B82F6" />
          <StatCard icon={Code} value={dsaSolved} label="Problems solved" color="#10B981" />
          <StatCard icon={Target} value={progress.roadmapsStarted} label="Paths started" color="#8B5CF6" />
          <StatCard icon={Calendar} value={streak.totalActiveDays} label="Active days" color="#F59E0B" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: Continue Learning */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
                Continue Learning
              </h2>
              <Link href="/roadmaps" className="text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--accent-dark)] transition-colors">
                All paths &rarr;
              </Link>
            </div>

            {activeRoadmaps.length > 0 ? (
              <div className="space-y-2">
                {activeRoadmaps.slice(0, 3).map((r) => (
                  <RoadmapProgress key={r.slug} roadmap={r} />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-center">
                <BookOpen className="w-7 h-7 mx-auto text-[var(--text-subtle)] mb-3" />
                <p className="text-sm font-medium text-[var(--text-primary)]">No paths started yet</p>
                <p className="text-xs text-[var(--text-subtle)] mt-1">Choose a learning path to begin your journey</p>
                <Link
                  href="/start"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-sm hover:opacity-90 transition-opacity"
                >
                  Choose a path
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar: Today's Suggestions */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
              Suggested for today
            </h2>

            <div className="space-y-2">
              {todaySuggestions.map((suggestion, i) => (
                <Link
                  key={i}
                  href={suggestion.href}
                  className="group flex items-start gap-3 p-3 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${suggestion.color}12` }}
                  >
                    <suggestion.icon className="w-3.5 h-3.5" style={{ color: suggestion.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                      {suggestion.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                      {suggestion.detail}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="pt-3 border-t border-[var(--border-soft)]">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/challenges"
                  className="flex items-center gap-2 p-2.5 rounded-sm text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Challenges
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex items-center gap-2 p-2.5 rounded-sm text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                  Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface Suggestion {
  title: string;
  detail: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

function getSuggestions(activeRoadmaps: ActiveRoadmap[], dsaSolved: number, goal: string | null): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (activeRoadmaps.length > 0) {
    const top = activeRoadmaps[0];
    suggestions.push({
      title: `Continue ${top.title}`,
      detail: `${top.percent}% complete — keep going!`,
      href: `/roadmaps/view?slug=${top.slug}`,
      icon: BookOpen,
      color: '#3B82F6',
    });
  }

  suggestions.push({
    title: 'Solve a DSA problem',
    detail: dsaSolved > 0 ? `${dsaSolved} solved so far` : 'Build your problem-solving skills',
    href: '/placement/dsa',
    icon: Code,
    color: '#10B981',
  });

  if (activeRoadmaps.length > 0) {
    suggestions.push({
      title: 'Build a project',
      detail: 'Apply what you learned',
      href: '/projects',
      icon: Target,
      color: '#8B5CF6',
    });
  }

  if (goal && !activeRoadmaps.some((r) => r.slug === goal)) {
    suggestions.push({
      title: 'Start your chosen path',
      detail: goal.replace(/-/g, ' '),
      href: `/roadmaps/view?slug=${goal}`,
      icon: Zap,
      color: '#F59E0B',
    });
  }

  if (suggestions.length < 3) {
    suggestions.push({
      title: 'Explore open source',
      detail: 'Study real-world codebases',
      href: '/open-source',
      icon: Code,
      color: '#06B6D4',
    });
  }

  return suggestions.slice(0, 4);
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
