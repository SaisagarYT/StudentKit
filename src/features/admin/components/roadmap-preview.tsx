'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { roadmapService } from '@/lib/cms';
import { InteractiveRoadmap } from '@/features/roadmaps/interactive-roadmap';
import type { Roadmap } from '@/types/roadmap';
import { ArrowLeft, Clock, BookOpen, Loader2, AlertTriangle, Eye } from 'lucide-react';
import Link from 'next/link';

export function RoadmapPreview() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const id = searchParams.get('id');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/admin/login'); return; }
    if (!id) { setError('No roadmap ID'); setLoading(false); return; }

    async function load() {
      try {
        const data = await roadmapService.getById(id!);
        setStatus(data.status);
        setRoadmap({
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
            color: s.color,
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
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user, authLoading, router]);

  if (loading || authLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>;
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-[var(--text-secondary)]">{error}</p>
          <Link href="/admin/roadmaps" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-dark)] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </div>
    );
  }

  const totalTopics = roadmap.stages.reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-yellow-50 border-b border-yellow-200 px-4 py-2.5">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Preview Mode</span>
            {status !== 'published' && (
              <span className="flex items-center gap-1 text-xs text-yellow-600">
                <AlertTriangle className="w-3 h-3" /> Not published
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/admin/roadmaps/edit?id=${id}`} className="text-xs font-medium text-yellow-700 hover:text-yellow-900 underline">
              Edit
            </Link>
            <Link href="/admin/roadmaps" className="text-xs font-medium text-yellow-700 hover:text-yellow-900 underline">
              Back to list
            </Link>
          </div>
        </div>
      </div>

      {/* Roadmap content — same as public page */}
      <div className="py-8 md:py-12">
        <div className="container-main">
          <Link href="/admin/roadmaps" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8">
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
    </div>
  );
}
