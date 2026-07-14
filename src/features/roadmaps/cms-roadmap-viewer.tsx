'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { InteractiveRoadmap } from './interactive-roadmap';
import type { Roadmap } from '@/types/roadmap';
import { ArrowLeft, Clock, BookOpen, Code2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface CmsRoadmapData {
  slug: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  estimatedDuration: string;
  variants: { id: string; label: string }[];
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

function cmsToRoadmap(data: CmsRoadmapData): Roadmap {
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    icon: data.icon,
    accent: data.accent,
    totalTime: data.estimatedDuration,
    variants: data.variants,
    stages: data.sections.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      timeEstimate: s.timeEstimate,
      color: s.color as 'green' | 'lime' | 'yellow' | 'orange' | 'red' | 'purple',
      topics: s.topics.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        timeEstimate: t.timeEstimate,
        whatToLearn: t.whatToLearn,
        resources: t.resources.map((r) => ({
          title: r.title,
          url: r.url,
          type: r.type as 'video' | 'article' | 'course' | 'docs',
        })),
        project: t.project,
        variant: t.variant,
      })),
    })),
  };
}

export function CmsRoadmapViewer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug || !isFirebaseConfigured) {
      setLoading(false);
      setError('Roadmap not found');
      return;
    }

    async function load() {
      try {
        const q = query(
          collection(getFirebaseDb(), 'roadmaps'),
          where('slug', '==', slug),
          where('status', '==', 'published'),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setError('Roadmap not found');
          return;
        }
        const data = snap.docs[0].data() as CmsRoadmapData;
        setRoadmap(cmsToRoadmap(data));
      } catch {
        setError('Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--text-secondary)]">{error}</p>
        <Link href="/roadmaps" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-dark)] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to roadmaps
        </Link>
      </div>
    );
  }

  const totalTopics = roadmap.stages.reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <div className="py-8 md:py-12">
      <div className="container-main">
        <Link href="/roadmaps" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All Roadmaps
        </Link>

        <div className="max-w-3xl">
          <h1 className="text-h1 font-bold tracking-tight">
            {roadmap.title} <span className="font-serif italic font-normal">Roadmap</span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">{roadmap.description}</p>
          <div className="flex items-center gap-6 mt-6">
            <span className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
              <Clock className="w-4 h-4" /> {roadmap.totalTime}
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
              <BookOpen className="w-4 h-4" /> {totalTopics} topics across {roadmap.stages.length} stages
            </span>
          </div>
        </div>

        <div className="mt-12">
          <InteractiveRoadmap roadmap={roadmap} />
        </div>
      </div>
    </div>
  );
}
