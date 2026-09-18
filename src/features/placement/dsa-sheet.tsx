'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { logXpEvent } from '@/lib/xp';
import { dsaTopicsMeta, type DsaTopicMeta } from '@/config/placement/dsa-topics';
import { dsaProblemRepository, resourceRepository } from '@/lib/cms/repository';
import type { DsaProblemListItem, DsaCategory } from '@/lib/cms/types';

import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { DsaStatsBar } from './dsa/components/dsa-stats-bar';
import { DsaFilterToolbar } from './dsa/components/dsa-filter-toolbar';
import { DsaTopicAccordion } from './dsa/components/dsa-topic-accordion';
import { DsaSolutionDrawer } from './dsa/components/dsa-solution-drawer';

const STORAGE_KEY = 'sk-dsa-progress';

interface TopicWithProblems extends DsaTopicMeta {
  problems: DsaProblemListItem[];
}

function loadProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    emitProgressChanged();
  } catch {}
}

export function DsaSheet() {
  const { user: authUser } = useUserAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedHints, setExpandedHints] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [problems, setProblems] = useState<DsaProblemListItem[]>([]);
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeSolutionProblem, setActiveSolutionProblem] = useState<DsaProblemListItem | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  useEffect(() => {
    Promise.all([
      dsaProblemRepository.listPublished(),
      resourceRepository.listPublished('dsa'),
    ])
      .then(([probs, resources]) => {
        if (probs.length > 0) {
          setProblems(probs);
        } else if (resources.length > 0) {
          const derived: DsaProblemListItem[] = resources.map((r, i) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            difficulty:
              r.difficulty === 'beginner'
                ? ('easy' as const)
                : r.difficulty === 'intermediate'
                ? ('medium' as const)
                : ('hard' as const),
            category: (r.tags.find((t) =>
              dsaTopicsMeta.some((topic) => topic.id === t)
            ) || 'arrays-hashing') as DsaCategory,
            link: '',
            videoSolution: '',
            tags: r.tags,
            companies: [],
            editorial: r.slug,
            order: i,
            status: 'published' as const,
          }));
          setProblems(derived);
        } else {
          setProblems([]);
        }
        setPublishedSlugs(new Set(resources.map((r) => r.slug)));
        setLoading(false);
      })
      .catch((err) => {
        console.error('[DsaSheet] Failed to load problems from backend:', err);
        setProblems([]);
        setLoading(false);
      });
  }, []);

  const toggleProblem = useCallback((slug: string) => {
    setProgress((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      saveProgress(next);
      if (next[slug]) {
        logXpEvent('DSA_PROBLEM', 'Problem solved');
      }
      return next;
    });
  }, []);

  const topicsWithProblems: TopicWithProblems[] = useMemo(() => {
    return dsaTopicsMeta.map((topic) => ({
      ...topic,
      problems: problems.filter((p) => p.category === topic.id),
    }));
  }, [problems]);

  const totalProblems = problems.length;
  const completedCount = useMemo(() => {
    return problems.filter((p) => progress[p.slug]).length;
  }, [progress, problems]);
  const overallPercent =
    totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  const difficultyCounts = useMemo(() => {
    return {
      all: problems.length,
      easy: problems.filter((p) => p.difficulty === 'easy').length,
      medium: problems.filter((p) => p.difficulty === 'medium').length,
      hard: problems.filter((p) => p.difficulty === 'hard').length,
    };
  }, [problems]);

  const filteredTopics = useMemo(() => {
    return topicsWithProblems
      .map((topic) => {
        let filtered = topic.problems;

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q)) ||
              p.companies.some((c) => c.toLowerCase().includes(q))
          );
        }

        if (difficultyFilter !== 'all') {
          filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
        }

        return { ...topic, problems: filtered };
      })
      .filter((t) => t.problems.length > 0);
  }, [topicsWithProblems, search, difficultyFilter]);

  const resetProgress = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      setProgress({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <div className="relative">
      {/* Loading Spinner */}
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-xs font-mono text-[var(--text-subtle)]">
            Loading curated problems...
          </p>
        </div>
      )}

      {/* Empty State if no problems exist */}
      {!loading && problems.length === 0 && (
        <div className="py-20 text-center p-8 rounded-md border border-dashed border-[var(--border-soft)] bg-[var(--bg-surface)] my-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-subtle)] mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            No DSA Problems Published Yet
          </h2>
          <p className="mt-2 text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            Curated algorithm practice problems and editorial solutions added via the Admin Dashboard will appear here.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/placement/cs-fundamentals"
              className="px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
            >
              CS Fundamentals
            </Link>
            <Link
              href="/placement/interview"
              className="px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)] hover:bg-[var(--border-soft)] transition-colors"
            >
              Interview Prep
            </Link>
          </div>
        </div>
      )}

      {!loading && problems.length > 0 && (
        <>
          {/* 1. Sticky Progress Cockpit */}
          <DsaStatsBar
            completedCount={completedCount}
            totalProblems={totalProblems}
            percent={overallPercent}
            mounted={mounted}
            onReset={resetProgress}
            authUser={authUser}
          />

          {/* 2. Filter & Search Toolbar */}
          <DsaFilterToolbar
            search={search}
            onSearchChange={setSearch}
            difficultyFilter={difficultyFilter}
            onDifficultyChange={setDifficultyFilter}
            counts={difficultyCounts}
          />

          {/* 3. Topics Accordion List */}
          <div className="space-y-3.5">
            {filteredTopics.map((topic) => (
              <DsaTopicAccordion
                key={topic.id}
                topic={topic}
                isExpanded={expandedTopic === topic.id}
                onToggle={() =>
                  setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                }
                progress={progress}
                onToggleProblem={toggleProblem}
                expandedHints={expandedHints}
                onToggleHints={(slug) =>
                  setExpandedHints(expandedHints === slug ? null : slug)
                }
                publishedSlugs={publishedSlugs}
                mounted={mounted}
                onOpenSolution={setActiveSolutionProblem}
              />
            ))}
          </div>

          {/* Empty search/filter results */}
          {filteredTopics.length === 0 && (
            <div className="text-center py-16 p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                No problems match your filters
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Try searching for a different keyword, tag, or clearing the difficulty filter.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setDifficultyFilter('all');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:bg-[var(--accent-dark)]/90 transition-all shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Slide-over Solution Drawer */}
      <DsaSolutionDrawer
        problem={activeSolutionProblem}
        onClose={() => setActiveSolutionProblem(null)}
      />
    </div>
  );
}
