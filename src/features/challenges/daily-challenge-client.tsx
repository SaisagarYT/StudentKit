'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trophy, Clock, Flame, Zap, Target, ChevronRight,
  Play, Pause, RotateCcw, CheckCircle2, Timer, Calendar, TrendingUp
} from 'lucide-react';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';

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

const PROBLEMS: DailyProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'Arrays & Hashing',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.',
    hints: ['Think about what value you need to find for each element.', 'A hash map can give you O(1) lookups for the complement.', 'Single pass: for each num, check if (target - num) exists in the map.'],
    approach: '1. Create an empty hash map.\n2. For each element num at index i:\n   - Calculate complement = target - num\n   - If complement exists in map, return [map[complement], i]\n   - Otherwise, store map[num] = i\n3. Return empty (won\'t reach here per constraint)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'Stack',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.',
    hints: ['Use a stack to track opening brackets.', 'When you see a closing bracket, the top of stack must match.', 'If stack is empty at the end, the string is valid.'],
    approach: '1. Initialize an empty stack.\n2. For each character c:\n   - If c is opening bracket: push to stack\n   - If c is closing bracket: check stack top matches, pop if yes, return false if no\n3. Return true if stack is empty, false otherwise.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'best-time-buy-sell',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'Sliding Window',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit from one transaction (buy one day, sell a later day). Return 0 if no profit possible.',
    hints: ['Track the minimum price seen so far.', 'At each day, the max profit is current price minus the minimum so far.', 'You only need one pass through the array.'],
    approach: '1. Set minPrice = prices[0], maxProfit = 0.\n2. For each price from index 1:\n   - maxProfit = max(maxProfit, price - minPrice)\n   - minPrice = min(minPrice, price)\n3. Return maxProfit.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    hints: ['Think about how you reach step n — from step n-1 or n-2.', 'This is the Fibonacci pattern.', 'You only need the previous two values, not the whole array.'],
    approach: '1. Base: dp[1] = 1, dp[2] = 2.\n2. For i from 3 to n: dp[i] = dp[i-1] + dp[i-2].\n3. Optimize space: keep only prev and curr.\n4. Return dp[n].',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    category: 'Intervals',
    description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    hints: ['Sort intervals by start time first.', 'Two intervals overlap if current.start <= previous.end.', 'When merging, take max of both end times.'],
    approach: '1. Sort intervals by start time.\n2. Initialize result with first interval.\n3. For each remaining interval:\n   - If it overlaps with last in result (start <= last.end): merge by updating last.end = max(last.end, current.end)\n   - Otherwise: add to result\n4. Return result.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'container-most-water',
    title: 'Container With Most Water',
    difficulty: 'medium',
    category: 'Two Pointers',
    description: 'Given n non-negative integers a1, a2, ..., an where each represents a point (i, ai). Find two lines that together with the x-axis form a container that holds the most water.',
    hints: ['Area = min(height[left], height[right]) * (right - left).', 'Start with widest container (pointers at both ends).', 'Always move the pointer pointing to the shorter line inward.'],
    approach: '1. Set left = 0, right = n-1, maxArea = 0.\n2. While left < right:\n   - area = min(height[left], height[right]) * (right - left)\n   - maxArea = max(maxArea, area)\n   - Move the shorter pointer inward\n3. Return maxArea.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    category: 'Sliding Window',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    hints: ['Use a sliding window with two pointers.', 'Track characters in the current window with a Set or Map.', 'When a duplicate enters, shrink from the left until it\'s removed.'],
    approach: '1. Use a Set and two pointers (left, right).\n2. Expand right: add s[right] to set.\n3. If s[right] already in set: remove s[left] and advance left until no duplicate.\n4. Track max window size = right - left + 1.\n5. Return max.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, 26))',
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'medium',
    category: 'Arrays & Hashing',
    description: 'Given an array of strings strs, group the anagrams together. An anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.',
    hints: ['Two words are anagrams if they have the same sorted form.', 'Use sorted string as a hash key.', 'Alternatively, use character frequency as a tuple key.'],
    approach: '1. Create a hash map: key → list of words.\n2. For each word, compute its key (sorted characters or frequency tuple).\n3. Append word to map[key].\n4. Return all values from the map.',
    timeComplexity: 'O(n * k log k)',
    spaceComplexity: 'O(n * k)',
  },
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    category: 'Arrays & Hashing',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must solve it without using division and in O(n) time.',
    hints: ['The answer for position i = product of everything to its left × product of everything to its right.', 'Compute prefix products left-to-right, then suffix products right-to-left.', 'You can do it in a single output array with two passes.'],
    approach: '1. Create output array of length n, filled with 1.\n2. Left pass: for i from 0 to n-1, output[i] = running left product, then multiply left product by nums[i].\n3. Right pass: for i from n-1 to 0, output[i] *= running right product, then multiply right product by nums[i].\n4. Return output.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) (excluding output)',
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    category: 'Binary Search',
    description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.',
    hints: ['Use lo and hi pointers on the search space.', 'Calculate mid = lo + (hi - lo) / 2 to avoid overflow.', 'Narrow the half that cannot contain the target.'],
    approach: '1. Set lo = 0, hi = n - 1.\n2. While lo <= hi:\n   - mid = lo + (hi - lo) / 2\n   - If nums[mid] == target: return mid\n   - If nums[mid] < target: lo = mid + 1\n   - Else: hi = mid - 1\n3. Return -1.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    category: 'Linked List',
    description: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
    hints: ['Use three pointers: prev, curr, next.', 'At each step, flip curr.next to point to prev.', 'Advance all three pointers forward.'],
    approach: '1. Set prev = null, curr = head.\n2. While curr is not null:\n   - next = curr.next\n   - curr.next = prev\n   - prev = curr\n   - curr = next\n3. Return prev (new head).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'easy',
    category: 'Trees',
    description: 'Given the root of a binary tree, invert the tree and return its root. Inverting means swapping left and right children at every node.',
    hints: ['Think recursively: swap children, then recurse.', 'Base case: null node, just return null.', 'BFS also works — swap children level by level.'],
    approach: '1. If root is null, return null.\n2. Swap root.left and root.right.\n3. Recursively invert(root.left) and invert(root.right).\n4. Return root.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) — recursion stack',
  },
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'medium',
    category: 'Two Pointers',
    description: 'Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
    hints: ['Sort the array first.', 'Fix one element, then use two pointers for the remaining two.', 'Skip duplicates at each level to avoid repeated triplets.'],
    approach: '1. Sort nums.\n2. For each i from 0 to n-3:\n   - Skip if nums[i] == nums[i-1] (avoid duplicates)\n   - Set left = i+1, right = n-1\n   - While left < right: check sum\n     - If sum == 0: add triplet, skip duplicates, move both pointers\n     - If sum < 0: left++\n     - If sum > 0: right--\n3. Return results.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1) (excluding output)',
  },
  {
    id: 'max-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'easy',
    category: 'Trees',
    description: 'Given the root of a binary tree, return its maximum depth. Maximum depth is the number of nodes along the longest path from the root to the farthest leaf.',
    hints: ['The depth of a node is 1 + max depth of its children.', 'Base case: null node has depth 0.', 'BFS counting levels also works.'],
    approach: '1. If root is null, return 0.\n2. Return 1 + max(maxDepth(root.left), maxDepth(root.right)).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
  },
];

