'use client';

import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb } from './client';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  college?: string;
  dsaSolved: number;
  csSolved: number;
  streak: number;
  longestStreak: number;
  totalActiveDays: number;
  roadmapTopics: number;
  xp: number;
  updatedAt: any;
}

export interface CampusLeaderboardEntry {
  college: string;
  activeCoders: number;
  totalSolved: number;
  totalXp: number;
  topPerformer: string;
}

export const DEFAULT_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [];

export function getCampusRankings(entries: LeaderboardEntry[]): CampusLeaderboardEntry[] {
  const map = new Map<string, { coders: number; solved: number; xp: number; topName: string; topXp: number }>();

  for (const entry of entries) {
    const col = entry.college || 'Independent Learners';
    const current = map.get(col) || { coders: 0, solved: 0, xp: 0, topName: entry.displayName, topXp: 0 };
    current.coders += 1;
    current.solved += entry.dsaSolved;
    current.xp += entry.xp;
    if (entry.xp > current.topXp) {
      current.topXp = entry.xp;
      current.topName = entry.displayName;
    }
    map.set(col, current);
  }

  return Array.from(map.entries())
    .map(([college, stats]) => ({
      college,
      activeCoders: stats.coders,
      totalSolved: stats.solved,
      totalXp: stats.xp,
      topPerformer: stats.topName,
    }))
    .sort((a, b) => b.totalXp - a.totalXp);
}

export function calculateXP(entry: Pick<LeaderboardEntry, 'dsaSolved' | 'csSolved' | 'totalActiveDays' | 'roadmapTopics'>): number {
  return entry.dsaSolved * 10 + entry.csSolved * 5 + entry.totalActiveDays * 3 + entry.roadmapTopics * 8;
}

export async function updateLeaderboardEntry(
  uid: string,
  profile: { displayName: string; photoURL: string },
  stats: {
    dsaSolved: number;
    csSolved: number;
    streak: number;
    longestStreak: number;
    totalActiveDays: number;
    roadmapTopics: number;
  }
): Promise<void> {
  try {
    const xp = calculateXP(stats);
    const ref = doc(getFirebaseDb(), 'leaderboard', uid);
    await setDoc(ref, {
      uid,
      displayName: profile.displayName || 'Anonymous',
      photoURL: profile.photoURL || '',
      ...stats,
      xp,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[Leaderboard] Update failed:', e);
  }
}

export function subscribeToLeaderboard(
  count: number,
  sortBy: 'xp' | 'dsaSolved' | 'streak',
  callback: (entries: LeaderboardEntry[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const field = sortBy === 'streak' ? 'longestStreak' : sortBy;
  const q = query(
    collection(db, 'leaderboard'),
    orderBy(field, 'desc'),
    limit(count)
  );

  return onSnapshot(q, (snapshot) => {
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push(doc.data() as LeaderboardEntry);
    });
    callback(entries);
  }, (error) => {
    console.error('[Leaderboard] Subscription error:', error);
  });
}
