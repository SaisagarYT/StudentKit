'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ExternalLink, Check, Filter, ChevronDown, RotateCcw, Trophy, Cloud } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { dsaTopicsMeta, type DsaTopicMeta } from '@/config/placement/dsa-topics';
import { dsaProblemRepository, resourceRepository } from '@/lib/cms/repository';
import type { DsaProblemListItem, ResourceListItem } from '@/lib/cms/types';

const STORAGE_KEY = 'sk-dsa-progress';
const DIFFICULTY_COLORS = {
  easy: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
  medium: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: 'rgba(234, 179, 8, 0.3)' },
  hard: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
};

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

function toPascalCase(str: string) {
  return str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

function getIcon(name: string, className?: string) {
  const key = toPascalCase(name);
  const Icon = Icons[key as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-5 h-5'} /> : null;
}

interface TopicWithProblems extends DsaTopicMeta {
  problems: DsaProblemListItem[];
}

export function DsaSheet() {
  const { user: authUser } = useUserAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [problems, setProblems] = useState<DsaProblemListItem[]>([]);
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  useEffect(() => {
    Promise.all([
      dsaProblemRepository.listPublished(),
      resourceRepository.listPublished('dsa'),
    ]).then(([probs, resources]) => {
      // If dsa-problems collection has data, use it
      if (probs.length > 0) {
        setProblems(probs);
      } else {
        // Fallback: derive problem entries from published resources
        const derived: DsaProblemListItem[] = resources.map((r, i) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          difficulty: r.difficulty === 'beginner' ? 'easy' as const : r.difficulty === 'intermediate' ? 'medium' as const : 'hard' as const,
          category: (r.tags.find(t => dsaTopicsMeta.some(topic => topic.id === t)) || 'arrays-hashing') as any,
          link: '',
          videoSolution: '',
          tags: r.tags,
          companies: [],
          editorial: r.slug,
          order: i,
          status: 'published' as const,
        }));
        setProblems(derived);
      }
      setPublishedSlugs(new Set(resources.map(r => r.slug)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleProblem = useCallback((slug: string) => {
    setProgress(prev => {
      const next = { ...prev, [slug]: !prev[slug] };
      saveProgress(next);
      return next;
    });
  }, []);

  const topicsWithProblems: TopicWithProblems[] = useMemo(() => {
    return dsaTopicsMeta.map(topic => ({
      ...topic,
      problems: problems.filter(p => p.category === topic.id),
    }));
  }, [problems]);

  const totalProblems = problems.length;
  const completedCount = useMemo(() => {
    return problems.filter(p => progress[p.slug]).length;
  }, [progress, problems]);
  const overallPercent = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  const filteredTopics = useMemo(() => {
    return topicsWithProblems.map(topic => {
      let filtered = topic.problems;

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.companies.some(c => c.toLowerCase().includes(q))
        );
      }

      if (difficultyFilter !== 'all') {
        filtered = filtered.filter(p => p.difficulty === difficultyFilter);
      }

      return { ...topic, problems: filtered };
    }).filter(t => t.problems.length > 0);
  }, [topicsWithProblems, search, difficultyFilter]);

  const resetProgress = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      setProgress({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <div className="dsa-sheet">
      <style>{`
        .dsa-sheet { position: relative; }

        .dsa-progress-bar {
          position: sticky;
          top: 64px;
          z-index: 20;
          background: var(--bg-surface);
          border: 1px solid var(--border-soft);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        .dsa-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .dsa-search {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .dsa-search input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border-radius: 8px;
          border: 1px solid var(--border-default);
          background: var(--bg-surface);
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s;
        }

        .dsa-search input:focus {
          border-color: var(--accent-primary);
        }

        .dsa-search input::placeholder {
          color: var(--text-subtle);
        }

        .dsa-search svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-subtle);
        }

        .dsa-diff-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid var(--border-soft);
          background: transparent;
          color: var(--text-subtle);
          cursor: pointer;
          transition: all 0.15s;
        }

        .dsa-diff-btn:hover { color: var(--text-primary); border-color: var(--border-default); }
        .dsa-diff-btn.active { background: var(--accent-dark); color: var(--accent-primary); border-color: var(--accent-dark); }

        .dsa-topic {
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 12px;
          background: var(--bg-surface);
          transition: border-color 0.2s;
        }

        .dsa-topic:hover { border-color: var(--border-default); }

        .dsa-topic-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          cursor: pointer;
          user-select: none;
        }

        .dsa-topic-header:hover { background: var(--bg-subtle); }

        .dsa-topic-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-primary)/10;
          color: var(--accent-dark);
          flex-shrink: 0;
        }

        .dsa-topic-info { flex: 1; min-width: 0; }
        .dsa-topic-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .dsa-topic-desc { font-size: 12px; color: var(--text-subtle); margin-top: 2px; }

        .dsa-topic-progress {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .dsa-topic-progress-bar {
          width: 60px;
          height: 4px;
          border-radius: 2px;
          background: var(--border-soft);
          overflow: hidden;
        }

        .dsa-topic-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--accent-primary);
          transition: width 0.3s ease;
        }

        .dsa-topic-progress-fill.complete { background: #22c55e; }

        .dsa-topic-count {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-subtle);
          font-variant-numeric: tabular-nums;
          min-width: 36px;
          text-align: right;
        }

        .dsa-chevron {
          color: var(--text-subtle);
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .dsa-chevron.open { transform: rotate(180deg); }

        .dsa-problems {
          border-top: 1px solid var(--border-soft);
        }

        .dsa-problem {
          display: grid;
          grid-template-columns: 32px 1fr auto auto auto auto;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border-soft);
          transition: background 0.1s;
        }

        .dsa-problem:last-child { border-bottom: none; }
        .dsa-problem:hover { background: var(--bg-subtle); }

        .dsa-problem-check {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          background: transparent;
          flex-shrink: 0;
        }

        .dsa-problem-check:hover { border-color: var(--accent-primary); }
        .dsa-problem-check.done { background: #22c55e; border-color: #22c55e; }

        .dsa-problem-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dsa-problem-title.done { text-decoration: line-through; color: var(--text-subtle); }

        .dsa-problem-diff {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: capitalize;
        }

        .dsa-problem-companies {
          font-size: 10px;
          color: var(--text-subtle);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dsa-problem-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          color: var(--text-subtle);
          transition: all 0.15s;
        }

        .dsa-problem-link:hover { background: var(--bg-subtle); color: var(--accent-primary); }

        .dsa-topic-resources {
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-soft);
          background: var(--bg-subtle);
        }

        .dsa-pattern {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .dsa-pattern-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-primary);
          padding: 2px 7px;
          border-radius: 4px;
          background: var(--accent-primary)/10;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .dsa-pattern-text {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .dsa-problem-solutions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dsa-sol-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          color: var(--text-subtle);
          transition: all 0.15s;
          text-decoration: none;
        }

        .dsa-sol-btn:hover { transform: scale(1.1); }
        .dsa-sol-video { color: #ef4444; }
        .dsa-sol-video:hover { background: rgba(239, 68, 68, 0.1); }
        .dsa-sol-article { color: #3b82f6; }
        .dsa-sol-article:hover { background: rgba(59, 130, 246, 0.1); }

        @media (max-width: 768px) {
          .dsa-problem {
            grid-template-columns: 28px 1fr auto auto;
            gap: 8px;
          }
          .dsa-problem-companies { display: none; }
          .dsa-problem-link { display: none; }
        }
      `}</style>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-xs text-[var(--text-subtle)]">Loading problems...</p>
        </div>
      )}

      {!loading && problems.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-[var(--text-subtle)]">No problems added yet. Add problems from the admin panel.</p>
        </div>
      )}

      {!loading && problems.length > 0 && (
        <>
          {/* Sticky progress */}
          <div className="dsa-progress-bar">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {mounted ? completedCount : 0}/{totalProblems} solved
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--accent-primary)]">{mounted ? overallPercent : 0}%</span>
                <button onClick={resetProgress} className="p-1.5 rounded-md hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors" title="Reset progress">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="h-2 rounded-full bg-[var(--border-soft)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: mounted ? `${overallPercent}%` : '0%',
                  background: overallPercent === 100 ? '#22c55e' : 'var(--accent-primary)',
                }}
              />
            </div>
          </div>

          {/* Sign-in nudge */}
          {!authUser && mounted && completedCount >= 3 && (
            <Link
              href="/login"
              className="flex items-center gap-2.5 px-4 py-3 mb-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] transition-colors group"
            >
              <Cloud className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                <strong className="text-[var(--text-primary)]">Sign in</strong> to save your progress across devices — never lose your streak
              </span>
            </Link>
          )}

          {/* Filters */}
          <div className="dsa-filters">
            <div className="dsa-search">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems, tags, or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
              {['all', 'easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  className={`dsa-diff-btn ${difficultyFilter === d ? 'active' : ''}`}
                  onClick={() => setDifficultyFilter(d)}
                >
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          {filteredTopics.map(topic => {
            const topicCompleted = topic.problems.filter(p => progress[p.slug]).length;
            const isExpanded = expandedTopic === topic.id;
            const percent = topic.problems.length > 0 ? (topicCompleted / topic.problems.length) * 100 : 0;

            return (
              <div key={topic.id} className="dsa-topic">
                <div
                  className="dsa-topic-header"
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                >
                  <div className="dsa-topic-icon">
                    {getIcon(topic.icon, 'w-5 h-5')}
                  </div>
                  <div className="dsa-topic-info">
                    <div className="dsa-topic-title">{topic.title}</div>
                    <div className="dsa-topic-desc">{topic.description}</div>
                  </div>
                  <div className="dsa-topic-progress">
                    <div className="dsa-topic-progress-bar">
                      <div
                        className={`dsa-topic-progress-fill ${percent === 100 ? 'complete' : ''}`}
                        style={{ width: `${mounted ? percent : 0}%` }}
                      />
                    </div>
                    <span className="dsa-topic-count">{mounted ? topicCompleted : 0}/{topic.problems.length}</span>
                  </div>
                  <ChevronDown className={`dsa-chevron ${isExpanded ? 'open' : ''}`} size={18} />
                </div>

                {isExpanded && (
                  <div className="dsa-problems">
                    {/* Pattern hint */}
                    <div className="dsa-topic-resources">
                      <div className="dsa-pattern">
                        <span className="dsa-pattern-label">Pattern</span>
                        <span className="dsa-pattern-text">{topic.pattern}</span>
                      </div>
                    </div>
                    {topic.problems.map(problem => {
                      const isDone = !!progress[problem.slug];
                      const colors = DIFFICULTY_COLORS[problem.difficulty];
                      return (
                        <div key={problem.id} className="dsa-problem">
                          <button
                            className={`dsa-problem-check ${isDone ? 'done' : ''}`}
                            onClick={() => toggleProblem(problem.slug)}
                          >
                            {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </button>
                          <span className={`dsa-problem-title ${isDone ? 'done' : ''}`}>
                            {problem.title}
                          </span>
                          <span
                            className="dsa-problem-diff"
                            style={{ background: colors.bg, color: colors.text }}
                          >
                            {problem.difficulty}
                          </span>
                          <span className="dsa-problem-companies" title={problem.companies.join(', ')}>
                            {problem.companies.slice(0, 3).join(', ')}
                          </span>
                          <div className="dsa-problem-solutions">
                            {problem.videoSolution && (
                              <a
                                href={problem.videoSolution}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dsa-sol-btn dsa-sol-video"
                                title="Video Solution"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                              </a>
                            )}
                            {problem.editorial && publishedSlugs.has(problem.editorial) && (
                              <Link
                                href={`/resources/view?slug=${problem.editorial}`}
                                className="dsa-sol-btn dsa-sol-article"
                                title="StudentKit Editorial"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                              </Link>
                            )}
                          </div>
                          {problem.link && (
                            <a
                              href={problem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dsa-problem-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredTopics.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--text-subtle)]">No problems match your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
