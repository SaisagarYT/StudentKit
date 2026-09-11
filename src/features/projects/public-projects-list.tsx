'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase/client';
import Link from 'next/link';
import {
  Clock, Code2, FolderOpen, Search, ArrowRight, Sparkles,
  Filter, Layers, Hammer, Rocket
} from 'lucide-react';
import { BookmarkButton } from '@/components/engagement/bookmark-button';
import { cn } from '@/lib/utils';

interface PublicProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  technologies: string[];
  featured: boolean;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  advanced: { label: 'Advanced', color: 'text-orange-600', bg: 'bg-orange-500/10' },
  expert: { label: 'Expert', color: 'text-red-600', bg: 'bg-red-500/10' },
};

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

import { staticProjects } from '@/config/projects';

export function PublicProjectsList() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');

  useEffect(() => {
    async function load() {
      try {
        const q = query(
          collection(getFirebaseDb(), 'projects'),
          where('status', '==', 'published'),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProjects(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                slug: data.slug,
                title: data.title,
                shortDescription: data.shortDescription ?? '',
                category: data.category ?? '',
                difficulty: data.difficulty ?? 'beginner',
                estimatedDuration: data.estimatedDuration ?? '',
                technologies: data.technologies ?? [],
                featured: data.featured ?? false,
              };
            })
          );
          return;
        }
      } catch {
        // Firestore not configured or offline — fall through to static fallback
      }

      // Fallback to staticProjects
      setProjects(
        staticProjects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          shortDescription: p.shortDescription,
          category: p.category,
          difficulty: p.difficulty,
          estimatedDuration: p.estimatedDuration,
          technologies: p.technologies,
          featured: p.featured,
        }))
      );
      setLoading(false);
    }
    load().finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = projects;
    if (difficulty !== 'all') {
      result = result.filter((p) => p.difficulty === difficulty);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, search, difficulty]);

  const featuredProjects = filtered.filter((p) => p.featured);
  const regularProjects = filtered.filter((p) => !p.featured);

  const stats = {
    total: projects.length,
    beginner: projects.filter((p) => p.difficulty === 'beginner').length,
    intermediate: projects.filter((p) => p.difficulty === 'intermediate').length,
    advanced: projects.filter((p) => p.difficulty === 'advanced').length,
  };

  return (
    <div>
      {/* Hero header */}
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-5">
          <Hammer className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Build & Learn
          </span>
        </div>
        <h1 className="text-h1 font-bold tracking-tight">
          Project{' '}
          <span className="font-serif italic font-normal">Ideas</span>
        </h1>
        <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
          Curated projects with architecture guidance, milestones, and real-world stacks.
          Build your portfolio one project at a time.
        </p>
      </div>

      {/* Stats row */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-[var(--accent-dark)]" />
              <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Total</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">{stats.total}</span>
          </div>
          <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Beginner</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">{stats.beginner}</span>
          </div>
          <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Intermediate</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">{stats.intermediate}</span>
          </div>
          <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="w-4 h-4 text-orange-500" />
              <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Advanced</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">{stats.advanced}</span>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={cn(
                'px-3 py-1.5 rounded-sm text-[11px] font-semibold transition-all border',
                difficulty === d
                  ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] border-[var(--accent-dark)]'
                  : 'text-[var(--text-secondary)] border-[var(--border-soft)] hover:border-[var(--border-default)]'
              )}
            >
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] animate-pulse">
              <div className="flex gap-2 mb-4">
                <div className="h-5 w-16 rounded-sm bg-[var(--border-soft)]" />
                <div className="h-5 w-14 rounded-sm bg-[var(--border-soft)]" />
              </div>
              <div className="h-5 w-3/4 rounded-sm bg-[var(--border-soft)] mb-3" />
              <div className="h-4 w-full rounded-sm bg-[var(--border-soft)] mb-2" />
              <div className="h-4 w-2/3 rounded-sm bg-[var(--border-soft)] mb-4" />
              <div className="flex gap-1.5">
                <div className="h-5 w-12 rounded-sm bg-[var(--border-soft)]" />
                <div className="h-5 w-14 rounded-sm bg-[var(--border-soft)]" />
                <div className="h-5 w-10 rounded-sm bg-[var(--border-soft)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 rounded-sm border border-dashed border-[var(--border-soft)]">
          <FolderOpen className="w-12 h-12 mx-auto text-[var(--text-subtle)] mb-4 opacity-40" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {search || difficulty !== 'all' ? 'No matching projects' : 'Projects coming soon'}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
            {search || difficulty !== 'all'
              ? 'Try a different search or filter.'
              : 'Curated learning projects are being added. Check back soon!'}
          </p>
          <Link
            href="/open-source"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-sm text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
          >
            <Code2 className="w-4 h-4" />
            Explore Open Source Projects
          </Link>
        </div>
      )}

      {/* Featured Projects */}
      {!loading && featuredProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            Featured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </div>
      )}

      {/* Regular Projects */}
      {!loading && regularProjects.length > 0 && (
        <div>
          {featuredProjects.length > 0 && (
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-4">
              All Projects
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, featured }: { project: PublicProject; featured?: boolean }) {
  const diffConfig = DIFFICULTY_CONFIG[project.difficulty] || DIFFICULTY_CONFIG.beginner;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        'group relative flex flex-col p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all',
        featured && 'md:p-7'
      )}
    >
      <div className="absolute top-4 right-4">
        <BookmarkButton type="project" slug={project.slug} title={project.title} size="sm" />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className={cn('px-2 py-0.5 rounded-sm text-[10px] font-semibold', diffConfig.color, diffConfig.bg)}>
          {diffConfig.label}
        </span>
        {project.featured && (
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-[var(--accent-primary)]/10 text-[var(--accent-dark)]">
            Featured
          </span>
        )}
      </div>

      {/* Title & Description */}
      <h3 className={cn(
        'font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors',
        featured ? 'text-lg' : 'text-base'
      )}>
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 flex-1">
        {project.shortDescription}
      </p>

      {/* Technologies */}
      {project.technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded-sm text-[10px] font-medium bg-[var(--bg-subtle)] text-[var(--text-subtle)] border border-[var(--border-soft)]">
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="px-2 py-0.5 rounded-sm text-[10px] text-[var(--text-subtle)]">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[var(--text-subtle)]">
          {project.estimatedDuration && (
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" />
              {project.estimatedDuration}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
          View
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}
