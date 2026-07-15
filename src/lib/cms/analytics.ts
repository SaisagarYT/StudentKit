'use client';

import { doc, increment, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';

export async function trackPageView(type: 'roadmap' | 'project', slug: string) {
  if (!isFirebaseConfigured || typeof window === 'undefined') return;

  try {
    const ref = doc(getFirebaseDb(), 'analytics', `${type}:${slug}`);
    await setDoc(ref, {
      type,
      slug,
      views: increment(1),
      lastViewed: new Date(),
    }, { merge: true });
  } catch {
    // Analytics are best-effort
  }
}

export interface ContentAnalytics {
  type: string;
  slug: string;
  views: number;
  lastViewed: Date | null;
}

export async function getTopContent(limitCount = 10): Promise<ContentAnalytics[]> {
  if (!isFirebaseConfigured) return [];

  try {
    const q = query(
      collection(getFirebaseDb(), 'analytics'),
      orderBy('views', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        type: data.type,
        slug: data.slug,
        views: data.views || 0,
        lastViewed: data.lastViewed?.toDate?.() || null,
      };
    });
  } catch {
    return [];
  }
}

export async function getContentViews(type: 'roadmap' | 'project', slug: string): Promise<number> {
  if (!isFirebaseConfigured) return 0;

  try {
    const ref = doc(getFirebaseDb(), 'analytics', `${type}:${slug}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return 0;
    return snap.data().views || 0;
  } catch {
    return 0;
  }
}
