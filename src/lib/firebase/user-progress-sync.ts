'use client';

import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from './client';
import type { StreakData } from '@/lib/user-progress';

const DSA_STORAGE_KEY = 'sk-dsa-progress';
const CS_STORAGE_KEY = 'sk-cs-progress';
const STREAK_KEY = 'sk-streak';
const BOOKMARKS_KEY = 'sk-bookmarks';

export const PROGRESS_CHANGED_EVENT = 'sk-progress-changed';

export function emitProgressChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT));
  }
}

export interface UserProgressData {
  streak: StreakData;
  dsaProgress: Record<string, boolean>;
  csProgress: Record<string, boolean>;
  roadmapProgress: Record<string, Record<string, boolean>>;
  bookmarks: any[];
}

function getLocalProgress(): UserProgressData {
  const streak: StreakData = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"current":0,"longest":0,"lastActiveDate":"","totalActiveDays":0}');
  const dsaProgress = JSON.parse(localStorage.getItem(DSA_STORAGE_KEY) || '{}');
  const csProgress = JSON.parse(localStorage.getItem(CS_STORAGE_KEY) || '{}');
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');

  const roadmapProgress: Record<string, Record<string, boolean>> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('roadmap-progress-')) {
      const slug = key.replace('roadmap-progress-', '');
      roadmapProgress[slug] = JSON.parse(localStorage.getItem(key) || '{}');
    }
  }

  return { streak, dsaProgress, csProgress, roadmapProgress, bookmarks };
}

function setLocalProgress(data: UserProgressData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data.streak));
  localStorage.setItem(DSA_STORAGE_KEY, JSON.stringify(data.dsaProgress));
  localStorage.setItem(CS_STORAGE_KEY, JSON.stringify(data.csProgress));
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks));

  for (const [slug, progress] of Object.entries(data.roadmapProgress)) {
    localStorage.setItem(`roadmap-progress-${slug}`, JSON.stringify(progress));
  }
}

function mergeProgress(local: UserProgressData, cloud: UserProgressData): UserProgressData {
  // Streak: keep the one with more total active days
  const streak = local.streak.totalActiveDays >= cloud.streak.totalActiveDays ? local.streak : cloud.streak;

  // DSA/CS progress: merge (union of solved)
  const dsaProgress = { ...cloud.dsaProgress, ...local.dsaProgress };
  const csProgress = { ...cloud.csProgress, ...local.csProgress };

  // Roadmap progress: merge per-roadmap
  const allSlugs = new Set([...Object.keys(local.roadmapProgress), ...Object.keys(cloud.roadmapProgress)]);
  const roadmapProgress: Record<string, Record<string, boolean>> = {};
  for (const slug of allSlugs) {
    roadmapProgress[slug] = { ...(cloud.roadmapProgress[slug] || {}), ...(local.roadmapProgress[slug] || {}) };
  }

  // Bookmarks: union by type+slug
  const bookmarkSet = new Map<string, any>();
  for (const b of [...(cloud.bookmarks || []), ...(local.bookmarks || [])]) {
    bookmarkSet.set(`${b.type}:${b.slug}`, b);
  }
  const bookmarks = [...bookmarkSet.values()];

  return { streak, dsaProgress, csProgress, roadmapProgress, bookmarks };
}

export async function syncProgressOnLogin(uid: string): Promise<void> {
  try {
    const ref = doc(getFirebaseDb(), 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const cloudData = snap.data() as UserProgressData;
    const localData = getLocalProgress();
    const merged = mergeProgress(localData, cloudData);

    // Update local
    setLocalProgress(merged);

    // Update cloud
    await updateDoc(ref, {
      streak: merged.streak,
      dsaProgress: merged.dsaProgress,
      csProgress: merged.csProgress,
      roadmapProgress: merged.roadmapProgress,
      bookmarks: merged.bookmarks,
      lastSyncedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[ProgressSync] Failed:', e);
  }
}

export async function pushProgressToCloud(uid: string): Promise<void> {
  try {
    const localData = getLocalProgress();
    const ref = doc(getFirebaseDb(), 'users', uid);
    await updateDoc(ref, {
      streak: localData.streak,
      dsaProgress: localData.dsaProgress,
      csProgress: localData.csProgress,
      roadmapProgress: localData.roadmapProgress,
      bookmarks: localData.bookmarks,
      lastSyncedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[ProgressSync] Push failed:', e);
  }
}
