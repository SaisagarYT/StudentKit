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
  dsaSolved: number;
  csSolved: number;
  streak: number;
  longestStreak: number;
  totalActiveDays: number;
  roadmapTopics: number;
  xp: number;
  updatedAt: unknown;
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
