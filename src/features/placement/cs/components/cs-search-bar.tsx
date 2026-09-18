'use client';

import { Search, X } from 'lucide-react';

interface CsSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  matchedCount?: number;
  totalCount?: number;
}

export function CsSearchBar({
  search,
  onSearchChange,
  placeholder,
  matchedCount,
  totalCount,
}: CsSearchBarProps) {
  const isFiltering = search.trim().length > 0;

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-subtle)]">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-28 py-2.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-dark)] transition-colors shadow-sm"
      />

      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-2">
        {isFiltering && (
          <>
            {typeof matchedCount === 'number' && (
              <span className="text-[11px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                {matchedCount}{totalCount ? `/${totalCount}` : ''}
              </span>
            )}
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

