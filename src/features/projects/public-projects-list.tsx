'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import { AnimatePresence } from 'motion/react';
import { FolderOpen } from 'lucide-react';
import { curatedProjects, type CuratedProject } from '@/config/projects';
import { ProjectsHeader } from './components/projects-header';
import { ProjectsFilterBar, type DifficultyFilter } from './components/projects-filter-bar';
import { ProjectCard } from './components/project-card';

export function PublicProjectsList() {
  const [projects, setProjects] = useState<CuratedProject[]>(curatedProjects);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    async function loadFirebaseProjects() {
      try {
        setLoading(true);
        const q = query(
          collection(getFirebaseDb(), 'projects'),
          where('status', '==', 'published'),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remote = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
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
            } as CuratedProject;
          });

          // Combine remote projects with curated static projects without duplicates
          const remoteSlugs = new Set(remote.map((p) => p.slug));
          const merged = [
            ...remote,
            ...curatedProjects.filter((p) => !remoteSlugs.has(p.slug)),
          ];
          setProjects(merged);
        }
      } catch {
        // Fallback gracefully to curatedProjects
      } finally {
        setLoading(false);
      }
    }

    loadFirebaseProjects();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    let result = projects;
    if (difficulty !== 'all') {
      result = result.filter((p) => p.difficulty === difficulty);
    }
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, search, difficulty, category]);

  const featuredProjects = useMemo(
    () => filtered.filter((p) => p.featured),
    [filtered]
  );
  const regularProjects = useMemo(
    () => filtered.filter((p) => !p.featured),
    [filtered]
  );

  const stats = useMemo(
    () => ({
      total: projects.length,
      beginner: projects.filter((p) => p.difficulty === 'beginner').length,
      intermediate: projects.filter((p) => p.difficulty === 'intermediate').length,
      advanced: projects.filter((p) => p.difficulty === 'advanced').length,
      expert: projects.filter((p) => p.difficulty === 'expert').length,
    }),
    [projects]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <ProjectsHeader
        total={stats.total}
        beginnerCount={stats.beginner}
        intermediateCount={stats.intermediate}
        advancedCount={stats.advanced}
        expertCount={stats.expert}
      />

      {/* Filter Bar */}
      <ProjectsFilterBar
        search={search}
        onSearchChange={setSearch}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        selectedCategory={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] animate-pulse"
            >
              <div className="flex gap-2 mb-4">
                <div className="h-5 w-16 rounded-sm bg-[var(--border-soft)]" />
                <div className="h-5 w-14 rounded-sm bg-[var(--border-soft)]" />
              </div>
              <div className="h-5 w-3/4 rounded-sm bg-[var(--border-soft)] mb-3" />
              <div className="h-4 w-full rounded-sm bg-[var(--border-soft)] mb-2" />
              <div className="h-4 w-2/3 rounded-sm bg-[var(--border-soft)] mb-4" />
              <div className="flex gap-1.5 pt-3 border-t border-[var(--border-soft)]">
                <div className="h-5 w-12 rounded-sm bg-[var(--border-soft)]" />
                <div className="h-5 w-14 rounded-sm bg-[var(--border-soft)]" />
                <div className="h-5 w-10 rounded-sm bg-[var(--border-soft)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 rounded-md border border-dashed border-[var(--border-soft)] bg-[var(--bg-surface)] p-8">
          <FolderOpen className="w-10 h-10 mx-auto text-[var(--text-subtle)] mb-3 opacity-50" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            No matching projects found
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search query, difficulty tier, or category filter to discover projects.
          </p>
          {(search || difficulty !== 'all' || category !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setDifficulty('all');
                setCategory('all');
              }}
              className="mt-4 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Featured Projects Grid */}
      {!loading && featuredProjects.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Featured Flagship Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Regular Projects Grid */}
      {!loading && regularProjects.length > 0 && (
        <div>
          {featuredProjects.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-default)]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                All Projects & Architecture Blueprints
              </h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {regularProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
