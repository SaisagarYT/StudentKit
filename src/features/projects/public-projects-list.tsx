'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase/client';
import Link from 'next/link';
import { Clock, Code2, FolderOpen, Search } from 'lucide-react';

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

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-500 bg-green-500/10',
  intermediate: 'text-yellow-500 bg-yellow-500/10',
  advanced: 'text-orange-500 bg-orange-500/10',
  expert: 'text-red-500 bg-red-500/10',
};

export function PublicProjectsList() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const q = query(
          collection(getFirebaseDb(), 'projects'),
          where('status', '==', 'published'),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
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
      } catch {
        // Firestore not configured yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = search
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : projects;

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">Projects</h1>
        <p className="mt-3 text-[var(--text-secondary)] max-w-xl mx-auto">
          Curated learning projects with guided milestones, architecture guidance, and roadmap connections.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--text-subtle)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 mx-auto text-[var(--text-subtle)] mb-4" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {search ? 'No matching projects' : 'Projects coming soon'}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
            {search
              ? 'Try a different search term.'
              : 'Curated learning projects are being added. Check back soon!'}
          </p>
          <Link
            href="/open-source"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-md text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
          >
            <Code2 className="w-4 h-4" />
            Explore Open Source Projects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${DIFFICULTY_COLORS[project.difficulty] || ''}`}>
                  {project.difficulty}
                </span>
                {project.featured && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {project.title}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)] line-clamp-2">
                {project.shortDescription}
              </p>
              <div className="mt-4 flex items-center gap-3 text-[var(--text-subtle)]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {project.estimatedDuration}
                </span>
              </div>
              {project.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] text-[var(--text-subtle)]">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
