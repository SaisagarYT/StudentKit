'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Video,
  Clock,
  HardDrive,
  Copy,
  Check,
  Code2,
  Building2,
  Lightbulb,
  ChevronRight,
  Eye,
  BookOpen,
  Layers,
  FileText,
  Sparkles,
  Compass,
} from 'lucide-react';
import type { DsaProblemListItem, DsaApproach, DsaResource } from '@/lib/cms/types';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

interface DsaSolutionDrawerProps {
  problem: DsaProblemListItem | null;
  onClose: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python 3',
  javascript: 'JavaScript / TS',
  typescript: 'TypeScript',
  cpp: 'C++',
  java: 'Java',
};

const RESOURCE_TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof FileText; badgeColor: string }
> = {
  article: {
    label: 'Article',
    icon: FileText,
    badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  video: {
    label: 'Video Guide',
    icon: Video,
    badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  visualization: {
    label: 'Visualizer',
    icon: Sparkles,
    badgeColor: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  cheatsheet: {
    label: 'Cheatsheet',
    icon: Layers,
    badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  doc: {
    label: 'Documentation',
    icon: BookOpen,
    badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
};

interface DsaSolutionViewProps {
  problem: DsaProblemListItem;
  isInlinePreview?: boolean;
}

export function DsaSolutionView({ problem, isInlinePreview = false }: DsaSolutionViewProps) {
  const [selectedApproachIndex, setSelectedApproachIndex] = useState(0);
  const [activeLang, setActiveLang] = useState<string>('python');
  const [copied, setCopied] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const approaches: DsaApproach[] =
    problem.approaches && problem.approaches.length > 0
      ? problem.approaches
      : [
          {
            id: 'default',
            title: 'Optimal Approach',
            tag: 'optimal',
            intuition: problem.approach || '',
            timeComplexity: problem.timeComplexity || 'O(N)',
            spaceComplexity: problem.spaceComplexity || 'O(1)',
            codeSolutions: problem.codeSolutions || {},
          },
        ];

  const currentApproach = approaches[selectedApproachIndex] || approaches[0];
  const solutions = currentApproach.codeSolutions || {};
  const languages = Object.keys(solutions).filter((l) => solutions[l]?.trim());
  const effectiveLanguages = languages.length > 0 ? languages : ['python'];
  const currentCode =
    solutions[activeLang] ||
    solutions[effectiveLanguages[0]] ||
    '// Code solution coming soon';

  const handleCopy = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/20';
      case 'medium':
        return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20';
      case 'hard':
        return 'text-[var(--color-error)] bg-[var(--color-error)]/10 border-[var(--color-error)]/20';
      default:
        return 'text-[var(--text-secondary)] bg-[var(--bg-subtle)] border-[var(--border-soft)]';
    }
  };

  const hints = problem.hints || [];
  const resources: DsaResource[] = problem.resources || [];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] text-[var(--text-primary)]">
      {/* Header section */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-soft)] shrink-0 bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`px-2 py-0.5 text-[10px] font-mono font-bold capitalize rounded-sm border ${getDifficultyBadge(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-sm">
            {problem.category ? problem.category.replace(/-/g, ' ') : 'General'}
          </span>
          {problem.curatedLists?.includes('blind-75') && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-sm">
              Blind 75
            </span>
          )}
          {problem.curatedLists?.includes('neetcode-150') && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-sm">
              NeetCode 150
            </span>
          )}
          {isInlinePreview && (
            <span className="ml-auto px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-sm">
              Live Student View
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {problem.title || 'Untitled DSA Problem'}
        </h2>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 mt-3.5 flex-wrap">
          {problem.link && (
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Practice on LeetCode
            </a>
          )}
          {problem.videoSolution && (
            <a
              href={problem.videoSolution}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border border-[var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-rose-500" />
              Video Walkthrough
            </a>
          )}
        </div>
      </div>

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7">
        {/* Problem Statement */}
        {problem.description && (
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
              Problem Statement
            </h3>
            <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-sm text-[var(--text-primary)] leading-relaxed font-sans">
              <MarkdownRenderer content={problem.description} />
            </div>
          </div>
        )}

        {/* Progressive Hints Section */}
        {hints.length > 0 && (
          <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/60">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Progressive Hints ({revealedHints}/{hints.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                Click to reveal without spoilers
              </span>
            </div>

            <div className="space-y-2">
              {hints.map((hint, i) => (
                <div key={i} className="text-xs">
                  {i < revealedHints ? (
                    <div className="flex items-start gap-2 p-2.5 rounded-xs bg-[var(--bg-surface)] border border-[var(--border-soft)]">
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-dark)] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-mono font-bold text-[10px] text-[var(--text-subtle)] block mb-0.5">
                          Hint {i + 1}
                        </span>
                        <p className="text-[var(--text-secondary)] leading-relaxed">{hint}</p>
                      </div>
                    </div>
                  ) : i === revealedHints ? (
                    <button
                      onClick={() => setRevealedHints(i + 1)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xs border border-dashed border-[var(--border-default)] hover:border-[var(--accent-dark)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                      Reveal Hint {i + 1}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solutions & Approaches Section */}
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-dark)]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Algorithmic Solutions &amp; Approaches
              </h3>
            </div>
            {approaches.length > 1 && (
              <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                {approaches.length} Distinct Implementations
              </span>
            )}
          </div>

          {/* Approach Switcher Tabs (When multiple approaches exist) */}
          {approaches.length > 1 && (
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
              {approaches.map((app, idx) => {
                const isActive = selectedApproachIndex === idx;
                return (
                  <button
                    key={app.id || idx}
                    onClick={() => {
                      setSelectedApproachIndex(idx);
                      // Auto-select first available language in new approach
                      const appLangs = Object.keys(app.codeSolutions || {}).filter(
                        (l) => app.codeSolutions[l]?.trim()
                      );
                      if (appLangs.length > 0 && !appLangs.includes(activeLang)) {
                        setActiveLang(appLangs[0]);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)] font-bold shadow-xs'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-soft)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <span>{app.title || `Approach ${idx + 1}`}</span>
                    {app.tag === 'optimal' && (
                      <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold rounded-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        Optimal
                      </span>
                    )}
                    {app.tag === 'brute-force' && (
                      <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold rounded-xs bg-amber-500/20 text-amber-700 dark:text-amber-400">
                        Naive
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Approach Card */}
          <div className="space-y-4">
            {/* Intuition & Logic (Text Before Code) */}
            {currentApproach.intuition && (
              <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Intuition &amp; Mental Model
                </h4>
                <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  <MarkdownRenderer content={currentApproach.intuition} />
                </div>
              </div>
            )}

            {/* Complexity Metrics for this approach */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                  <span>Time Complexity</span>
                </div>
                <p className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {currentApproach.timeComplexity || 'O(N)'}
                </p>
              </div>

              <div className="p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
                  <HardDrive className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                  <span>Space Complexity</span>
                </div>
                <p className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {currentApproach.spaceComplexity || 'O(1)'}
                </p>
              </div>
            </div>

            {/* Multi-Language Code Container */}
            <div className="rounded-sm border border-[#272724] bg-[#151515] overflow-hidden shadow-md">
              {/* Language Tabs & Copy Button */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#272724] bg-[#1a1a1a] flex-wrap gap-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {effectiveLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-2.5 py-1 rounded-xs text-xs font-mono transition-colors cursor-pointer ${
                        activeLang === lang
                          ? 'bg-[#272724] text-[#C7FF3D] font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {LANGUAGE_LABELS[lang] || lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono text-zinc-300 hover:text-white hover:bg-[#272724] transition-colors cursor-pointer shrink-0"
                  title="Copy code to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#C7FF3D]" />
                      <span className="text-[#C7FF3D]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Body */}
              <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed max-h-[420px]">
                <code>{currentCode}</code>
              </pre>
            </div>

            {/* Deep-Dive Walkthrough / Text After Code */}
            {currentApproach.explanationAfterCode && (
              <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                  Step-by-Step Tracing &amp; Edge Cases
                </h4>
                <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  <MarkdownRenderer content={currentApproach.explanationAfterCode} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Curated Study Resources & Guides */}
        {resources.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-[var(--accent-dark)]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Attached Learning Resources &amp; Guides
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {resources.map((res, i) => {
                const conf = RESOURCE_TYPE_CONFIG[res.type] || RESOURCE_TYPE_CONFIG.article;
                const IconComponent = conf.icon;
                return (
                  <a
                    key={res.id || i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] hover:border-[var(--accent-dark)] transition-all group block"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border ${conf.badgeColor}`}
                      >
                        <IconComponent className="w-2.5 h-2.5" />
                        {conf.label}
                      </span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-subtle)] group-hover:text-[var(--accent-dark)] transition-colors" />
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors line-clamp-1">
                      {res.title}
                    </p>
                    {res.description && (
                      <p className="text-[11px] text-[var(--text-subtle)] mt-1 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Target Companies */}
        {problem.companies && problem.companies.length > 0 && (
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
              Frequently Asked At
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {problem.companies.map((company) => (
                <span
                  key={company}
                  className="px-2.5 py-1 text-xs font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DsaSolutionDrawer({ problem, onClose }: DsaSolutionDrawerProps) {
  if (!problem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-2xl h-full bg-[var(--bg-surface)] border-l border-[var(--border-soft)] shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Close button pill in top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            title="Close solution"
            aria-label="Close solution"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Reusable Solution View */}
          <div className="flex-1 overflow-hidden">
            <DsaSolutionView problem={problem} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
