'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { tools } from '@/config/tools';
import { categories } from '@/config/categories';
import { type ToolCategory } from '@/types/tool';

function getIcon(name: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className="w-4 h-4" /> : null;
}

type FilterCategory = 'all' | ToolCategory;

export function ToolDirectory() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const filteredTools = useMemo(() => {
    let filtered = tools;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.includes(q))
      );
    }

    return filtered;
  }, [search, activeCategory]);

  return (
    <section className="section-spacing">
      <div className="container-main">
        <div>
          <h2 className="text-h2 font-bold tracking-tight text-[var(--text-primary)]">
            All tools.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] max-w-lg">
            Find exactly what you need — search or filter by category.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full h-11 pl-10 pr-4 text-sm border border-[var(--border-default)] rounded-sm bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <CategoryPill
              label="All"
              isActive={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            />
            {categories.map((cat) => (
              <CategoryPill
                key={cat.slug}
                label={cat.title}
                isActive={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
              />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex items-center gap-4 p-4 border border-[var(--border-soft)] rounded-sm bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)] transition-all"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)] group-hover:bg-[var(--accent-dark)] group-hover:text-[var(--text-inverse)] transition-colors shrink-0">
                {getIcon(tool.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {tool.title}
                </h3>
                <p className="text-xs text-[var(--text-subtle)] truncate">
                  {tool.shortDescription}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredTools.length === 0 && (
          <div className="mt-12 text-center py-16">
            <p className="text-[var(--text-secondary)]">
              No tools found for &ldquo;{search}&rdquo;
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="mt-3 text-sm font-medium text-[var(--text-primary)] underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
        isActive
          ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] shadow-xs'
          : 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </button>
  );
}
