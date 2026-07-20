'use client';

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './client';
import type { Roadmap } from '@/types/roadmap';

interface FirestoreRoadmapData {
  slug: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  estimatedDuration: string;
  status: string;
  variants?: { id: string; label: string }[];
  languages?: string[];
  relationships?: { targetId: string; type: string; description: string }[];
  sections: {
    id: string;
    title: string;
    description: string;
    timeEstimate: string;
    color: string;
    topics: {
      id: string;
      title: string;
      description: string;
      timeEstimate: string;
      whatToLearn: string[];
      resources: { title: string; url: string; type: string }[];
      project: { title: string; description: string };
      variant?: string;
    }[];
  }[];
}

function firestoreToRoadmap(data: FirestoreRoadmapData): Roadmap {
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    icon: data.icon,
    accent: data.accent,
    totalTime: data.estimatedDuration,
    languages: data.languages,
    variants: data.variants,
    stages: (data.sections || []).map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      timeEstimate: s.timeEstimate,
      color: s.color as 'green' | 'lime' | 'yellow' | 'orange' | 'red' | 'purple',
      topics: (s.topics || []).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        timeEstimate: t.timeEstimate,
        whatToLearn: t.whatToLearn || [],
        resources: (t.resources || []).map((r) => ({
          title: r.title,
          url: r.url,
          type: r.type as 'video' | 'article' | 'course' | 'docs',
        })),
        project: t.project || { title: '', description: '' },
        variant: t.variant,
      })),
    })),
  };
}

export interface RoadmapListEntry {
  slug: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  totalTime: string;
  totalTopics: number;
  stageCount: number;
}

export async function fetchAllRoadmaps(): Promise<RoadmapListEntry[]> {
  if (!isFirebaseConfigured) return [];

  const q = query(
    collection(getFirebaseDb(), 'roadmaps'),
    where('status', '==', 'published'),
    orderBy('order', 'asc')
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as FirestoreRoadmapData;
    const totalTopics = (data.sections || []).reduce(
      (sum, s) => sum + (s.topics?.length ?? 0),
      0
    );
    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      icon: data.icon || 'Map',
      accent: data.accent || '#C7FF3D',
      totalTime: data.estimatedDuration || '',
      totalTopics,
      stageCount: (data.sections || []).length,
    };
  });
}

export async function fetchRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  if (!isFirebaseConfigured) return null;

  const q = query(
    collection(getFirebaseDb(), 'roadmaps'),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const data = snap.docs[0].data() as FirestoreRoadmapData;
  return firestoreToRoadmap(data);
}

export async function fetchAllRoadmapSlugs(): Promise<string[]> {
  if (!isFirebaseConfigured) return [];

  const q = query(
    collection(getFirebaseDb(), 'roadmaps'),
    where('status', '==', 'published')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().slug as string);
}
