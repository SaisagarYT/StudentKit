'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  Trophy, Clock, Zap, Target, ChevronRight,
  Play, Pause, RotateCcw, CheckCircle2, Timer
} from 'lucide-react';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { dsaProblemRepository } from '@/lib/cms/repository';
import type { DsaProblemListItem } from '@/lib/cms/types';

const CHALLENGE_KEY = 'sk-weekly-challenge';
const CHALLENGE_HISTORY_KEY = 'sk-challenge-history';

interface ChallengeProgress {
  weekId: string;
  startedAt: string;
  completedProblems: string[];
  timerSeconds: number;
  finished: boolean;
  finishedAt?: string;
}

interface ChallengeHistory {
  weekId: string;
  completedCount: number;
  totalTime: number;
  finishedAt: string;
}

interface ChallengeProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hint: string;
}

function getWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function loadChallengeProgress(): ChallengeProgress | null {
  try {
    const raw = localStorage.getItem(CHALLENGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveChallengeProgress(progress: ChallengeProgress) {
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
}

function loadHistory(): ChallengeHistory[] {
  try {
    return JSON.parse(localStorage.getItem(CHALLENGE_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history: ChallengeHistory[]) {
  localStorage.setItem(CHALLENGE_HISTORY_KEY, JSON.stringify(history));
}

const DIFFICULTY_STYLE: Record<string, string> = {
  easy:   'text-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]',
  medium: 'text-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]',
  hard:   'text-[var(--color-error)]   bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]',
};

export function WeeklyChallengeClient() {
  const [mounted, setMounted] = useState(false);
  const [backendProblems, setBackendProblems] = useState<DsaProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [history, setHistory] = useState<ChallengeHistory[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const weekId = getWeekId();

  useEffect(() => {
    setMounted(true);
    setHistory(loadHistory());

    const saved = loadChallengeProgress();
    if (saved && saved.weekId === weekId) {
      setProgress(saved);
      setElapsed(saved.timerSeconds);
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
  }, [weekId]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (progress) {
            const updated = { ...progress, timerSeconds: next };
            saveChallengeProgress(updated);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, progress]);

  // Derive weekly sprint problems from database
  const seed = weekId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const problemCount = Math.min(5, backendProblems.length);
  const problems: ChallengeProblem[] = [];
  for (let i = 0; i < problemCount; i++) {
    const raw = backendProblems[(seed + i) % backendProblems.length];
    if (raw && !problems.some((p) => p.id === raw.id)) {
      problems.push({
        id: raw.id,
        title: raw.title,
        difficulty: (raw.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
        category: (raw.category || 'algorithms').replace(/-/g, ' '),
        hint: raw.hints?.[0] || 'Check constraints and consider algorithmic patterns.',
      });
    }
  }

  const startChallenge = useCallback(() => {
    const newProgress: ChallengeProgress = {
      weekId,
      startedAt: new Date().toISOString(),
      completedProblems: [],
      timerSeconds: 0,
      finished: false,
    };
    saveChallengeProgress(newProgress);
    setProgress(newProgress);
    setElapsed(0);
    setTimerRunning(true);
  }, [weekId]);

  const toggleProblem = useCallback(
    (id: string) => {
      if (!progress) return;
      const current = progress.completedProblems;
      const updated = current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id];

      const isAllDone = updated.length === problems.length && problems.length > 0;
      const newProg: ChallengeProgress = {
        ...progress,
        completedProblems: updated,
        finished: isAllDone,
        finishedAt: isAllDone ? new Date().toISOString() : undefined,
      };

      saveChallengeProgress(newProg);
      setProgress(newProg);

      if (isAllDone) {
        setTimerRunning(false);
        const entry: ChallengeHistory = {
          weekId,
          completedCount: updated.length,
          totalTime: elapsed,
          finishedAt: new Date().toISOString(),
        };
        const hist = [entry, ...loadHistory().filter((h) => h.weekId !== weekId)].slice(0, 10);
        saveHistory(hist);
        setHistory(hist);
        emitProgressChanged();
      }
    },
    [progress, problems.length, weekId, elapsed]
  );

  const resetChallenge = useCallback(() => {
    setTimerRunning(false);
    setElapsed(0);
    setProgress(null);
    localStorage.removeItem(CHALLENGE_KEY);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (problems.length === 0) {
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
                Weekly Challenge
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Weekly Practice Sprint
            </h1>
          </motion.div>

          <div className="rounded-sm border border-dashed border-[var(--border-soft)] bg-[var(--bg-surface)] p-12 text-center my-6">
            <Trophy className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-40 mb-3" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              No Weekly Challenges Published Yet
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-md mx-auto leading-relaxed">
              Curated 5-problem weekly sprints will automatically generate here once practice problems are added via the Admin Dashboard.
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

  const completedCount = progress?.completedProblems.length || 0;
  const isFinished = progress?.finished || false;
  const progressPct = Math.round((completedCount / problems.length) * 100);

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
              Weekly Challenge
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            {weekId} Sprint
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {problems.length} curated problems refreshed every week. Start the timer, solve all {problems.length}, track your speed.
          </p>
        </motion.div>

        {/* Timer + Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                  {formatTime(elapsed)}
                </span>
              </div>

              {progress && !isFinished && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-2 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
                    title={timerRunning ? 'Pause' : 'Resume'}
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={resetChallenge}
                    className="p-2 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors"
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[var(--text-subtle)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {completedCount}/{problems.length}
                </span>
              </div>
              {isFinished && (
                <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  Complete
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-sm bg-[var(--bg-subtle)] overflow-hidden">
            <motion.div
              className="h-full rounded-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background:
                  progressPct === 100 ? 'var(--color-success)' : 'var(--accent-dark)',
              }}
            />
          </div>
        </motion.div>

        {/* Start Button */}
        {!progress && (
          <div className="text-center mb-8">
            <button
              onClick={startChallenge}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Start This Week’s Sprint
            </button>
          </div>
        )}

        {/* Problem List */}
        <div className="space-y-3 mb-8">
          {problems.map((p, idx) => {
            const done = progress?.completedProblems.includes(p.id) || false;
            const diffCls = DIFFICULTY_STYLE[p.difficulty] || DIFFICULTY_STYLE.easy;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-sm border p-4 transition-all ${
                  done
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-[var(--bg-surface)] border-[var(--border-soft)] hover:border-[var(--border-default)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleProblem(p.id)}
                      disabled={!progress}
                      className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${
                        !progress
                          ? 'opacity-40 cursor-not-allowed border-[var(--border-soft)]'
                          : done
                          ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                          : 'border-[var(--border-strong)] hover:border-[var(--accent-dark)]'
                      }`}
                    >
                      {done && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-[var(--text-subtle)]">
                          #{idx + 1}
                        </span>
                        <h3
                          className={`text-sm font-bold truncate ${
                            done
                              ? 'line-through text-[var(--text-subtle)]'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {p.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold ${diffCls}`}
                        >
                          {p.difficulty}
                        </span>
                        <span className="text-[11px] text-[var(--text-subtle)] capitalize">
                          {p.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setActiveHint(activeHint === p.id ? null : p.id)
                      }
                      className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors px-2 py-1"
                    >
                      {activeHint === p.id ? 'Hide Hint' : 'Hint'}
                    </button>
                    <Link
                      href="/placement/dsa"
                      className="p-1.5 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
                      title="Practice Problem"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Hint Drawer */}
                <AnimatePresence>
                  {activeHint === p.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-[var(--border-soft)] text-xs text-[var(--text-secondary)] leading-relaxed"
                    >
                      <span className="font-semibold text-[var(--text-primary)]">
                        Hint:{' '}
                      </span>
                      {p.hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              Past Sprint Solves
            </h3>
            <div className="space-y-2">
              {history.map((h) => (
                <div
                  key={h.weekId}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border-soft)] last:border-0"
                >
                  <span className="font-medium text-[var(--text-primary)]">{h.weekId}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-subtle)]">{h.completedCount} solved</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {formatTime(h.totalTime)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
