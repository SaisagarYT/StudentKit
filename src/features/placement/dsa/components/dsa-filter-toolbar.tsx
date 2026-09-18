'use client';

import { Search, X, Filter } from 'lucide-react';

interface DsaFilterToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  difficultyFilter: string;
  onDifficultyChange: (val: string) => void;
  counts: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export function DsaFilterToolbar({
  search,
  onSearchChange,
  difficultyFilter,
  onDifficultyChange,
  counts,
}: DsaFilterToolbarProps) {
  const difficulties = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'easy', label: 'Easy', count: counts.easy },
    { id: 'medium', label: 'Medium', count: counts.medium },
    { id: 'hard', label: 'Hard', count: counts.hard },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-[var(--text-subtle)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search problems, patterns, or companies..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2 text-xs rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-dark)] transition-colors shadow-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-[var(--text-primary)] p-0.5"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Difficulty Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <span className="text-[11px] font-mono text-[var(--text-subtle)] mr-1 hidden md:flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {difficulties.map((diff) => {
          const isActive = difficultyFilter === diff.id;
          return (
            <button
              key={diff.id}
              onClick={() => onDifficultyChange(diff.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all shadow-sm ${
                isActive
                  ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-soft)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{diff.label}</span>
              <span
                className={`text-[10px] font-mono ${
                  isActive ? 'opacity-70' : 'text-[var(--text-subtle)]'
                }`}
              >
                {diff.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

