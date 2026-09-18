'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Trash2, Globe, Pencil,
  Code2, Brain, MoreVertical, ArrowUpRight,
  UploadCloud, CheckCircle2, EyeOff, Terminal
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { dsaProblemRepository } from '@/lib/cms/repository';
import { useAuth } from '@/lib/firebase/auth';
import { dsaTopicsMeta } from '@/config/placement/dsa-topics';
import { CANONICAL_DSA_PROBLEMS } from '@/config/placement/canonical-dsa-problems';
import type { DsaProblemListItem, DsaDifficulty } from '@/lib/cms/types';

const difficultyConfig: Record<DsaDifficulty, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  medium: { label: 'Medium', color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export function DsaDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<DsaProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const items = await dsaProblemRepository.list();
      setProblems(items);
    } catch (err) {
      console.error('Failed to load DSA problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleSeedCanonical = async () => {
    if (!user) return;
    if (!confirm('This will seed the canonical Blind 75 / essential problems into your database. Existing problems with the same slug will not be duplicated. Proceed?')) {
      return;
    }

    setSeeding(true);
    setSeedMessage('Seeding canonical problems...');
    try {
      const existingSlugs = new Set(problems.map(p => p.slug));
      let added = 0;

      for (const canon of CANONICAL_DSA_PROBLEMS) {
        if (!existingSlugs.has(canon.slug)) {
          await dsaProblemRepository.create({
            title: canon.title,
            slug: canon.slug,
            description: canon.description || '',
            difficulty: canon.difficulty,
            category: canon.category,
            link: canon.link,
            videoSolution: canon.videoSolution || '',
            tags: canon.tags || [],
            companies: canon.companies || [],
            editorial: canon.editorial || '',
            hints: canon.hints || [],
            approach: canon.approach || '',
            timeComplexity: canon.timeComplexity || '',
            spaceComplexity: canon.spaceComplexity || '',
            codeSolutions: canon.codeSolutions || {},
            curatedLists: canon.curatedLists || ['blind-75'],
            order: canon.order || 0,
            status: 'published',
          }, user.uid);
          added++;
        }
      }

      setSeedMessage(`Successfully seeded ${added} problems!`);
      await fetchProblems();
      setTimeout(() => setSeedMessage(null), 4000);
    } catch (err) {
      console.error('Seeding error:', err);
      setSeedMessage('Failed to seed problems. Check console.');
      setTimeout(() => setSeedMessage(null), 4000);
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleStatus = async (problem: DsaProblemListItem) => {
    if (!user) return;
    const nextStatus = problem.status === 'published' ? 'draft' : 'published';
    try {
      await dsaProblemRepository.update(problem.id, { status: nextStatus }, user.uid);
      setProblems(prev => prev.map(p => p.id === problem.id ? { ...p, status: nextStatus } : p));
      setActionMenuId(null);
    } catch (err) {
      console.error('Failed to toggle problem status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    try {
      await dsaProblemRepository.remove(id);
      setProblems(prev => prev.filter(p => p.id !== id));
      setActionMenuId(null);
    } catch (err) {
      console.error('Failed to delete problem:', err);
    }
  };

  const filtered = useMemo(() => {
    return problems.filter(p => {
      const matchSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        p.companies.some(c => c.toLowerCase().includes(search.toLowerCase()));

      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchSearch && matchCat && matchDiff && matchStatus;
    });
  }, [problems, search, categoryFilter, difficultyFilter, statusFilter]);

  const stats = useMemo(() => {
    const easy = problems.filter(p => p.difficulty === 'easy').length;
    const medium = problems.filter(p => p.difficulty === 'medium').length;
    const hard = problems.filter(p => p.difficulty === 'hard').length;
    const blind75 = problems.filter(p => p.curatedLists?.includes('blind-75')).length;
    const withCode = problems.filter(p => p.codeSolutions && Object.keys(p.codeSolutions).length > 0).length;

    return { total: problems.length, easy, medium, hard, blind75, withCode };
  }, [problems]);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-[var(--accent-dark)]" />
            DSA Problem Sheet
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Curate algorithmic patterns, multi-language solutions, and company tags for students.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSeedCanonical}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-medium border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-dark)] hover:bg-[var(--bg-subtle)] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            title="Import Blind 75 / Canonical Problems into database"
          >
            <UploadCloud className={`w-3.5 h-3.5 text-[var(--accent-dark)] ${seeding ? 'animate-bounce' : ''}`} />
            {seeding ? 'Seeding...' : 'Seed Canonical (Blind 75)'}
          </button>
          <Link
            href="/admin/dsa/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Problem
          </Link>
        </div>
      </div>

      {/* Seed notification */}
      {seedMessage && (
        <div className="mb-6 p-3 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-mono text-[var(--text-primary)] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {seedMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Code2 className="w-4 h-4 text-[var(--text-subtle)]" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-subtle)] uppercase">Total</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{stats.total}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Tracked Problems</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">Easy</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{stats.easy}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Foundational</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">Medium</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{stats.medium}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Interview Core</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold uppercase">Hard</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{stats.hard}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Advanced Edge</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <Terminal className="w-4 h-4 text-[var(--accent-dark)]" />
            <span className="text-[10px] font-mono font-bold text-[var(--accent-dark)] uppercase">Blind 75</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{stats.blind75}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">{stats.withCode} with multi-code</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Search by title, tag, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--accent-dark)] transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Pattern Selector */}
          <div className="w-44">
            <Select
              value={categoryFilter}
              onValueChange={(val) => setCategoryFilter(val)}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="All 14 Patterns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All 14 Patterns</SelectItem>
                {dsaTopicsMeta.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selector */}
          <div className="w-36">
            <Select
              value={difficultyFilter}
              onValueChange={(val) => setDifficultyFilter(val)}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Selector */}
          <div className="w-32">
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Problem List Table / Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-xs text-[var(--text-subtle)] font-mono">Loading DSA problems...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-8">
          <Code2 className="w-12 h-12 text-[var(--text-subtle)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {problems.length === 0 ? 'No problems in database yet' : 'No matching problems'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            {problems.length === 0
              ? 'Click "Seed Canonical (Blind 75)" to automatically populate essential interview problems with multi-language solutions.'
              : 'Try clearing your search query or pattern filters.'}
          </p>
          {problems.length === 0 && (
            <button
              onClick={handleSeedCanonical}
              className="mt-4 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
            >
              Seed Canonical Problems Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(problem => {
            const diff = difficultyConfig[problem.difficulty] || difficultyConfig.medium;
            const topic = dsaTopicsMeta.find(t => t.id === problem.category);
            const langs = problem.codeSolutions ? Object.keys(problem.codeSolutions) : [];

            return (
              <div
                key={problem.id}
                className="group relative flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-dark)]/40 transition-all shadow-xs"
              >
                {/* Pattern Category Icon */}
                <div className="w-9 h-9 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-[var(--text-primary)]" />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {problem.title}
                    </h3>

                    {/* Difficulty Badge */}
                    <span
                      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm shrink-0"
                      style={{ color: diff.color, background: diff.bg }}
                    >
                      {diff.label}
                    </span>

                    {/* Blind 75 tag */}
                    {problem.curatedLists?.includes('blind-75') && (
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm bg-[var(--accent-dark)]/10 text-[var(--accent-dark)] border border-[var(--accent-dark)]/20 shrink-0">
                        Blind 75
                      </span>
                    )}

                    {/* Status Pill */}
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${
                        problem.status === 'published'
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                          : 'text-amber-700 dark:text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {problem.status}
                    </span>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[11px] text-[var(--text-subtle)]">
                    <span className="font-medium text-[var(--text-secondary)]">
                      {topic?.title || problem.category}
                    </span>

                    {problem.timeComplexity && (
                      <span className="font-mono text-[10px] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded-sm">
                        Time: {problem.timeComplexity}
                      </span>
                    )}

                    {/* Language badges */}
                    {langs.length > 0 && (
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <Terminal className="w-3 h-3 text-[var(--text-subtle)]" />
                        <span>{langs.join(', ')}</span>
                      </div>
                    )}

                    {/* Companies */}
                    {problem.companies && problem.companies.length > 0 && (
                      <span className="hidden sm:inline font-mono text-[10px] text-[var(--text-subtle)] truncate max-w-[200px]">
                        {problem.companies.slice(0, 3).join(', ')}
                        {problem.companies.length > 3 && ` +${problem.companies.length - 3}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/admin/dsa/edit?id=${problem.id}`}
                    className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-[var(--accent-dark)] hover:bg-[var(--accent-dark)]/10 transition-colors"
                    title="Edit Problem & Solutions"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>

                  {problem.link && (
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Open Practice Link"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* More menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActionMenuId(actionMenuId === problem.id ? null : problem.id)}
                      className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {actionMenuId === problem.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActionMenuId(null)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xl py-1">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(problem)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                          >
                            {problem.status === 'published' ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Publish</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(problem.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

