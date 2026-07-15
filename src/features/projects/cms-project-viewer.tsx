'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { trackPageView } from '@/lib/cms/analytics';
import { ArrowLeft, Clock, Code2, Loader2, CheckCircle2, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { ViewCounter } from '@/components/engagement/view-counter';
import { BookmarkButton } from '@/components/engagement/bookmark-button';

interface CmsProjectData {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  projectType: string;
  technologies: string[];
  skills: string[];
  features: { title: string; description: string }[];
  milestones: { title: string; description: string; tasks: string[] }[];
  architecture: string;
  folderStructure: string;
  relatedRoadmapIds: string[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-500 bg-green-500/10',
  intermediate: 'text-yellow-500 bg-yellow-500/10',
  advanced: 'text-orange-500 bg-orange-500/10',
  expert: 'text-red-500 bg-red-500/10',
};

export function CmsProjectViewer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [project, setProject] = useState<CmsProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug || !isFirebaseConfigured) {
      setLoading(false);
      setError('Project not found');
      return;
    }

    async function load() {
      try {
        const q = query(
          collection(getFirebaseDb(), 'projects'),
          where('slug', '==', slug),
          where('status', '==', 'published'),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setError('Project not found');
          return;
        }
        setProject(snap.docs[0].data() as CmsProjectData);
        trackPageView('project', slug!);
      } catch {
        setError('Failed to load project');
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

  if (error || !project) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--text-secondary)]">{error}</p>
        <Link href="/projects" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-dark)] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container-main">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All Projects
        </Link>

        <div className="max-w-4xl">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <FolderOpen className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-h1 font-bold tracking-tight">{project.title}</h1>
              <p className="mt-2 text-body-lg text-[var(--text-secondary)] leading-relaxed">{project.description}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${DIFFICULTY_COLORS[project.difficulty] || ''}`}>
              {project.difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
              <Clock className="w-4 h-4" /> {project.estimatedDuration}
            </span>
            {slug && <ViewCounter type="project" slug={slug} />}
            {slug && <BookmarkButton type="project" slug={slug} title={project.title} />}
            {project.category && (
              <span className="text-sm text-[var(--text-subtle)]">{project.category}</span>
            )}
          </div>

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Features</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {project.features.map((feature, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{feature.title}</h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones */}
          {project.milestones?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Milestones</h2>
              <div className="space-y-4">
                {project.milestones.map((milestone, i) => (
                  <div key={i} className="relative pl-8 pb-4 border-l-2 border-[var(--border-soft)] last:border-transparent">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-dark)] flex items-center justify-center">
                      <span className="text-[8px] font-bold text-[var(--accent-primary)]">{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{milestone.title}</h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{milestone.description}</p>
                    {milestone.tasks?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {milestone.tasks.map((task, ti) => (
                          <li key={ti} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            <CheckCircle2 className="w-3 h-3 text-[var(--text-subtle)] shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Architecture</h2>
              <pre className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs text-[var(--text-secondary)] overflow-x-auto whitespace-pre-wrap">
                {project.architecture}
              </pre>
            </div>
          )}

          {/* Folder Structure */}
          {project.folderStructure && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Folder Structure</h2>
              <pre className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs text-[var(--text-secondary)] overflow-x-auto font-mono">
                {project.folderStructure}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
