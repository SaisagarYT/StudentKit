'use client';

import { getStreak, getProgressSummary } from './user-progress';

// ─── XP Point Values ─────────────────────────────────────────────────────────

export const XP_VALUES = {
  ROADMAP_TOPIC: 15,
  DSA_PROBLEM: 10,
  CS_TOPIC: 8,
  ACTIVE_DAY: 5,
  CHALLENGE_COMPLETE: 25,
  PROJECT_MILESTONE: 20,
} as const;

// ─── Streak Multiplier ───────────────────────────────────────────────────────

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.3;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

// ─── Level Definitions ───────────────────────────────────────────────────────

export interface Level {
  id: string;
  title: string;
  minXp: number;
  maxXp: number;
}

export const LEVELS: Level[] = [
  { id: 'newbie', title: 'Newbie', minXp: 0, maxXp: 50 },
  { id: 'starter', title: 'Starter', minXp: 50, maxXp: 150 },
  { id: 'learner', title: 'Learner', minXp: 150, maxXp: 350 },
  { id: 'builder', title: 'Builder', minXp: 350, maxXp: 700 },
  { id: 'solver', title: 'Solver', minXp: 700, maxXp: 1200 },
  { id: 'practitioner', title: 'Practitioner', minXp: 1200, maxXp: 2000 },
  { id: 'advanced', title: 'Advanced', minXp: 2000, maxXp: 3500 },
  { id: 'expert', title: 'Expert', minXp: 3500, maxXp: 5500 },
  { id: 'master', title: 'Master', minXp: 5500, maxXp: 8000 },
  { id: 'legend', title: 'Legend', minXp: 8000, maxXp: Infinity },
];

// ─── XP State ────────────────────────────────────────────────────────────────

const XP_LOG_KEY = 'sk-xp-log';

export interface XpEvent {
  type: keyof typeof XP_VALUES;
  points: number;
  timestamp: string;
  label?: string;
}

export interface XpState {
  totalXp: number;
  level: Level;
  levelIndex: number;
  xpInLevel: number;
  xpToNextLevel: number;
  levelProgress: number;
  streakMultiplier: number;
}

function getDsaSolved(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('sk-dsa-progress');
    if (!raw) return 0;
    return Object.values(JSON.parse(raw) as Record<string, boolean>).filter(Boolean).length;
  } catch {
    return 0;
  }
}

function getCsSolved(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('sk-cs-progress');
    if (!raw) return 0;
    return Object.values(JSON.parse(raw) as Record<string, boolean>).filter(Boolean).length;
  } catch {
    return 0;
  }
}

function getChallengesCompleted(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('sk-challenges-completed');
    if (!raw) return 0;
    return (JSON.parse(raw) as string[]).length;
  } catch {
    return 0;
  }
}

export function computeTotalXp(): number {
  if (typeof window === 'undefined') return 0;

  const progress = getProgressSummary();
  const streak = getStreak();
  const dsaSolved = getDsaSolved();
  const csSolved = getCsSolved();
  const challengesDone = getChallengesCompleted();

  const baseXp =
    progress.totalTopicsCompleted * XP_VALUES.ROADMAP_TOPIC +
    dsaSolved * XP_VALUES.DSA_PROBLEM +
    csSolved * XP_VALUES.CS_TOPIC +
    streak.totalActiveDays * XP_VALUES.ACTIVE_DAY +
    challengesDone * XP_VALUES.CHALLENGE_COMPLETE;

  return baseXp;
}

export function getXpState(): XpState {
  const totalXp = computeTotalXp();
  const streak = getStreak();
  const streakMultiplier = getStreakMultiplier(streak.current);

  let levelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].minXp) {
      levelIndex = i;
      break;
    }
  }

  const level = LEVELS[levelIndex];
  const xpInLevel = totalXp - level.minXp;
  const levelRange = level.maxXp === Infinity ? 2500 : level.maxXp - level.minXp;
  const xpToNextLevel = levelRange - xpInLevel;
  const levelProgress = Math.min(xpInLevel / levelRange, 1);

  return {
    totalXp,
    level,
    levelIndex,
    xpInLevel,
    xpToNextLevel,
    levelProgress,
    streakMultiplier,
  };
}

// ─── XP Event Logging (for toasts) ──────────────────────────────────────────

export function logXpEvent(type: keyof typeof XP_VALUES, label?: string): XpEvent {
  const streak = getStreak();
  const multiplier = getStreakMultiplier(streak.current);
  const basePoints = XP_VALUES[type];
  const points = Math.round(basePoints * multiplier);

  const event: XpEvent = {
    type,
    points,
    timestamp: new Date().toISOString(),
    label,
  };

  try {
    const raw = localStorage.getItem(XP_LOG_KEY);
    const log: XpEvent[] = raw ? JSON.parse(raw) : [];
    log.push(event);
    // Keep only last 50 events
    const trimmed = log.slice(-50);
    localStorage.setItem(XP_LOG_KEY, JSON.stringify(trimmed));
  } catch { /* */ }

  // Dispatch custom event for toast listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sk-xp-earned', { detail: event }));
  }

  return event;
}

export function getRecentXpEvents(count = 10): XpEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(XP_LOG_KEY);
    if (!raw) return [];
    const log: XpEvent[] = JSON.parse(raw);
    return log.slice(-count).reverse();
  } catch {
    return [];
  }
}
