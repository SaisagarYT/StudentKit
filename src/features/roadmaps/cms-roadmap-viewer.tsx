/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, limit, documentId } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { trackPageView } from '@/lib/cms/analytics';
import { InteractiveRoadmap } from './interactive-roadmap';
import type { Roadmap } from '@/types/roadmap';
import { ArrowLeft, Clock, BookOpen, Code2, Loader2, FolderOpen, FileText } from 'lucide-react';
import Link from 'next/link';
import { ViewCounter } from '@/components/engagement/view-counter';
import { BookmarkButton } from '@/components/engagement/bookmark-button';
import { resourceRepository } from '@/lib/cms/repository';
import type { ResourceListItem } from '@/lib/cms/types';

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
    projectIds?: string[];
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

interface LinkedProject {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  technologies: string[];
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
  const [linkedProjects, setLinkedProjects] = useState<LinkedProject[]>([]);
  const [linkedResources, setLinkedResources] = useState<ResourceListItem[]>([]);
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
        trackPageView('roadmap', slug!);

        // Fetch linked projects
        const allProjectIds = data.sections.flatMap((s) => s.projectIds || []);
        const uniqueIds = [...new Set(allProjectIds)];
        if (uniqueIds.length > 0) {
          const projSnap = await getDocs(
            query(collection(getFirebaseDb(), 'projects'), where(documentId(), 'in', uniqueIds.slice(0, 10)))
          );
          setLinkedProjects(
            projSnap.docs.map((d) => {
              const pd = d.data();
              return { id: d.id, slug: pd.slug, title: pd.title, difficulty: pd.difficulty, technologies: pd.technologies || [] };
            })
          );
        }
        // Fetch related resources
        resourceRepository.listPublished().then(all => {
          setLinkedResources(all.filter(r => r.tags.includes(slug!) || r.tags.includes(data.slug)).slice(0, 6));
        }).catch(() => {});

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
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
              <Clock className="w-4 h-4" /> {roadmap.totalTime}
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
              <BookOpen className="w-4 h-4" /> {totalTopics} topics across {roadmap.stages.length} stages
            </span>
            {slug && <ViewCounter type="roadmap" slug={slug} />}
            {slug && <BookmarkButton type="roadmap" slug={slug} title={roadmap.title} />}
          </div>
        </div>

        <div className="mt-12">
          <InteractiveRoadmap roadmap={roadmap} />
        </div>

        {/* Linked Projects */}
        {linkedProjects.length > 0 && (
          <div className="mt-16 border-t border-[var(--border-soft)] pt-12">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-purple-500" />
              Related Projects
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Practice what you learn by building these projects.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {linkedProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/projects/view?slug=${proj.slug}`}
                  className="group p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-purple-600 transition-colors">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-500">
                      {proj.difficulty}
                    </span>
                  </div>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {proj.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Linked Resources */}
        {linkedResources.length > 0 && (
          <div className="mt-16 border-t border-[var(--border-soft)] pt-12">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Related Resources
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Deep-dive into concepts covered in this roadmap.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {linkedResources.map((res) => (
                <Link
                  key={res.id}
                  href={`/resources/view?slug=${res.slug}`}
                  className="group p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                    {res.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-500 capitalize">
                      {res.category.replace('-', ' ')}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)]">{res.readTime} min</span>
                  </div>
                  {res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {res.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
