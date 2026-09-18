'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  Trophy, Clock, Flame, Zap, Target, ChevronRight,
  Play, Pause, CheckCircle2, Timer, Calendar, TrendingUp
} from 'lucide-react';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { dsaProblemRepository } from '@/lib/cms/repository';
import type { DsaProblemListItem } from '@/lib/cms/types';

const DAILY_KEY = 'sk-daily-challenge';
const DAILY_HISTORY_KEY = 'sk-daily-history';

interface DailyChallengeProgress {
  dayId: string;
  startedAt: string;
  completed: boolean;
  timerSeconds: number;
  hintsUsed: number;
  finishedAt?: string;
}

interface DailyHistory {
  dayId: string;
  time: number;
  hintsUsed: number;
  finishedAt: string;
}

interface DailyProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  description: string;
  hints: string[];
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
}

function getDayId(): string {
  return new Date().toISOString().split('T')[0];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function loadProgress(): DailyChallengeProgress | null {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProgress(progress: DailyChallengeProgress) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(progress));
}

function loadHistory(): DailyHistory[] {
  try {
    return JSON.parse(localStorage.getItem(DAILY_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history: DailyHistory[]) {
  localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
}

const DIFFICULTY_STYLE: Record<string, { label: string; cls: string }> = {
  easy:   { label: 'Easy',   cls: 'text-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]' },
  medium: { label: 'Medium', cls: 'text-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]' },
  hard:   { label: 'Hard',   cls: 'text-[var(--color-error)]   bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]' },
};

export function DailyChallengeClient() {
  const [mounted, setMounted] = useState(false);
  const [backendProblems, setBackendProblems] = useState<DsaProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<DailyChallengeProgress | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showApproach, setShowApproach] = useState(false);
  const [history, setHistory] = useState<DailyHistory[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dayId = getDayId();

  useEffect(() => {
    setMounted(true);
    setHistory(loadHistory());

    const saved = loadProgress();
    if (saved && saved.dayId === dayId) {
      setProgress(saved);
      setElapsed(saved.timerSeconds);
      setRevealedHints(saved.hintsUsed);
    }

    dsaProblemRepository
      .listPublished()
      .then((items) => {
        setBackendProblems(items);
        setLoading(false);
      })
      .catch(() => {
        setBackendProblems([]);
        setLoading(false);
      });
  }, [dayId]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (progress) {
            saveChallengeProgress({ ...progress, timerSeconds: next });
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, progress]);

  function saveChallengeProgress(p: DailyChallengeProgress) {
    saveProgress(p);
    setProgress(p);
  }

  const startChallenge = useCallback(() => {
    const newProgress: DailyChallengeProgress = {
      dayId,
      startedAt: new Date().toISOString(),
      completed: false,
      timerSeconds: 0,
      hintsUsed: 0,
    };
    saveChallengeProgress(newProgress);
    setElapsed(0);
    setRevealedHints(0);
    setShowApproach(false);
    setTimerRunning(true);
  }, [dayId]);

  const markComplete = useCallback(() => {
    if (!progress) return;
    setTimerRunning(false);
    const updated: DailyChallengeProgress = {
      ...progress,
      completed: true,
      timerSeconds: elapsed,
      finishedAt: new Date().toISOString(),
    };
    saveChallengeProgress(updated);

    const entry: DailyHistory = {
      dayId: progress.dayId,
      time: elapsed,
      hintsUsed: revealedHints,
      finishedAt: new Date().toISOString(),
    };
    const hist = [entry, ...loadHistory().filter((h) => h.dayId !== progress.dayId)].slice(0, 30);
    saveHistory(hist);
    setHistory(hist);
    emitProgressChanged();
  }, [progress, elapsed, revealedHints]);

  const problem: DailyProblem | null = useMemo(() => {
    if (backendProblems.length === 0) return null;
    const seed = dayId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rawProblem = backendProblems[seed % backendProblems.length];
    return {
      id: rawProblem.id,
      title: rawProblem.title,
      difficulty: (rawProblem.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
      category: (rawProblem.category || 'algorithms').replace(/-/g, ' '),
      description:
        rawProblem.description ||
        `Practice ${rawProblem.title} to improve algorithmic problem solving and interview performance.`,
      hints:
        rawProblem.hints && rawProblem.hints.length > 0
          ? rawProblem.hints
          : ['Analyze input constraints and bounds.', 'Consider space vs time tradeoffs.'],
      approach:
        rawProblem.editorial ||
        rawProblem.approach ||
        'Detailed editorial and step-by-step approach available in the DSA Practice Sheet.',
      timeComplexity: rawProblem.timeComplexity || 'O(n)',
      spaceComplexity: rawProblem.spaceComplexity || 'O(1)',
    };
  }, [backendProblems, dayId]);

  const revealNextHint = useCallback(() => {
    if (!problem || revealedHints >= problem.hints.length) return;
    const next = revealedHints + 1;
    setRevealedHints(next);
    if (progress) {
      saveChallengeProgress({ ...progress, hintsUsed: next });
    }
  }, [revealedHints, problem, progress]);

  if (!mounted || loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="py-8 md:py-12">
        <div className="container-main max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-4">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Daily Challenge
              </span>
              <span className="text-[10px] text-[var(--text-subtle)]">{dayId}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Problem of the Day
            </h1>
          </motion.div>

          <div className="rounded-sm border border-dashed border-[var(--border-soft)] bg-[var(--bg-surface)] p-12 text-center my-6">
            <Zap className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-40 mb-3" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              No Daily Challenges Published Yet
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-md mx-auto leading-relaxed">
              Daily challenges and timed sprints will automatically unlock here once algorithm practice problems are published in the Admin Dashboard.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/roadmaps"
                className="px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
              >
                Explore Roadmaps
              </Link>
              <Link
                href="/placement/cs-fundamentals"
                className="px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)] hover:bg-[var(--border-soft)] transition-colors"
              >
                CS Fundamentals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isFinished = progress?.completed || false;
  const streakDays = history.length;
  const diffStyle = DIFFICULTY_STYLE[problem.difficulty] || DIFFICULTY_STYLE.easy;

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
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Daily Challenge
            </span>
            <span className="text-[10px] text-[var(--text-subtle)]">{dayId}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Problem of the Day
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            One problem every day. Solve it, track your time, build consistency. New problem at midnight.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-center gap-6 mb-8"
        >
          <div className="flex items-center gap-1.5 text-sm">
            <Flame className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
            <span className="font-semibold text-[var(--text-primary)]">{streakDays}</span>
            <span className="text-[var(--text-subtle)] text-xs">solved</span>
          </div>
          {history.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-[var(--text-subtle)]" />
              <span className="font-semibold text-[var(--text-primary)]">
                {formatTime(Math.round(history.reduce((a, h) => a + h.time, 0) / history.length))}
              </span>
              <span className="text-[var(--text-subtle)] text-xs">avg</span>
            </div>
          )}
        </motion.div>

        {/* Problem Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden mb-6"
        >
          {/* Problem header */}
          <div className="p-5 border-b border-[var(--border-soft)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{problem.title}</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold ${diffStyle.cls}`}>
                    {diffStyle.label}
                  </span>
                  <span className="text-[11px] text-[var(--text-subtle)] capitalize">{problem.category}</span>
                </div>
              </div>
              {isFinished && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Done</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-5 border-b border-[var(--border-soft)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Timer & Controls */}
          <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--bg-subtle)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="text-3xl font-bold font-mono text-[var(--text-primary)]">
                  {formatTime(elapsed)}
                </span>
                {timerRunning && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {!progress && (
                  <button
                    onClick={startChallenge}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Timer
                  </button>
                )}

                {progress && !isFinished && (
                  <>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors"
                    >
                      {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {timerRunning ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={markComplete}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--color-success)] text-white hover:opacity-90 transition-opacity"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Solved
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Hints & Approach */}
          {progress && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Hints ({revealedHints}/{problem.hints.length})
                </span>
                {revealedHints < problem.hints.length && !isFinished && (
                  <button
                    onClick={revealNextHint}
                    className="text-xs text-[var(--accent-dark)] hover:underline flex items-center gap-1"
                  >
                    Reveal Hint #{revealedHints + 1}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Revealed hints */}
              <AnimatePresence>
                {revealedHints > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    {problem.hints.slice(0, revealedHints).map((hint, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-start gap-2.5"
                      >
                        <span className="text-[10px] font-bold text-[var(--accent-dark)] mt-0.5 shrink-0">#{i + 1}</span>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{hint}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Approach */}
              {(isFinished || revealedHints === problem.hints.length) && (
                <div className="pt-3 border-t border-[var(--border-soft)]">
                  <button
                    onClick={() => setShowApproach(!showApproach)}
                    className="text-[11px] font-semibold text-[var(--text-primary)] hover:underline mb-2"
                  >
                    {showApproach ? 'Hide Approach' : 'Show Full Approach'}
                  </button>
                  <AnimatePresence>
                    {showApproach && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-3"
                      >
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                          {problem.approach}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                            <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
                            {problem.timeComplexity}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                            <Target className="w-3 h-3 text-[var(--text-subtle)]" />
                            {problem.spaceComplexity}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Completion card */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 text-center mb-6"
            >
              <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-warning)' }} />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Solved!</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Completed in <strong>{formatTime(elapsed)}</strong> with {revealedHints} hint{revealedHints !== 1 ? 's' : ''} used
              </p>
              <p className="text-xs text-[var(--text-subtle)] mt-2">Come back tomorrow for a new problem</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Solves</h3>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map((h) => (
                <div key={h.dayId} className="flex items-center justify-between py-2 border-b border-[var(--border-soft)] last:border-0">
                  <span className="text-xs font-medium text-[var(--text-primary)]">{h.dayId}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[var(--text-subtle)]">{h.hintsUsed} hints</span>
                    <span className="text-[11px] font-mono font-semibold text-[var(--text-primary)]">{formatTime(h.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
