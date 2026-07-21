'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Code, Brain, Briefcase, Layers, Clock, ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { resourceRepository } from '@/lib/cms/repository';
import type { ResourceListItem } from '@/lib/cms/types';

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'dsa', label: 'DSA', icon: Code },
  { id: 'concepts', label: 'CS Concepts', icon: Brain },
  { id: 'guides', label: 'Guides', icon: BookOpen },
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'system-design', label: 'System Design', icon: Layers },
];

const difficultyColors: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
  expert: '#a855f7',
};

export function ResourcesHub() {
  const [resources, setResources] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resourceRepository.listPublished().then(items => {
      setResources(items);
      setLoading(false);
    }).catch((err) => {
      console.error('[ResourcesHub] Failed to load resources:', err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.rh-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo('.rh-card', { opacity: 0, y: 25, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, activeCategory, search]);

  const filtered = resources.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={containerRef} className="py-8 md:py-14">
      <div className="container-main">
        {/* Header */}
        <div className="rh-header max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Resources</span>
          </div>

          <h1 className="text-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Learn <span className="font-serif italic font-normal">Everything</span> Here
          </h1>
          <p className="mt-4 text-body-lg text-[var(--text-primary)] opacity-70 leading-relaxed max-w-2xl">
            Tutorials, DSA editorials, concept deep-dives, and career guides — all on one platform.
            No external links, no tab-switching. Just learn.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20'
                      : 'text-[var(--text-subtle)] border border-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)] hover:border-[rgba(255,255,255,0.12)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-[var(--text-subtle)]">Loading resources...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-subtle)]">
              {resources.length === 0
                ? 'No resources published yet. Add content from the admin dashboard.'
                : 'No resources match your search.'}
            </p>
          </div>
        )}

        {/* Resource Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(resource => (
              <Link
                key={resource.id}
                href={`/resources/view?slug=${resource.slug}`}
                className="rh-card group flex flex-col p-5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ color: difficultyColors[resource.difficulty], background: `${difficultyColors[resource.difficulty]}12` }}
                  >
                    {resource.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
                    <Clock className="w-3 h-3" />
                    {resource.readTime} min
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1.5 line-clamp-2">
                  {resource.title}
                </h3>

                <div className="flex flex-wrap gap-1 mt-auto pt-3">
                  {resource.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                  <span className="text-[10px] font-medium text-[var(--text-subtle)] capitalize">{resource.category.replace('-', ' ')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
