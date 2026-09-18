'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { trackPageView } from '@/lib/cms/analytics';
import { ArrowLeft, ArrowRight, Clock, Code2, Loader2, FolderOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { ViewCounter } from '@/components/engagement/view-counter';
import { BookmarkButton } from '@/components/engagement/bookmark-button';
import { getProjectBySlug, type CuratedProject } from '@/config/projects';
import { ProjectArchitectureCard } from './components/project-architecture-card';
import { ProjectFolderStructure } from './components/project-folder-structure';
import { ProjectMilestonesTimeline } from './components/project-milestones-timeline';
import { ProjectRelatedRoadmaps } from './components/project-related-roadmaps';
import { ProjectPhaseReader } from './components/project-phase-reader';
import { ProjectCurriculumTree } from './components/project-curriculum-tree';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';

export function CmsProjectViewer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [project, setProject] = useState<CuratedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Checkpoint completion state
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  // Project masterclass overall completion state
  const [isCompleted, setIsCompleted] = useState(false);

  // Load completed tasks & project completion status from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      try {
        const savedTasks = localStorage.getItem(`sk-project-checks-${slug}`);
        if (savedTasks) {
          setCompletedTasks(JSON.parse(savedTasks));
        }
        const savedCompletion = localStorage.getItem(`sk-project-completed-${slug}`);
        setIsCompleted(savedCompletion === 'true');
      } catch {
        // ignore
      }
    }
  }, [slug]);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      if (typeof window !== 'undefined' && slug) {
        try {
          localStorage.setItem(`sk-project-checks-${slug}`, JSON.stringify(next));
          emitProgressChanged();
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, [slug]);

  const toggleComplete = useCallback(() => {
    setIsCompleted((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined' && slug) {
        try {
          localStorage.setItem(`sk-project-completed-${slug}`, next ? 'true' : 'false');
          emitProgressChanged();
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, [slug]);


  const handleSelectPhase = useCallback((idx: number) => {
    setActivePhaseIndex(idx);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (idx > 0) {
        url.searchParams.set('phase', idx.toString());
      } else {
        url.searchParams.delete('phase');
      }
      window.history.replaceState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const p = searchParams.get('phase');
    if (p) {
      const parsed = parseInt(p, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        setActivePhaseIndex(parsed);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Project not specified');
      return;
    }

    // 1. Check static curated fallback first
    const staticProject = getProjectBySlug(slug);
    if (staticProject) {
      setProject(staticProject);
      setLoading(false);
      trackPageView('project', slug);
    }

    // 2. Query Firebase if configured
    if (isFirebaseConfigured) {
      async function loadRemote() {
        try {
          const q = query(
            collection(getFirebaseDb(), 'projects'),
            where('slug', '==', slug),
            where('status', '==', 'published'),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            const data = snap.docs[0].data();
            setProject({
              id: snap.docs[0].id,
              slug: data.slug,
              title: data.title,
              shortDescription: data.shortDescription ?? '',
              description: data.description ?? '',
              category: data.category ?? 'Full-Stack',
              difficulty: data.difficulty ?? 'beginner',
              estimatedDuration: data.estimatedDuration ?? '',
              projectType: data.projectType ?? 'Web Application',
              technologies: data.technologies ?? [],
              skills: data.skills ?? [],
              featured: data.featured ?? false,
              architecture: data.architecture ?? '',
              folderStructure: data.folderStructure ?? '',
              relatedRoadmapIds: data.relatedRoadmapIds ?? [],
              features: data.features ?? [],
              milestones: data.milestones ?? [],
              phases: data.phases ?? staticProject?.phases ?? [],
            } as CuratedProject);
          } else if (!staticProject) {
            setError('Project not found');
          }
        } catch {
          if (!staticProject) {
            setError('Failed to load project');
          }
        } finally {
          setLoading(false);
        }
      }
      loadRemote();
    } else if (!staticProject) {
      setLoading(false);
      setError('Project not found');
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <p className="text-sm text-[var(--text-secondary)]">{error || 'Project not found'}</p>
        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>
      </div>
    );
  }

  const hasPhases = project.phases && project.phases.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Top Header Navigation ── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Projects</span>
        </Link>

        {hasPhases && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[var(--text-subtle)]">
            <span>Viewing:</span>
            <span className="font-semibold text-[var(--accent-dark)]">
              {activePhaseIndex === 0
                ? '00_overview.md'
                : `phase_0${activePhaseIndex}_article.md`}
            </span>
          </div>
        )}
      </div>

      {/* ── 2-Column Responsive Layout ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left / Main Column */}
        <main className="flex-1 min-w-0 w-full space-y-8">
          {activePhaseIndex === 0 ? (
            /* Overview Mode */
            <>
              {/* Main Project Hero Card */}
              <div className="p-6 sm:p-8 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 text-[var(--accent-dark)]">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--accent-dark)] border border-[var(--border-soft)]">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)]">
                        {project.difficulty}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)]">
                          <Star className="w-3 h-3 text-[var(--accent-dark)] fill-[var(--accent-dark)]" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                      {project.title}
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Metadata Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-soft)] text-xs text-[var(--text-subtle)] font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{project.estimatedDuration}</span>
                    </span>
                    {slug && <ViewCounter type="project" slug={slug} />}
                    {slug && <BookmarkButton type="project" slug={slug} title={project.title} size="sm" />}
                  </div>

                  {hasPhases && (
                    <button
                      type="button"
                      onClick={() => handleSelectPhase(1)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                    >
                      <span>Start Masterclass (Phase 1)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Technologies Grid */}
              {project.technologies.length > 0 && (
                <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 shadow-xs">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-3 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                    Technologies & Frameworks
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-sm text-xs font-mono font-medium border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Architecture Spec Card */}
              {project.architecture && (
                <ProjectArchitectureCard architecture={project.architecture} />
              )}

              {/* Recommended Folder Structure */}
              {project.folderStructure && (
                <ProjectFolderStructure structure={project.folderStructure} />
              )}

              {/* Core Features Grid */}
              {project.features && project.features.length > 0 && (
                <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs">
                  <h2 className="text-base font-bold text-[var(--text-primary)] mb-1">
                    Core Feature Requirements
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">
                    Key engineering capabilities to implement for portfolio-readiness
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]"
                      >
                        <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Milestones Timeline */}
              {project.milestones && project.milestones.length > 0 && (
                <ProjectMilestonesTimeline
                  projectSlug={project.slug}
                  milestones={project.milestones}
                />
              )}

              {/* Related Career Roadmaps */}
              <div className="pt-2">
                <ProjectRelatedRoadmaps relatedRoadmapIds={project.relatedRoadmapIds} />
              </div>
            </>
          ) : (
            /* Phase Masterclass Article Mode */
            <ProjectPhaseReader
              project={project}
              activePhaseIndex={activePhaseIndex}
              onSelectPhase={handleSelectPhase}
              completedTasks={completedTasks}
              onToggleTask={toggleTask}
              isCompleted={isCompleted}
              onToggleComplete={toggleComplete}
            />
          )}
        </main>

        {/* Right Column: Sticky Curriculum Folder/File Tree Explorer */}
        {hasPhases && (
          <aside className="w-full lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-24">
            <ProjectCurriculumTree
              project={project}
              activePhaseIndex={activePhaseIndex}
              onSelectPhase={handleSelectPhase}
              completedTasks={completedTasks}
              isCompleted={isCompleted}
              onToggleComplete={toggleComplete}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
