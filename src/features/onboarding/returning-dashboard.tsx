'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  ArrowRight,
  BookOpen,
  Code2,
  Trophy,
  Zap,
  Briefcase,
  FileText,
  Terminal,
  Cpu,
  Calculator,
  Compass,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { getStreak, getProgressSummary, type StreakData, type ProgressSummary } from '@/lib/user-progress';
import { getXpState, type XpState } from '@/lib/xp';
import { templateRoadmaps, roadmaps } from '@/config/roadmaps';
import { DailyFlashcard } from '@/features/engagement/daily-flashcard';
import { useUserAuth } from '@/lib/firebase/user-auth';

const DSA_STORAGE_KEY = 'sk-dsa-progress';

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
  const allRoadmaps = [...templateRoadmaps, ...roadmaps];

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
            const r = allRoadmaps.find((item) => item.slug === slug);
            active.push({
              slug,
              title: r?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
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

// Starter tracks to recommend when 0 tracks are started
const FEATURED_STARTER_TRACKS = [
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Web Developer',
    description: 'Master frontend, backend, PostgreSQL databases, Docker & cloud deployment end-to-end.',
    badge: 'Most Popular',
    duration: '24-28 weeks',
    topicCount: '48 topics',
    color: '#3B82F6',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'ai-engineer',
    title: 'AI / ML Engineer',
    description: 'Learn modern machine learning, deep learning, PyTorch, LLMs, and agentic AI architectures.',
    badge: 'Trending 2026',
    duration: '20-24 weeks',
    topicCount: '42 topics',
    color: '#8B5CF6',
    tags: ['Python', 'PyTorch', 'Transformers', 'RAG'],
  },
  {
    slug: 'placement-preparation',
    title: 'Campus Placement & SDE Prep',
    description: 'Crush technical campus drives with Blind 75 DSA, System Design, OS, DBMS & HR questions.',
    badge: 'High Placement Impact',
    duration: '12-16 weeks',
    topicCount: '36 topics',
    color: '#10B981',
    tags: ['DSA', 'System Design', 'Core CS', 'Interviews'],
  },
];

export function ReturningDashboard() {
  const { user } = useUserAuth();
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState<StreakData>({ current: 1, longest: 1, lastActiveDate: '', totalActiveDays: 1 });
  const [progress, setProgress] = useState<ProgressSummary>({ roadmapsStarted: 0, totalTopicsCompleted: 0, roadmapsCompleted: 0 });
  const [activeRoadmaps, setActiveRoadmaps] = useState<ActiveRoadmap[]>([]);
  const [dsaSolved, setDsaSolved] = useState(0);

  useEffect(() => {
    setMounted(true);
    setStreak(getStreak());
    setProgress(getProgressSummary());
    setActiveRoadmaps(getActiveRoadmaps());
    setDsaSolved(getDsaSolved());
  }, []);

  if (!mounted) return null;

  const xpState: XpState = getXpState();
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Developer';

  return (
    <section className="py-8 md:py-12 bg-[var(--bg-page)] min-h-[calc(100vh-4rem)]">
      <div className="container-main max-w-7xl space-y-8">
        
        {/* ========================================================= */}
        {/* 1. SAAS COMMAND HEADER */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs relative overflow-hidden">
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[var(--accent-primary)]/10 via-[var(--accent-primary)]/5 to-transparent pointer-events-none" />

          {/* User Welcome info */}
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-secondary)]">
              Your personalized engineering workspace for roadmaps, placement prep, and developer tools.
            </p>
          </div>

          {/* Right Level & Streak Widget */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 z-10">
            {/* XP Level Capsule */}
            <div className="flex-1 sm:flex-initial p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] min-w-[210px]">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-[var(--text-primary)] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                  {xpState.level.title}
                </span>
                <span className="text-[var(--text-subtle)] tabular-nums">{xpState.totalXp} XP</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--border-soft)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-dark)] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(8, xpState.levelProgress)}%` }}
                />
              </div>
              <p className="text-[10px] text-[var(--text-subtle)] mt-1.5 flex justify-between">
                <span>Tier {xpState.levelIndex + 1}</span>
                <span>{xpState.xpToNextLevel > 0 ? `${xpState.xpToNextLevel} XP to next rank` : 'Max Tier'}</span>
              </p>
            </div>

            {/* Streak Capsule */}
            <div className="flex-1 sm:flex-initial p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] min-w-[150px]">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
                  {streak.current} {streak.current === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-subtle)]">
                {streak.current > 0 ? 'Streak active today 🔥' : 'Log activity to ignite'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. CORE KPI METRICS ROW */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Card 1 */}
          <Link
            href="/roadmaps"
            className="group p-4 md:p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xl md:text-2xl font-black text-[var(--text-primary)] tabular-nums">
              {progress.totalTopicsCompleted}
            </div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">Topics Mastered</p>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">
              {activeRoadmaps.length > 0 ? `${activeRoadmaps.length} active tracks` : 'Choose a roadmap track'}
            </p>
          </Link>

          {/* Card 2 */}
          <Link
            href="/placement/dsa"
            className="group p-4 md:p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xl md:text-2xl font-black text-[var(--text-primary)] tabular-nums">
              {dsaSolved}
            </div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">DSA Problems Solved</p>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">Blind 75 & Top Tech</p>
          </Link>

          {/* Card 3 */}
          <Link
            href="/placement/resume-roaster"
            className="group p-4 md:p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xl md:text-2xl font-black text-[var(--text-primary)]">
              {dsaSolved > 0 ? `${Math.min(100, Math.round((dsaSolved / 50) * 100))}%` : 'Ready'}
            </div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">Placement Readiness</p>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">Resume & Interview Prep</p>
          </Link>

          {/* Card 4 */}
          <Link
            href="/leaderboard"
            className="group p-4 md:p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-xl md:text-2xl font-black text-[var(--text-primary)] tabular-nums">
              {xpState.totalXp} XP
            </div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">Global XP & Rank</p>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1">
              Multiplier: {xpState.streakMultiplier}x
            </p>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 3. MAIN DASHBOARD CONTENT (2-COLUMN SAAS GRID) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLS: Core Learning & Practice Track */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Tracks / Starter Track Section */}
            <div className="p-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[var(--accent-dark)]" />
                    {activeRoadmaps.length > 0 ? 'Your Learning Journey' : 'Curated Engineering Tracks'}
                  </h2>
                  <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                    {activeRoadmaps.length > 0
                      ? 'Pick up where you left off in your enrolled tracks'
                      : 'Enroll in an industry-aligned curriculum to start earning XP'}
                  </p>
                </div>
                <Link
                  href="/roadmaps"
                  className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
                >
                  All 9 tracks <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* If user has active roadmaps */}
              {activeRoadmaps.length > 0 ? (
                <div className="space-y-3">
                  {activeRoadmaps.map((track) => (
                    <Link
                      key={track.slug}
                      href={`/roadmaps/${track.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-all"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                            {track.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[var(--accent-primary)]/15 text-[var(--accent-dark)]">
                            {track.percent}% Completed
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--border-soft)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent-dark)] rounded-full transition-all"
                            style={{ width: `${Math.max(5, track.percent)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-[var(--text-subtle)]">
                          {track.completed} of {track.total} topics completed
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--accent-dark)] text-[var(--accent-primary)] text-xs font-bold hover:opacity-90 transition-opacity self-start sm:self-center">
                        Resume Track
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* High-Value Starter Tracks Grid (When 0 tracks are started) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {FEATURED_STARTER_TRACKS.map((track) => (
                    <div
                      key={track.slug}
                      className="flex flex-col justify-between p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-all space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${track.color}15`, color: track.color }}
                          >
                            {track.badge}
                          </span>
                          <span className="text-[10px] text-[var(--text-subtle)] font-medium">
                            {track.duration}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                          {track.title}
                        </h3>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {track.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {track.tags.map((t) => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-subtle)]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/roadmaps/${track.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
                      >
                        Enroll Track
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Technical Flashcard */}
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs overflow-hidden">
              <DailyFlashcard />
            </div>

          </div>

          {/* RIGHT 4 COLS: Placement & Power Tools Dock */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Career & Placement Suite */}
            <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-violet-500" />
                  Placement & Career Suite
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                  Career Ready
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/resume-builder"
                  className="group flex items-start gap-3 p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                      ATS Resume Studio & AI Roaster
                    </p>
                    <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                      Create ATS-proof resumes and roast bullets
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:translate-x-0.5 transition-all mt-1" />
                </Link>

                <Link
                  href="/placement/dsa"
                  className="group flex items-start gap-3 p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                      DSA Practice Sheet
                    </p>
                    <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                      Curated Blind 75 and topic-wise problems
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:translate-x-0.5 transition-all mt-1" />
                </Link>

                <Link
                  href="/placement/cs-fundamentals"
                  className="group flex items-start gap-3 p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                      Core CS Fundamentals
                    </p>
                    <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                      OS, DBMS, Computer Networks & OOPs
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:translate-x-0.5 transition-all mt-1" />
                </Link>
              </div>
            </div>

            {/* Student Power Tools Dock */}
            <div className="p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5 text-blue-500" />
                  Power Tools Dock
                </h2>
                <Link href="/tools" className="text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  All tools →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/tools/cgpa-calculator"
                  className="p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors space-y-1"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">CGPA & SGPA Suite</p>
                  <p className="text-[10px] text-[var(--text-subtle)]">Grades & %</p>
                </Link>

                <Link
                  href="/tools/ctc-to-inhand-calculator"
                  className="p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors space-y-1"
                >
                  <Calculator className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">CTC In-Hand Hub</p>
                  <p className="text-[10px] text-[var(--text-subtle)]">Salary breakdown</p>
                </Link>

                <Link
                  href="/tools/image-resizer"
                  className="p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors space-y-1"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">Exam Photo Studio</p>
                  <p className="text-[10px] text-[var(--text-subtle)]">UPSC/GATE 10-20KB</p>
                </Link>

                <Link
                  href="/tools/readme-generator"
                  className="p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors space-y-1"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">README Builder</p>
                  <p className="text-[10px] text-[var(--text-subtle)]">GitHub projects</p>
                </Link>
              </div>
            </div>

            {/* Campus Ranking & Community */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">Campus Leaderboard</p>
                  <p className="text-[10px] text-[var(--text-subtle)]">Compete with peers across India</p>
                </div>
              </div>
              <Link
                href="/leaderboard"
                className="px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
              >
                View Ranks
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
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
