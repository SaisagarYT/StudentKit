'use client';

import * as Icons from 'lucide-react';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '@/components/ui/progress';
import { DsaProblemRow } from './dsa-problem-row';
import type { DsaTopicMeta } from '@/config/placement/dsa-topics';
import type { DsaProblemListItem } from '@/lib/cms/types';

interface TopicWithProblems extends DsaTopicMeta {
  problems: DsaProblemListItem[];
}

interface DsaTopicAccordionProps {
  topic: TopicWithProblems;
  isExpanded: boolean;
  onToggle: () => void;
  progress: Record<string, boolean>;
  onToggleProblem: (slug: string) => void;
  expandedHints: string | null;
  onToggleHints: (slug: string) => void;
  publishedSlugs: Set<string>;
  mounted: boolean;
  onOpenSolution?: (problem: DsaProblemListItem) => void;
}

function toPascalCase(str: string) {
  return str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

function getIcon(name: string, className?: string) {
  const key = toPascalCase(name);
  const Icon = Icons[key as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-5 h-5'} /> : null;
}

export function DsaTopicAccordion({
  topic,
  isExpanded,
  onToggle,
  progress,
  onToggleProblem,
  expandedHints,
  onToggleHints,
  publishedSlugs,
  mounted,
  onOpenSolution,
}: DsaTopicAccordionProps) {
  const topicCompleted = topic.problems.filter((p) => progress[p.slug]).length;
  const totalInTopic = topic.problems.length;
  const isAllDone = totalInTopic > 0 && topicCompleted === totalInTopic;

  return (
    <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden transition-all hover:border-[var(--border-default)] shadow-sm">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left select-none hover:bg-[var(--bg-subtle)]/30 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
            {getIcon(topic.icon, 'w-5 h-5')}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">
                {topic.title}
              </h3>
              {isAllDone && (
                <span className="text-[10px] font-mono font-bold text-[var(--color-success)] uppercase px-1.5 py-0.2 rounded-sm bg-[var(--bg-subtle)]">
                  Done
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-subtle)] truncate mt-0.5">
              {topic.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Progress meter */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
              {mounted ? topicCompleted : 0}/{totalInTopic}
            </span>
            <Progress
              value={mounted ? topicCompleted : 0}
              max={totalInTopic}
              className="w-20 h-1.5"
            />
          </div>

          <ChevronDown
            className={`w-4 h-4 text-[var(--text-subtle)] transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-[var(--text-primary)]' : ''
            }`}
          />
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[var(--border-soft)]"
          >
            {/* Pattern Strategy Callout */}
            {topic.pattern && (
              <div className="p-4 sm:px-6 sm:py-3.5 bg-[var(--bg-subtle)]/60 border-b border-[var(--border-soft)] flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mr-2 text-[10px]">
                    Pattern Strategy:
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {topic.pattern}
                  </span>
                </div>
              </div>
            )}

            {/* Problem rows list */}
            <div>
              {topic.problems.map((problem) => (
                <DsaProblemRow
                  key={problem.id}
                  problem={problem}
                  isDone={!!progress[problem.slug]}
                  onToggle={onToggleProblem}
                  hintsOpen={expandedHints === problem.slug}
                  onToggleHints={onToggleHints}
                  hasEditorial={
                    !!problem.editorial && publishedSlugs.has(problem.editorial)
                  }
                  categoryPattern={topic.pattern}
                  onOpenSolution={onOpenSolution}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
