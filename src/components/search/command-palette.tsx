'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, X, CornerDownLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { tools } from '@/config/tools';
import { categories } from '@/config/categories';
import { mainNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { trackSearch } from '@/lib/analytics';

function getIcon(name: string, className?: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-4 h-4'} /> : null;
}

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  type: 'tool' | 'category' | 'page';
  keywords: string[];
}

const searchItems: SearchItem[] = [
  ...tools.map((t) => ({
    id: `tool-${t.slug}`,
    title: t.title,
    description: t.shortDescription,
    href: `/tools/${t.slug}`,
    icon: t.icon,
    type: 'tool' as const,
    keywords: t.keywords,
  })),
  ...categories.map((c) => ({
    id: `cat-${c.slug}`,
    title: `${c.title} Tools`,
    description: c.description,
    href: `/categories/${c.slug}`,
    icon: c.icon,
    type: 'category' as const,
    keywords: [c.slug, c.title.toLowerCase()],
  })),
  ...mainNavItems.map((n) => ({
    id: `page-${n.href}`,
    title: n.label,
    description: n.description || '',
    href: n.href,
    icon: 'FileText',
    type: 'page' as const,
    keywords: [n.label.toLowerCase()],
  })),
];

function fuzzyMatch(query: string, text: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();

  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 60;

  let score = 0;
  let qi = 0;
  let consecutive = 0;

  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      score += 10 + consecutive * 5;
      consecutive++;
      qi++;
    } else {
      consecutive = 0;
    }
  }

  return qi === q.length ? score : 0;
}

function searchAndRank(query: string): SearchItem[] {
  if (!query.trim()) return searchItems.slice(0, 8);

  const scored = searchItems.map((item) => {
    const titleScore = fuzzyMatch(query, item.title);
    const descScore = fuzzyMatch(query, item.description) * 0.5;
    const keywordScore = Math.max(
      ...item.keywords.map((k) => fuzzyMatch(query, k) * 0.7),
      0
    );
    const total = Math.max(titleScore, descScore, keywordScore);
    return { item, score: total };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((s) => s.item);
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchAndRank(query), [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navigate = useCallback(
    (href: string) => {
      if (query.trim()) trackSearch(query.trim());
      onClose();
      router.push(href);
    },
    [onClose, router, query]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]) {
            navigate(results[activeIndex].href);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, activeIndex, navigate, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  const typeLabels: Record<string, string> = {
    tool: 'Tool',
    category: 'Category',
    page: 'Page',
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[var(--bg-dark)]/60 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative flex items-start justify-center pt-[15vh] px-4">
        <div
          ref={dialogRef}
          className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-soft)]">
            <Search className="w-5 h-5 text-[var(--text-subtle)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools, categories, pages..."
              className="flex-1 bg-transparent text-base text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-subtle)]" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center px-2 py-1 text-[11px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-md">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
            {results.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-[var(--text-subtle)]">
                  No results for &quot;{query}&quot;
                </p>
                <p className="mt-1 text-xs text-[var(--text-subtle)]">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div role="listbox">
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={i === activeIndex}
                    data-active={i === activeIndex}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'flex items-center gap-3 w-full px-5 py-3 text-left transition-colors',
                      i === activeIndex
                        ? 'bg-[var(--accent-primary)]/10'
                        : 'hover:bg-[var(--bg-subtle)]'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors',
                        i === activeIndex
                          ? 'bg-[var(--accent-primary)]/20'
                          : 'bg-[var(--bg-subtle)]'
                      )}
                    >
                      {getIcon(
                        item.icon,
                        'w-4 h-4 text-[var(--text-secondary)]'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--text-subtle)] truncate">
                        {item.description}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-full shrink-0">
                      {typeLabels[item.type]}
                    </span>
                    {i === activeIndex && (
                      <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-[var(--border-soft)] bg-[var(--bg-subtle)]/50">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
              <CornerDownLeft className="w-3 h-3" />
              Open
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
              <span className="inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded">↑↓</span>
              Navigate
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
              <span className="inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded">esc</span>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
