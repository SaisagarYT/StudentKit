'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Clock, BookOpen, ArrowRight,
  ChevronDown, ChevronRight, Share2,
  FolderGit2, Brain, CheckCircle2, HelpCircle,
  Lightbulb, AlertTriangle, ExternalLink, GitBranch,
  Copy, Check, Sparkles, Layers, ListOrdered, PlayCircle
} from 'lucide-react';
import { NewsletterCapture } from '@/components/engagement/newsletter-capture';
import { resourceRepository } from '@/lib/cms/repository';
import { trackPageView } from '@/lib/cms/analytics';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import type { CmsResource, ResourceListItem, Difficulty } from '@/lib/cms/types';

const DIFFICULTY_TOKEN: Record<Difficulty, { color: string; bg: string }> = {
  beginner:     { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
  intermediate: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)' },
  advanced:     { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  expert:       { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
};

export function ResourceViewer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [resource, setResource] = useState<CmsResource | null>(null);
  const [domainResources, setDomainResources] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // CS Fundamentals interactive state
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Project Guide interactive progress state
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch resource & domain list for next/prev navigation
  useEffect(() => {
    if (!slug) {
      setError('No resource specified.');
      setLoading(false);
      return;
    }

    resourceRepository.getBySlug(slug).then(r => {
      if (!r) {
        setError('Resource not found.');
        setLoading(false);
        return;
      }
      setResource(r);
      setLoading(false);
      trackPageView('resource', slug);

      // Load student progress from localStorage for project milestones
      if (r.resourceType === 'project-guide' && typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(`sk-project-progress-${r.slug}`);
          if (saved) setCompletedMilestones(JSON.parse(saved));
        } catch {}
      }

      // Fetch all published resources in same domain to calculate Next & Previous articles
      const targetDomain = r.resourceType || (r.category === 'guides' ? 'project-guide' : 'cs-fundamentals');
      resourceRepository.listPublished({ resourceType: targetDomain }).then(items => {
        setDomainResources(items);
      }).catch(() => {});
    }).catch((err) => {
      console.error('[ResourceViewer]', err);
      setError('Failed to load resource.');
      setLoading(false);
    });
  }, [slug]);

  // Dynamic SEO meta
  useEffect(() => {
    if (!resource) return;
    document.title = `${resource.title} | StudentKit`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = resource.shortDescription?.slice(0, 155) || `${resource.title} - comprehensive engineering guide`;
    if (metaDesc) metaDesc.setAttribute('content', desc);
    else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = desc;
      document.head.appendChild(meta);
    }
  }, [resource]);

  // Extract Table of Contents from content
  const tableOfContents = useMemo(() => {
    if (!resource?.content) return [];
    const lines = resource.content.split('\n');
    const headings: { id: string; text: string; level: number }[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[#*`_\[\]]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        headings.push({ id, text, level });
      }
    });

    return headings;
  }, [resource?.content]);

  // Toggle question accordion
  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle milestone completion
  const toggleMilestone = (id: string) => {
    if (!resource) return;
    setCompletedMilestones(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`sk-project-progress-${resource.slug}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Share link copy
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-mono text-[var(--text-subtle)]">Loading technical guide...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="py-20 text-center container-main max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 text-[var(--text-subtle)] mx-auto mb-3 opacity-40" />
        <h2 className="text-base font-bold text-[var(--text-primary)]">{error || 'Resource not found'}</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          This article might be in draft mode or the URL might have changed.
        </p>
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Resources Hub
        </Link>
      </div>
    );
  }

  const isCs = (resource.resourceType || (resource.category === 'guides' ? 'project-guide' : 'cs-fundamentals')) === 'cs-fundamentals';
  const diff = DIFFICULTY_TOKEN[resource.difficulty] || DIFFICULTY_TOKEN.beginner;

  // Next & Previous article navigation in same subject/track
  const currentIndex = domainResources.findIndex(r => r.slug === resource.slug);
  const prevArticle = currentIndex > 0 ? domainResources[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < domainResources.length - 1 ? domainResources[currentIndex + 1] : null;

  // Milestones completed calculation
  const totalMilestones = resource.milestones?.length || 0;
  const finishedCount = resource.milestones?.filter(m => completedMilestones[m.id]).length || 0;
  const milestonePercent = totalMilestones > 0 ? Math.round((finishedCount / totalMilestones) * 100) : 0;

  return (
    <div className="relative pb-24">
      {/* Top Fixed Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent-dark)] z-50 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="container-main max-w-6xl pt-6 md:pt-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[var(--text-subtle)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-[var(--text-primary)] transition-colors">
            Resources
          </Link>
          <span>/</span>
          <span className="capitalize text-[var(--text-secondary)]">
            {isCs ? (resource.subject?.replace('-', ' ') || 'CS Fundamentals') : (resource.projectTrack?.replace('-', ' ') || 'Project Guides')}
          </span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px] sm:max-w-md">
            {resource.title}
          </span>
        </nav>

        {/* Article Header Header Section */}
        <div className="pb-8 mb-8 border-b border-[var(--border-soft)]">
          {/* Domain & Level Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-sm border ${
                isCs
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isCs ? <Brain className="w-3.5 h-3.5" /> : <FolderGit2 className="w-3.5 h-3.5" />}
              {isCs ? 'CS Fundamentals & Placement' : 'Project Guide & Engineering Blueprint'}
            </span>

            <span
              className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm"
              style={{ color: diff.color, background: diff.bg }}
            >
              {resource.difficulty}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-subtle)] font-mono">
              <Clock className="w-3.5 h-3.5" />
              {resource.readTime} min read
            </span>

            {isCs && (resource.interviewQuestions?.length ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-sm border border-amber-500/20">
                <HelpCircle className="w-3 h-3" />
                {resource.interviewQuestions?.length} Interview Questions
              </span>
            )}

            {!isCs && totalMilestones > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {totalMilestones} Milestones
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            {resource.title}
          </h1>

          {/* Executive Summary */}
          {resource.shortDescription && (
            <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-4xl">
              {resource.shortDescription}
            </p>
          )}

          {/* Metadata & Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--border-soft)] text-xs text-[var(--text-subtle)]">
            <div className="flex items-center gap-4">
              <span>Published on StudentKit</span>
              {resource.updatedAt && (
                <span>Updated {new Date(resource.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = window.location.href;
                  const text = `${resource.title} - on StudentKit`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Reader Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===================== MAIN CONTENT COLUMN (LEFT) ===================== */}
          <div className="lg:col-span-8 space-y-10 min-w-0">
            {/* Project Guide Action Bar & Tech Stack */}
            {!isCs && (
              <div className="space-y-4 p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
                {/* Actions & Repos */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {resource.githubStarterUrl && (
                    <a
                      href={resource.githubStarterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-base)] border border-[var(--border-soft)] text-[var(--text-primary)] transition-colors shadow-xs"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Starter Code Repo
                      <ExternalLink className="w-3 h-3 text-[var(--text-subtle)]" />
                    </a>
                  )}

                  {resource.githubCompletedUrl && (
                    <a
                      href={resource.githubCompletedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--bg-base)] border border-[var(--border-soft)] text-[var(--text-primary)] transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Completed Solution
                      <ExternalLink className="w-3 h-3 text-[var(--text-subtle)]" />
                    </a>
                  )}

                  {resource.liveDemoUrl && (
                    <a
                      href={resource.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-bold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Application Demo
                    </a>
                  )}
                </div>

                {/* Tech Stack Pills */}
                {resource.techStack && resource.techStack.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border-soft)]">
                    <span className="text-[10px] font-mono uppercase text-[var(--text-subtle)] block mb-1.5 font-bold">
                      Built With
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {resource.techStack.map(item => (
                        <span
                          key={item}
                          className="px-2.5 py-1 text-xs font-mono rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Visual Architecture Diagram (if present) */}
            {(resource.diagramUrl || resource.architectureDiagram) && (
              <div className="p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Visual Architecture & System Blueprint
                </h3>
                <div className="overflow-hidden rounded-sm border border-[var(--border-soft)] bg-[var(--bg-base)] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resource.diagramUrl || resource.architectureDiagram}
                    alt={`${resource.title} Architecture Diagram`}
                    className="w-full h-auto object-contain max-h-[420px] mx-auto rounded-xs"
                  />
                </div>
                {resource.architectureOverview && (
                  <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {resource.architectureOverview}
                  </p>
                )}
              </div>
            )}

            {/* Core Markdown Concept Guide */}
            {resource.content && (
              <div className="prose-content">
                <MarkdownRenderer content={resource.content} />
              </div>
            )}

            {/* ===================== CS FUNDAMENTALS: REVISION CHEAT SHEET ===================== */}
            {isCs && resource.cheatSheetBullets && resource.cheatSheetBullets.length > 0 && (
              <div className="p-6 rounded-md bg-amber-500/10 border border-amber-500/25 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    5-Minute Pre-Interview Cheat Sheet
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Essential definitions, core invariants, and formula summaries to review 5 minutes before your interview.
                </p>
                <ul className="space-y-2">
                  {resource.cheatSheetBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] leading-relaxed">
                      <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ===================== CS FUNDAMENTALS: INTERVIEW Q&AS ===================== */}
            {isCs && resource.interviewQuestions && resource.interviewQuestions.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[var(--border-soft)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      Frequently Asked Placement Interview Questions ({resource.interviewQuestions.length})
                    </h3>
                    <p className="text-xs text-[var(--text-subtle)] mt-1">
                      Click any question to inspect the detailed answer, edge cases, and code proofs.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {resource.interviewQuestions.map((q, i) => {
                    const isExpanded = expandedQuestions[q.id || String(i)];
                    return (
                      <div
                        key={q.id || i}
                        className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden shadow-xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(q.id || String(i))}
                          className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                              Q{i + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                                {q.question}
                              </h4>
                              {q.companies && q.companies.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                  <span className="text-[10px] text-[var(--text-subtle)]">Asked at:</span>
                                  {q.companies.map(c => (
                                    <span key={c} className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {q.frequency && (
                              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-sm ${
                                q.frequency === 'high' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              }`}>
                                {q.frequency} Frequency
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[var(--text-subtle)]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-5 border-t border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs leading-relaxed">
                            <MarkdownRenderer content={q.answer} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================== CS FUNDAMENTALS: COMMON PITFALLS ===================== */}
            {isCs && resource.commonPitfalls && resource.commonPitfalls.length > 0 && (
              <div className="p-5 rounded-md bg-rose-500/10 border border-rose-500/25 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    Common Traps & Anti-Patterns Interviewers Look For
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {resource.commonPitfalls.map((pitfall, i) => (
                    <li key={i} className="text-xs text-[var(--text-primary)] leading-relaxed flex items-start gap-2">
                      <span className="text-rose-600 dark:text-rose-400 shrink-0">⚠️</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ===================== PROJECT GUIDE: MILESTONES ROADMAP ===================== */}
            {!isCs && resource.milestones && resource.milestones.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-[var(--border-soft)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Milestone Implementation Roadmap ({resource.milestones.length} Phases)
                    </h3>
                    <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                      Check off milestones as you build. Progress is automatically saved in your browser.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32 h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-soft)]">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${milestonePercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {milestonePercent}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {resource.milestones.map((milestone, idx) => {
                    const isDone = !!completedMilestones[milestone.id];
                    return (
                      <div
                        key={milestone.id || idx}
                        className={`rounded-md border transition-all ${
                          isDone
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-[var(--border-soft)] bg-[var(--bg-surface)]'
                        } p-5 shadow-xs space-y-3`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleMilestone(milestone.id)}
                              className={`w-5 h-5 rounded-xs flex items-center justify-center border transition-all mt-0.5 cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-[var(--border-default)] hover:border-emerald-400'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                                  Milestone {idx + 1}
                                </span>
                                <h4 className={`text-sm font-bold ${isDone ? 'line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                                  {milestone.title}
                                </h4>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {milestone.objective}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Milestone Implementation Code & Steps */}
                        <div className="pt-3 border-t border-[var(--border-soft)]">
                          <MarkdownRenderer content={milestone.content} />
                        </div>

                        {/* Verification Checkpoint Test */}
                        {milestone.checkpoint && (
                          <div className="p-3 rounded-sm bg-[var(--bg-subtle)] border border-emerald-500/20 flex items-center gap-2.5 text-xs font-mono text-emerald-700 dark:text-emerald-400">
                            <PlayCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <div>
                              <span className="font-bold uppercase text-[9px] block text-[var(--text-subtle)]">
                                Verification Checkpoint
                              </span>
                              <span>{milestone.checkpoint}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===================== PROJECT GUIDE: CHALLENGES ===================== */}
            {!isCs && resource.challenges && resource.challenges.length > 0 && (
              <div className="p-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Resume-Boosting Production Challenges
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Complete these optional production extensions to stand out in software engineering interviews.
                </p>
                <ul className="space-y-2 mt-2">
                  {resource.challenges.map((challenge, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-primary)] leading-relaxed">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">🚀</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ===================== CHAPTER NAVIGATION: PREV & NEXT ===================== */}
            <div className="pt-8 border-t border-[var(--border-soft)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link
                    href={`/resources/view?slug=${prevArticle.slug}`}
                    className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-dark)] transition-all group"
                  >
                    <span className="text-[10px] font-mono text-[var(--text-subtle)] flex items-center gap-1 mb-1">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      Previous Article
                    </span>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] line-clamp-1 transition-colors">
                      {prevArticle.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    href={`/resources/view?slug=${nextArticle.slug}`}
                    className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-dark)] transition-all text-right group"
                  >
                    <span className="text-[10px] font-mono text-[var(--text-subtle)] flex items-center justify-end gap-1 mb-1">
                      Next Article
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] line-clamp-1 transition-colors">
                      {nextArticle.title}
                    </h4>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-12">
              <NewsletterCapture />
            </div>
          </div>

          {/* ===================== SIDEBAR: STICKY TABLE OF CONTENTS & META (RIGHT) ===================== */}
          <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-5">
            {/* Table of Contents Card */}
            {tableOfContents.length > 0 && (
              <div className="p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                  Table of Contents
                </h3>
                <nav className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                  {tableOfContents.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      className={`block text-xs py-1 transition-colors truncate ${
                        item.level === 3 ? 'pl-3 text-[11px]' : 'font-medium'
                      } text-[var(--text-subtle)] hover:text-[var(--accent-dark)]`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Quick Summary Card */}
            <div className="p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Article Overview
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[var(--text-subtle)]">
                  <span>Domain</span>
                  <span className="font-semibold text-[var(--text-primary)] capitalize">
                    {isCs ? 'CS Fundamentals' : 'Project Guide'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-subtle)]">
                  <span>Difficulty</span>
                  <span className="font-mono font-bold uppercase" style={{ color: diff.color }}>
                    {resource.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-subtle)]">
                  <span>Read Time</span>
                  <span className="font-mono text-[var(--text-primary)]">{resource.readTime} minutes</span>
                </div>
                {isCs && (resource.interviewQuestions?.length ?? 0) > 0 && (
                  <div className="flex items-center justify-between text-[var(--text-subtle)]">
                    <span>Interview Q&As</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{resource.interviewQuestions?.length}</span>
                  </div>
                )}
                {!isCs && totalMilestones > 0 && (
                  <div className="flex items-center justify-between text-[var(--text-subtle)]">
                    <span>Milestone Steps</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{totalMilestones}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--border-soft)]">
                <Link
                  href="/resources"
                  className="w-full py-2 rounded-sm text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--text-inverse)] border border-[var(--border-soft)] transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