function getDailyProblem(dayId: string): DailyProblem {
  const seed = dayId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PROBLEMS[seed % PROBLEMS.length];
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

const DIFFICULTY_COLORS = {
  easy: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'Easy' },
  medium: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', label: 'Medium' },
  hard: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Hard' },
};

export function DailyChallengeClient() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<DailyChallengeProgress | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showApproach, setShowApproach] = useState(false);
  const [history, setHistory] = useState<DailyHistory[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dayId = getDayId();
  const problem = getDailyProblem(dayId);

  useEffect(() => {
    setMounted(true);
    const saved = loadProgress();
    if (saved && saved.dayId === dayId) {
      setProgress(saved);
      setElapsed(saved.timerSeconds);
      setRevealedHints(saved.hintsUsed);
    }
    setHistory(loadHistory());
  }, [dayId]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
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
    const hist = [entry, ...loadHistory().filter(h => h.dayId !== progress.dayId)].slice(0, 30);
    saveHistory(hist);
    setHistory(hist);
    emitProgressChanged();
  }, [progress, elapsed, revealedHints]);

  const revealNextHint = useCallback(() => {
    if (revealedHints >= problem.hints.length) return;
    const next = revealedHints + 1;
    setRevealedHints(next);
    if (progress) {
      saveChallengeProgress({ ...progress, hintsUsed: next });
    }
  }, [revealedHints, problem.hints.length, progress]);

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFinished = progress?.completed || false;
  const streakDays = history.length;
  const colors = DIFFICULTY_COLORS[problem.difficulty];

  return (
    <div className="py-8 md:py-12">
      <div className="container-main max-w-2xl">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-4">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
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
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-1.5 text-sm">
            <Flame className="w-4 h-4 text-orange-500" />
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
        </div>

        {/* Problem Card */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden mb-6">
          {/* Problem header */}
          <div className="p-5 border-b border-[var(--border-soft)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{problem.title}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {colors.label}
                  </span>
                  <span className="text-[11px] text-[var(--text-subtle)]">{problem.category}</span>
                </div>
              </div>
              {isFinished && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Solved</span>
                </div>
              )}
            </div>
          </div>

          {/* Problem description */}
          <div className="p-5 border-b border-[var(--border-soft)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{problem.description}</p>
          </div>

          {/* Timer + Actions */}
          <div className="p-5 border-b border-[var(--border-soft)] bg-[var(--bg-background)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
                  {formatTime(elapsed)}
                </span>
                {progress && !isFinished && (
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {!progress && (
                <button
                  onClick={startChallenge}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-dark)] text-[var(--accent-primary)] text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Timer
                </button>
              )}

              {progress && !isFinished && (
                <button
                  onClick={markComplete}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Solved
                </button>
              )}
            </div>
          </div>

          {/* Hints section */}
          {progress && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider">
                  Hints ({revealedHints}/{problem.hints.length})
                </span>
                {revealedHints < problem.hints.length && (
                  <button
                    onClick={revealNextHint}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-yellow-600 hover:bg-yellow-50 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    Reveal Hint {revealedHints + 1}
                  </button>
                )}
              </div>

              {revealedHints > 0 && (
                <div className="space-y-2 mb-4">
                  {problem.hints.slice(0, revealedHints).map((hint, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-yellow-500 mt-0.5 shrink-0">#{i + 1}</span>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Approach */}
              {(isFinished || revealedHints === problem.hints.length) && (
                <div className="pt-3 border-t border-[var(--border-soft)]">
                  <button
                    onClick={() => setShowApproach(!showApproach)}
                    className="text-[11px] font-semibold text-[var(--accent-dark)] hover:underline mb-2"
                  >
                    {showApproach ? 'Hide Approach' : 'Show Full Approach'}
                  </button>
                  {showApproach && (
                    <div className="mt-2 space-y-3">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                        {problem.approach}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                          <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
                          {problem.timeComplexity}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                          <Target className="w-3 h-3 text-[var(--text-subtle)]" />
                          {problem.spaceComplexity}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completion card */}
        {isFinished && (
          <div className="rounded-2xl border border-green-200 bg-green-50/30 p-6 text-center mb-6">
            <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Solved!</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Completed in <strong>{formatTime(elapsed)}</strong> with {revealedHints} hint{revealedHints !== 1 ? 's' : ''} used
            </p>
            <p className="text-xs text-[var(--text-subtle)] mt-2">Come back tomorrow for a new problem</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Solves</h3>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map(h => (
                <div key={h.dayId} className="flex items-center justify-between py-2 border-b border-[var(--border-soft)] last:border-0">
                  <span className="text-xs font-medium text-[var(--text-primary)]">{h.dayId}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[var(--text-subtle)]">{h.hintsUsed} hints</span>
                    <span className="text-[11px] font-mono font-semibold text-[var(--text-primary)]">{formatTime(h.time)}</span>
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
