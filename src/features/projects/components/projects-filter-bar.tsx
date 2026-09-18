'use client';

import { Search, X, Filter, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface ProjectsFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  difficulty: DifficultyFilter;
  onDifficultyChange: (val: DifficultyFilter) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: string[];
}

const DIFFICULTIES: { id: DifficultyFilter; label: string }[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' },
];

export function ProjectsFilterBar({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: ProjectsFilterBarProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar + Difficulty Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, architectures, or technologies (e.g., Next.js, Kafka, Redis)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--border-default)] focus:ring-1 focus:ring-[var(--border-default)] transition-all shadow-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
          <Filter className="w-3.5 h-3.5 text-[var(--text-subtle)] mr-1 hidden sm:block shrink-0" />
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onDifficultyChange(d.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all border shrink-0 cursor-pointer',
                difficulty === d.id
                  ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)] shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-soft)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Row */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <Tag className="w-3.5 h-3.5 text-[var(--text-subtle)] mr-0.5 shrink-0" />
          <span className="text-[11px] font-mono font-medium text-[var(--text-subtle)] uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={cn(
              'px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors border cursor-pointer shrink-0',
              selectedCategory === 'all'
                ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-default)] font-semibold'
                : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:border-[var(--border-soft)] hover:text-[var(--text-primary)]'
            )}
          >
            All Tracks
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors border cursor-pointer shrink-0',
                selectedCategory === cat
                  ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] border-[var(--border-default)] font-semibold'
                  : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:border-[var(--border-soft)] hover:text-[var(--text-primary)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

