'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  Search, BookOpen, Brain,
  Clock, ArrowRight, FolderGit2, HelpCircle, CheckCircle2,
  Lightbulb, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { resourceRepository } from '@/lib/cms/repository';
import type { ResourceListItem, ResourceDomainType, CsSubject, ProjectTrack, Difficulty } from '@/lib/cms/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const CS_SUBJECTS: { id: string; label: string; value?: CsSubject; color: string; bg: string }[] = [
  { id: 'all', label: 'All CS Subjects', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
  { id: 'operating-systems', label: 'Operating Systems', value: 'operating-systems', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { id: 'dbms', label: 'DBMS', value: 'dbms', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
  { id: 'computer-networks', label: 'Computer Networks', value: 'computer-networks', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  { id: 'oops', label: 'OOP Concepts', value: 'oops', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'system-design', label: 'System Design', value: 'system-design', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
];

const PROJECT_TRACKS: { id: string; label: string; value?: ProjectTrack; color: string; bg: string }[] = [
  { id: 'all', label: 'All Tracks', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  { id: 'full-stack', label: 'Full Stack', value: 'full-stack', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  { id: 'backend', label: 'Backend Engineering', value: 'backend', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
  { id: 'frontend', label: 'Frontend & UI', value: 'frontend', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { id: 'ai-ml', label: 'AI & ML Systems', value: 'ai-ml', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  { id: 'mobile', label: 'Mobile Apps', value: 'mobile', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'devops', label: 'DevOps & Cloud', value: 'devops', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
];

const DIFFICULTY_TOKEN: Record<Difficulty, { color: string; bg: string }> = {
  beginner:     { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  intermediate: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  advanced:     { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  expert:       { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
};

const ITEMS_PER_PAGE = 12;

export function ResourcesHub() {
  const [resources, setResources] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Filters
  const [activeDomain, setActiveDomain] = useState<ResourceDomainType>('cs-fundamentals');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    resourceRepository.listPublished().then(items => {
      setResources(items);
      setLoading(false);
    }).catch((err) => {
      console.error('[ResourcesHub] Failed to load resources:', err);
      setLoading(false);
    });
  }, []);

  // Filter items based on domain, sub-taxonomy, difficulty, and search query
  const filtered = useMemo(() => {
    return resources.filter(r => {
      // 1. Domain match
      const rDomain = r.resourceType || (r.category === 'guides' ? 'project-guide' : 'cs-fundamentals');
      if (rDomain !== activeDomain) return false;

      // 2. Sub-taxonomy match
      if (activeDomain === 'cs-fundamentals') {
        if (selectedSubject !== 'all' && r.subject !== selectedSubject) return false;
      } else {
        if (selectedTrack !== 'all' && r.projectTrack !== selectedTrack) return false;
      }

      // 3. Difficulty match
      if (selectedDifficulty !== 'all' && r.difficulty !== selectedDifficulty) return false;

      // 4. Search query match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesTags = r.tags.some(t => t.toLowerCase().includes(q));
        const matchesStack = r.techStack?.some(ts => ts.toLowerCase().includes(q)) ?? false;
        const matchesSubject = r.subject?.toLowerCase().includes(q) ?? false;
        const matchesTrack = r.projectTrack?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesTags && !matchesStack && !matchesSubject && !matchesTrack) {
          return false;
        }
      }

      return true;
    });
  }, [resources, activeDomain, selectedSubject, selectedTrack, selectedDifficulty, search]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeDomain, selectedSubject, selectedTrack, selectedDifficulty, search]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const csTotal = resources.filter(r => (r.resourceType || (r.category === 'guides' ? 'project-guide' : 'cs-fundamentals')) === 'cs-fundamentals').length;
  const projectTotal = resources.filter(r => (r.resourceType || (r.category === 'guides' ? 'project-guide' : 'cs-fundamentals')) === 'project-guide').length;

  return (
    <div className="py-8 md:py-14 min-h-screen">
      <div className="container-main max-w-6xl">
        {/* Hub Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            <span className="text-xs font-semibold text-[var(--accent-dark)] uppercase tracking-wider">
              Technical Resources Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            CS Fundamentals &amp; <span className="font-serif italic text-[var(--accent-dark)] font-normal">Engineering</span> Blueprints
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Curated, industry-standard learning portals. Theoretical placement interview mastery and step-by-step production architecture guides.
          </p>
        </motion.div>

        {/* Primary Two-Domain Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {/* Domain 1: CS Fundamentals */}
          <button
            type="button"
            onClick={() => setActiveDomain('cs-fundamentals')}
            className={`p-4 rounded-sm text-left transition-all cursor-pointer border relative ${
              activeDomain === 'cs-fundamentals'
                ? 'bg-blue-500/10 border-blue-500/40 shadow-sm'
                : 'bg-[var(--bg-surface)] border-[var(--border-soft)] hover:border-[var(--border-default)]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-sm ${activeDomain === 'cs-fundamentals' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)]'}`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    Placement & CS Fundamentals
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold">
                      {csTotal} Topics
                    </span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                    OS, DBMS, Computer Networks, OOP & Top FAANG Interview Q&As
                  </p>
                </div>
              </div>
            </div>
            {activeDomain === 'cs-fundamentals' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-b-sm" />
            )}
          </button>

          {/* Domain 2: Project Guides */}
          <button
            type="button"
            onClick={() => setActiveDomain('project-guide')}
            className={`p-4 rounded-sm text-left transition-all cursor-pointer border relative ${
              activeDomain === 'project-guide'
                ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                : 'bg-[var(--bg-surface)] border-[var(--border-soft)] hover:border-[var(--border-default)]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-sm ${activeDomain === 'project-guide' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)]'}`}>
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    Project Guides & Engineering Blueprints
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 font-semibold">
                      {projectTotal} Guides
                    </span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                    Full-Stack, Distributed Backend, Micro-SaaS & Verified Checkpoints
                  </p>
                </div>
              </div>
            </div>
            {activeDomain === 'project-guide' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-b-sm" />
            )}
          </button>
        </div>

        {/* Sub-Filters Bar: Taxonomy Chips & Search */}
        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] mb-8 space-y-3">
          {/* Top Row: Search + Difficulty Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeDomain === 'cs-fundamentals'
                    ? 'Search CS concepts, concurrency, deadlock, indexing, protocols...'
                    : 'Search project blueprints, tech stack (e.g. Next.js, Redis, Docker)...'
                }
                className="w-full pl-9 pr-4 py-2 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--accent-dark)] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-36">
                <Select
                  value={selectedDifficulty}
                  onValueChange={(val) => setSelectedDifficulty(val)}
                >
                  <SelectTrigger className="h-8 text-xs bg-[var(--bg-subtle)]">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {activeDomain === 'cs-fundamentals' ? (
              CS_SUBJECTS.map((sub) => {
                const isSelected = selectedSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-sm whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40 shadow-xs'
                        : 'border-[var(--border-soft)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })
            ) : (
              PROJECT_TRACKS.map((trk) => {
                const isSelected = selectedTrack === trk.id;
                return (
                  <button
                    key={trk.id}
                    onClick={() => setSelectedTrack(trk.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-sm whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-xs'
                        : 'border-[var(--border-soft)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {trk.label}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs font-mono text-[var(--text-subtle)]">Loading knowledge portal...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-8">
            <BookOpen className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-3 opacity-40" />
            <p className="text-sm font-bold text-[var(--text-primary)]">
              No matching resources found
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
              Try adjusting your search terms or reset the difficulty and subject filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedSubject('all');
                setSelectedTrack('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-sm bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--text-inverse)] border border-[var(--border-soft)] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {paginatedItems.map((resource, idx) => {
              const isCs = activeDomain === 'cs-fundamentals';
              const diff = DIFFICULTY_TOKEN[resource.difficulty] || DIFFICULTY_TOKEN.beginner;

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                >
                  <Link
                    href={`/resources/view?slug=${resource.slug}`}
                    className="group flex flex-col p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-md transition-all duration-200 h-full relative"
                  >
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isCs && resource.subject ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
                            {resource.subject.replace('-', ' ')}
                          </span>
                        ) : resource.projectTrack ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                            {resource.projectTrack.replace('-', ' ')}
                          </span>
                        ) : null}

                        <span
                          className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-sm"
                          style={{ color: diff.color, background: diff.bg }}
                        >
                          {resource.difficulty}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-subtle)] shrink-0">
                        <Clock className="w-3 h-3" />
                        {resource.readTime} min
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors line-clamp-2 mb-2 leading-snug">
                      {resource.title}
                    </h3>

                    {/* Domain Highlights Pill */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {isCs ? (
                        <>
                          {(resource.interviewQuestionCount ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-sm border border-amber-500/20">
                              <HelpCircle className="w-3 h-3" />
                              {resource.interviewQuestionCount} Interview Q&amp;As
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-sm">
                            <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            Cheat Sheet
                          </span>
                        </>
                      ) : (
                        <>
                          {(resource.milestoneCount ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              {resource.milestoneCount} Milestones
                            </span>
                          )}
                          {resource.techStack && resource.techStack.length > 0 && (
                            <span className="text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-sm truncate max-w-[140px]">
                              {resource.techStack.slice(0, 2).join(', ')}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-[var(--border-soft)]">
                        {resource.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Arrow Footer */}
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[var(--text-subtle)] group-hover:text-[var(--accent-dark)] transition-colors">
                      <span>{isCs ? 'Read Deep-Dive & Q&As' : 'Explore Blueprint & Code'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border-soft)]">
            <p className="text-xs font-mono text-[var(--text-subtle)]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} resources
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-sm text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border border-[var(--accent-dark)] shadow-xs'
                      : 'border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
