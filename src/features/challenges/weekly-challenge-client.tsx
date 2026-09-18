'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Clock, Flame, Zap, Target, ChevronRight,
  Play, Pause, RotateCcw, CheckCircle2, Timer
} from 'lucide-react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';

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

function getWeeklyProblems(weekId: string): ChallengeProblem[] {
  const seed = weekId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const problems: ChallengeProblem[][] = [
    [
      { id: 'two-sum', title: 'Two Sum', difficulty: 'easy', category: 'Arrays & Hashing', hint: 'Use a hash map to store complement values.' },
      { id: 'valid-anagram', title: 'Valid Anagram', difficulty: 'easy', category: 'Arrays & Hashing', hint: 'Count character frequencies and compare.' },
      { id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'medium', category: 'Arrays & Hashing', hint: 'Sort each word and use it as a hash key.' },
      { id: 'longest-consecutive', title: 'Longest Consecutive Sequence', difficulty: 'medium', category: 'Arrays & Hashing', hint: 'Use a set. Only start counting from sequence starts.' },
      { id: 'product-except-self', title: 'Product of Array Except Self', difficulty: 'medium', category: 'Arrays & Hashing', hint: 'Use prefix and suffix products without division.' },
    ],
    [
      { id: 'valid-palindrome', title: 'Valid Palindrome', difficulty: 'easy', category: 'Two Pointers', hint: 'Use two pointers from both ends, skip non-alphanumeric.' },
      { id: 'three-sum', title: '3Sum', difficulty: 'medium', category: 'Two Pointers', hint: 'Sort, fix one element, then use two pointers for the other two.' },
      { id: 'container-water', title: 'Container With Most Water', difficulty: 'medium', category: 'Two Pointers', hint: 'Two pointers — always move the shorter side inward.' },
      { id: 'best-time-buy-sell', title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', category: 'Sliding Window', hint: 'Track minimum price seen so far, maximize profit at each step.' },
      { id: 'longest-substr', title: 'Longest Substring Without Repeating', difficulty: 'medium', category: 'Sliding Window', hint: 'Expand window right, shrink from left when a duplicate enters.' },
    ],
    [
      { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'easy', category: 'Stack', hint: 'Push opening brackets, pop and compare for closing ones.' },
      { id: 'min-stack', title: 'Min Stack', difficulty: 'medium', category: 'Stack', hint: 'Maintain a parallel stack tracking minimums.' },
      { id: 'binary-search', title: 'Binary Search', difficulty: 'easy', category: 'Binary Search', hint: 'Classic lo/hi with mid comparison. Watch for off-by-one.' },
      { id: 'search-rotated', title: 'Search in Rotated Sorted Array', difficulty: 'medium', category: 'Binary Search', hint: 'Determine which half is sorted, then decide direction.' },
      { id: 'find-min-rotated', title: 'Find Minimum in Rotated Array', difficulty: 'medium', category: 'Binary Search', hint: 'Binary search — if mid > right, min is in right half.' },
    ],
    [
      { id: 'reverse-ll', title: 'Reverse Linked List', difficulty: 'easy', category: 'Linked List', hint: 'Use three pointers: prev, curr, next. Iterate and flip.' },
      { id: 'merge-two-ll', title: 'Merge Two Sorted Lists', difficulty: 'easy', category: 'Linked List', hint: 'Use a dummy head, compare and advance the smaller pointer.' },
      { id: 'invert-tree', title: 'Invert Binary Tree', difficulty: 'easy', category: 'Trees', hint: 'Recursively swap left and right children.' },
      { id: 'max-depth-tree', title: 'Maximum Depth of Binary Tree', difficulty: 'easy', category: 'Trees', hint: 'Return 1 + max(left depth, right depth). Base: null = 0.' },
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'easy', category: 'Dynamic Programming', hint: 'Fibonacci pattern: dp[i] = dp[i-1] + dp[i-2].' },
    ],
  ];

  return problems[seed % problems.length];
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
  const { user: _user } = useUserAuth();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [history, setHistory] = useState<ChallengeHistory[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const weekId = getWeekId();
  const problems = getWeeklyProblems(weekId);

  useEffect(() => {
    setMounted(true);
    const saved = loadChallengeProgress();
    if (saved && saved.weekId === weekId) {
      setProgress(saved);
      setElapsed(saved.timerSeconds);
    }
    setHistory(loadHistory());
  }, [weekId]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
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

  const startChallenge = useCallback(() => {
    const newProgress: ChallengeProgress = {
      weekId,
      startedAt: new Date().toISOString(),
      completedProblems: [],
      timerSeconds: 0,
      finished: false,
    };
    setProgress(newProgress);
    saveChallengeProgress(newProgress);
    setElapsed(0);
    setTimerRunning(true);
  }, [weekId]);

  const toggleProblem = useCallback((problemId: string) => {
    if (!progress || progress.finished) return;
    setProgress(prev => {
      if (!prev) return prev;
      const completed = prev.completedProblems.includes(problemId)
        ? prev.completedProblems.filter(id => id !== problemId)
        : [...prev.completedProblems, problemId];

      const finished = completed.length === problems.length;
      const updated: ChallengeProgress = {
        ...prev,
        completedProblems: completed,
        timerSeconds: elapsed,
        finished,
        finishedAt: finished ? new Date().toISOString() : undefined,
      };

      if (finished) {
        setTimerRunning(false);
        const newHistory: ChallengeHistory = {
          weekId: prev.weekId,
          completedCount: completed.length,
          totalTime: elapsed,
          finishedAt: new Date().toISOString(),
        };
        const hist = [newHistory, ...loadHistory().filter(h => h.weekId !== prev.weekId)];
        saveHistory(hist);
        setHistory(hist);
        emitProgressChanged();
      }

      saveChallengeProgress(updated);
      return updated;
    });
  }, [progress, elapsed, problems.length]);

  const resetChallenge = useCallback(() => {
    if (!window.confirm("Reset this week's challenge? Timer will restart.")) return;
    setTimerRunning(false);
    setElapsed(0);
    const newProgress: ChallengeProgress = {
      weekId,
      startedAt: new Date().toISOString(),
      completedProblems: [],
      timerSeconds: 0,
      finished: false,
    };
    setProgress(newProgress);
    saveChallengeProgress(newProgress);
  }, [weekId]);

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedCount = progress?.completedProblems.length || 0;
  const isFinished = progress?.finished || false;
  const progressPct = (completedCount / problems.length) * 100;

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
            5 curated problems refreshed every week. Start the timer, solve all 5, track your speed.
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
              transition={{ duration: 0.4 }}
              style={{ background: isFinished ? 'var(--color-success)' : 'var(--accent-dark)' }}
            />
          </div>
        </motion.div>

        {/* Start button */}
        {!progress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center mb-8"
          >
            <button
              onClick={startChallenge}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" />
              Start Challenge
            </button>
          </motion.div>
        )}

        {/* Problems list */}
        {progress && (
          <div className="space-y-3 mb-8">
            {problems.map((problem, idx) => {
              const isDone = progress.completedProblems.includes(problem.id);
              const hintVisible = showHint === problem.id;

              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`rounded-sm border transition-all ${
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-[var(--border-soft)] bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-3 p-4">
                    <span className="w-6 text-center text-xs font-bold text-[var(--text-subtle)]">
                      {idx + 1}
                    </span>

                    <button
                      onClick={() => toggleProblem(problem.id)}
                      disabled={isFinished && !isDone}
                      className={`w-6 h-6 rounded-sm border flex items-center justify-center shrink-0 transition-all ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-[var(--border-default)] hover:border-emerald-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDone ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-primary)]'}`}>
                        {problem.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">{problem.category}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold capitalize ${DIFFICULTY_STYLE[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>

                    <button
                      onClick={() => setShowHint(hintVisible ? null : problem.id)}
                      className={`p-1.5 rounded-sm text-xs transition-colors ${
                        hintVisible
                          ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                          : 'text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)]'
                      }`}
                      title="Show hint"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${hintVisible ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {hintVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 pt-0 pl-[60px]"
                      >
                        <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-sm px-3 py-2 italic">
                          {problem.hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Completion message */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 text-center mb-8"
            >
              <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-warning)' }} />
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Challenge Complete!</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                You solved all {problems.length} problems in <strong>{formatTime(elapsed)}</strong>
              </p>
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
              <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Past Challenges</h2>
            </div>
            <div className="space-y-2">
              {history.slice(0, 8).map(h => (
                <div key={h.weekId} className="flex items-center justify-between py-2 border-b border-[var(--border-soft)] last:border-0">
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                    <span className="text-xs font-medium text-[var(--text-primary)]">{h.weekId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[var(--text-subtle)]">{h.completedCount}/5 solved</span>
                    <span className="text-[11px] font-mono font-semibold text-[var(--text-primary)]">{formatTime(h.totalTime)}</span>
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
