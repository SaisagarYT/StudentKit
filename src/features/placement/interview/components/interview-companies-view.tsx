'use client';

import { useState, useMemo } from 'react';
import { Search, X, SearchX, ChevronRight } from 'lucide-react';
import type { CompanyPattern } from '@/config/placement/interview';

interface InterviewCompaniesViewProps {
  companies: CompanyPattern[];
}

export function InterviewCompaniesView({ companies }: InterviewCompaniesViewProps) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((c) => {
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) {
        return false;
      }
      if (!query) return true;

      return (
        c.company.toLowerCase().includes(query) ||
        c.rounds.some((r) => r.toLowerCase().includes(query)) ||
        c.tips.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [companies, search, difficultyFilter]);

  const difficultyMeta: Record<
    string,
    { label: string; textClass: string; borderClass: string }
  > = {
    medium: {
      label: 'Medium',
      textClass: 'text-[var(--color-success)]',
      borderClass: 'border-[var(--border-soft)]',
    },
    hard: {
      label: 'Hard',
      textClass: 'text-[var(--color-warning)]',
      borderClass: 'border-[var(--border-soft)]',
    },
    'very-hard': {
      label: 'Very Hard',
      textClass: 'text-[var(--color-error)]',
      borderClass: 'border-[var(--border-soft)]',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-subtle)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies, interview rounds, evaluation criteria..."
            className="w-full pl-10 pr-24 py-2.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-dark)] transition-colors shadow-sm"
          />
          {search && (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-2">
              <span className="text-[11px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                {filteredCompanies.length} companies
              </span>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setDifficultyFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              difficultyFilter === 'all'
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Companies ({companies.length})
          </button>
          <button
            type="button"
            onClick={() => setDifficultyFilter('medium')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              difficultyFilter === 'medium'
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            Medium ({companies.filter((c) => c.difficulty === 'medium').length})
          </button>
          <button
            type="button"
            onClick={() => setDifficultyFilter('hard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              difficultyFilter === 'hard'
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            Hard ({companies.filter((c) => c.difficulty === 'hard').length})
          </button>
          <button
            type="button"
            onClick={() => setDifficultyFilter('very-hard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              difficultyFilter === 'very-hard'
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            Very Hard ({companies.filter((c) => c.difficulty === 'very-hard').length})
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.map((company) => {
            const diff = difficultyMeta[company.difficulty] || difficultyMeta.hard;

            return (
              <div
                key={company.company}
                className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 shadow-sm transition-all hover:border-[var(--border-default)] flex flex-col justify-between"
              >
                <div>
                  {/* Company Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-soft)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-lg shrink-0">
                        {company.logo}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">
                          {company.company}
                        </h3>
                        <span className="text-[11px] text-[var(--text-subtle)]">
                          {company.rounds.length} Interview Rounds
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] border ${diff.borderClass} ${diff.textClass}`}
                    >
                      {diff.label}
                    </span>
                  </div>

                  {/* Interview Rounds Sequence */}
                  <div className="mb-4">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                      Hiring Loop Breakdown
                    </span>
                    <div className="space-y-1.5">
                      {company.rounds.map((round, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
                        >
                          <span className="w-4 h-4 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[10px] font-mono font-bold flex items-center justify-center text-[var(--text-subtle)] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{round}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Specific Tips */}
                  <div>
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                      Insider Focus & Strategy
                    </span>
                    <div className="space-y-1.5">
                      {company.tips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-[var(--border-soft)] rounded-md bg-[var(--bg-surface)]">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-subtle)] mb-3">
            <SearchX className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No company interview patterns matched &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search query or reset the difficulty filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDifficultyFilter('all');
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--border-soft)] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

