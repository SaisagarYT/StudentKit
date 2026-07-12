'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { tools, searchTools } from '@/config/tools';
import { categories } from '@/config/categories';
import { type ToolCategory } from '@/types/tool';

function getIcon(name: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className="w-4 h-4" /> : null;
}

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim() ? searchTools(query) : tools;

  // Group by category when no search
  const grouped = !query.trim()
    ? categories.map((cat) => ({
        category: cat,
        tools: results.filter((t) => t.category === cat.slug),
      }))
    : null;

  const flatResults = grouped
    ? grouped.flatMap((g) => g.tools)
    : results;

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion && dialogRef.current && overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        gsap.fromTo(dialogRef.current, { opacity: 0, y: -10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out' });
      }
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      router.push(`/tools/${slug}`);
    },
    [router]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = flatResults[selectedIndex];
      if (selected) handleSelect(selected.slug);
    }
  };

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[var(--text-primary)]/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="flex items-start justify-center pt-[15vh] px-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
          className="relative w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl shadow-lg border border-[var(--border-soft)] overflow-hidden"
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-[var(--border-soft)]">
            <Search className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools..."
              className="flex-1 h-12 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded font-mono">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {query.trim() ? (
              // Flat search results
              results.length > 0 ? (
                <div className="space-y-0.5">
                  {results.map((tool, i) => (
                    <SearchResultItem
                      key={tool.slug}
                      slug={tool.slug}
                      title={tool.title}
                      description={tool.shortDescription}
                      icon={tool.icon}
                      category={tool.category}
                      isSelected={i === selectedIndex}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-[var(--text-subtle)]">
                    No tools found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )
            ) : (
              // Grouped by category
              grouped?.map((group) => (
                <div key={group.category.slug} className="mb-2 last:mb-0">
                  <p className="px-3 py-1.5 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                    {group.category.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.tools.map((tool) => {
                      const globalIndex = flatResults.indexOf(tool);
                      return (
                        <SearchResultItem
                          key={tool.slug}
                          slug={tool.slug}
                          title={tool.title}
                          description={tool.shortDescription}
                          icon={tool.icon}
                          category={tool.category}
                          isSelected={globalIndex === selectedIndex}
                          onSelect={handleSelect}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--border-soft)] text-xs text-[var(--text-subtle)]">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-[var(--bg-subtle)] rounded font-mono">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-[var(--bg-subtle)] rounded font-mono">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-[var(--bg-subtle)] rounded font-mono">esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultItem({
  slug,
  title,
  description,
  icon,
  category,
  isSelected,
  onSelect,
}: {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: ToolCategory;
  isSelected: boolean;
  onSelect: (slug: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <button
      ref={ref}
      onClick={() => onSelect(slug)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
        isSelected
          ? 'bg-[var(--bg-subtle)]'
          : 'hover:bg-[var(--bg-subtle)]/60'
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] shrink-0">
        {getIcon(icon)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{title}</p>
        <p className="text-xs text-[var(--text-subtle)] truncate">{description}</p>
      </div>
      {isSelected && (
        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0" />
      )}
    </button>
  );
}
