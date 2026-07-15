'use client';

const STREAK_KEY = 'sk-streak';
const BOOKMARKS_KEY = 'sk-bookmarks';
const LAST_ACTIVE_KEY = 'sk-last-active';

// --- Streak System ---

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalActiveDays: number;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreak(): StreakData {
  if (typeof window === 'undefined') return { current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 };
    return JSON.parse(raw);
  } catch {
    return { current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 };
  }
}

export function recordActivity(): StreakData {
  if (typeof window === 'undefined') return getStreak();

  const streak = getStreak();
  const today = getToday();
  const yesterday = getYesterday();

  if (streak.lastActiveDate === today) {
    return streak;
  }

  let newCurrent: number;
  if (streak.lastActiveDate === yesterday) {
    newCurrent = streak.current + 1;
  } else if (streak.lastActiveDate === '') {
    newCurrent = 1;
  } else {
    newCurrent = 1;
  }

  const updated: StreakData = {
    current: newCurrent,
    longest: Math.max(streak.longest, newCurrent),
    lastActiveDate: today,
    totalActiveDays: streak.totalActiveDays + 1,
  };

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  } catch { /* */ }

  return updated;
}

export function isStreakActive(): boolean {
  const streak = getStreak();
  const today = getToday();
  return streak.lastActiveDate === today;
}

// --- Bookmarks System ---

export interface Bookmark {
  type: 'tool' | 'roadmap' | 'project';
  slug: string;
  title: string;
  addedAt: string;
}

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(item: Omit<Bookmark, 'addedAt'>): Bookmark[] {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((b) => b.type === item.type && b.slug === item.slug);
  if (exists) return bookmarks;

  const updated = [...bookmarks, { ...item, addedAt: new Date().toISOString() }];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch { /* */ }
  return updated;
}

export function removeBookmark(type: string, slug: string): Bookmark[] {
  const bookmarks = getBookmarks();
  const updated = bookmarks.filter((b) => !(b.type === type && b.slug === slug));
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch { /* */ }
  return updated;
}

export function isBookmarked(type: string, slug: string): boolean {
  return getBookmarks().some((b) => b.type === type && b.slug === slug);
}

// --- Overall Progress Summary ---

export interface ProgressSummary {
  totalTopicsCompleted: number;
  roadmapsStarted: number;
  roadmapsCompleted: number;
}

export function getProgressSummary(): ProgressSummary {
  if (typeof window === 'undefined') return { totalTopicsCompleted: 0, roadmapsStarted: 0, roadmapsCompleted: 0 };

  let totalTopicsCompleted = 0;
  let roadmapsStarted = 0;
  let roadmapsCompleted = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('roadmap-progress-')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const progress: Record<string, boolean> = JSON.parse(raw);
          const completed = Object.values(progress).filter(Boolean).length;
          const total = Object.keys(progress).length;
          if (completed > 0) {
            roadmapsStarted++;
            totalTopicsCompleted += completed;
            if (total > 0 && completed === total) {
              roadmapsCompleted++;
            }
          }
        }
      }
    }
  } catch { /* */ }

  return { totalTopicsCompleted, roadmapsStarted, roadmapsCompleted };
}
