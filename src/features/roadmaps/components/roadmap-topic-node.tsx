'use client';

import { useState } from 'react';
import {
  Check,
  Clock,
  ChevronDown,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  Hammer,
  Trophy,
  ArrowRight,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { RoadmapTopic } from '@/types/roadmap';

interface RoadmapTopicNodeProps {
  topic: RoadmapTopic;
  globalIndex: number;
  isCompleted: boolean;
  onToggle: () => void;
  nextTopic?: RoadmapTopic | null;
  isLastInRoadmap?: boolean;
}

const RESOURCE_META: Record<
  string,
  { label: string; icon: LucideIcon }
> = {
  video: { label: 'Video', icon: Video },
  article: { label: 'Article', icon: FileText },
  course: { label: 'Course', icon: GraduationCap },
  docs: { label: 'Docs', icon: BookOpen },
};

export function RoadmapTopicNode({
  topic,
  globalIndex,
  isCompleted,
  onToggle,
  nextTopic,
  isLastInRoadmap,
}: RoadmapTopicNodeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-md border transition-all duration-200 overflow-hidden w-full ${
        isCompleted
          ? 'border-[var(--border-soft)] bg-[var(--bg-subtle)]/30 shadow-xs'
          : 'border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs hover:border-[var(--border-default)]'
      }`}
    >
      {/* Topic Header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none hover:bg-[var(--bg-subtle)]/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer ${
            isCompleted
              ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
              : 'border-[var(--border-default)] hover:border-[var(--accent-dark)] bg-transparent'
          }`}
          aria-label={isCompleted ? 'Mark topic as incomplete' : 'Mark topic as complete'}
        >
          {isCompleted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-semibold leading-snug transition-colors ${
                isCompleted
                  ? 'line-through text-[var(--text-subtle)]'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              <span className="font-mono text-[var(--text-subtle)] mr-2 font-bold">
                {globalIndex}.
              </span>
              {topic.title}
            </h4>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-[var(--text-subtle)] transition-transform duration-200 ${
                expanded ? 'rotate-180 text-[var(--text-primary)]' : ''
              }`}
            />
          </div>
          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-[var(--text-subtle)]">
            <Clock className="w-3 h-3" />
            <span>{topic.timeEstimate}</span>
          </span>
        </div>
      </div>

      {/* Expandable Content via AnimatePresence */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[var(--border-soft)] bg-[var(--bg-subtle)]/20"
          >
            <div className="p-4 sm:p-5 space-y-4">
              {/* Description */}
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {topic.description}
              </p>

              {/* What you'll learn */}
              {topic.whatToLearn && topic.whatToLearn.length > 0 && (
                <div>
                  <h5 className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                    <span>Key Learning Objectives</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {topic.whatToLearn.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--accent-dark)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {topic.resources && topic.resources.length > 0 && (
                <div>
                  <h5 className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                    <span>Curated Resources</span>
                  </h5>
                  <div className="grid gap-1.5">
                    {topic.resources.map((resource, idx) => {
                      const meta = RESOURCE_META[resource.type] || RESOURCE_META.article;
                      const Icon = meta.icon;

                      return (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-[var(--border-soft)] hover:border-[var(--border-default)] bg-[var(--bg-surface)] transition-all group/link"
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] shrink-0 text-[var(--text-primary)]">
                            <Icon className="w-3 h-3" />
                          </span>
                          <span className="flex-1 text-xs font-medium text-[var(--text-primary)] truncate group-hover/link:text-[var(--accent-dark)]">
                            {resource.title}
                          </span>
                          <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                            {meta.label}
                          </span>
                          <ExternalLink className="w-3 h-3 text-[var(--text-subtle)] shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Practice Project */}
              {topic.project && (
                <div className="p-3.5 rounded-md border-l-2 border-[var(--accent-dark)] bg-[var(--bg-surface)] shadow-xs">
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                    <Hammer className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                    <span>Topic Mini-Challenge</span>
                  </div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {topic.project.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {topic.project.description}
                  </p>
                </div>
              )}

              {/* Next Step Recommendations */}
              <div className="p-3.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)]">
                <h5 className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2.5">
                  <ArrowRight className="w-3 h-3 text-[var(--accent-dark)]" />
                  <span>Next Recommended Actions</span>
                </h5>
                <div className="space-y-1.5">
                  {nextTopic && (
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-sm bg-[var(--bg-subtle)]/70 border border-[var(--border-soft)]">
                      <div className="w-5 h-5 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] flex items-center justify-center shrink-0">
                        <BookOpen className="w-3 h-3 text-[var(--accent-dark)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          Next Topic: {nextTopic.title}
                        </p>
                        <p className="text-[10px] font-mono text-[var(--text-subtle)]">{nextTopic.timeEstimate}</p>
                      </div>
                    </div>
                  )}

                  <a
                    href="/projects"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] hover:border-[var(--border-default)] transition-colors group/next"
                  >
                    <div className="w-5 h-5 rounded-sm bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                      <Hammer className="w-3 h-3 text-[var(--accent-dark)]" />
                    </div>
                    <p className="flex-1 text-xs font-medium text-[var(--text-secondary)] group-hover/next:text-[var(--text-primary)] transition-colors">
                      Build an accompanying portfolio project
                    </p>
                    <ArrowRight className="w-3 h-3 text-[var(--text-subtle)] opacity-40 group-hover/next:opacity-100 transition-opacity" />
                  </a>

                  <a
                    href="/placement/dsa"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] hover:border-[var(--border-default)] transition-colors group/next"
                  >
                    <div className="w-5 h-5 rounded-sm bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                      <Terminal className="w-3 h-3 text-[var(--accent-dark)]" />
                    </div>
                    <p className="flex-1 text-xs font-medium text-[var(--text-secondary)] group-hover/next:text-[var(--text-primary)] transition-colors">
                      Reinforce with algorithmic practice
                    </p>
                    <ArrowRight className="w-3 h-3 text-[var(--text-subtle)] opacity-40 group-hover/next:opacity-100 transition-opacity" />
                  </a>

                  {isLastInRoadmap && (
                    <a
                      href="/placement/interview"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] hover:border-[var(--border-default)] transition-colors group/next"
                    >
                      <div className="w-5 h-5 rounded-sm bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                        <Trophy className="w-3 h-3 text-[var(--accent-dark)]" />
                      </div>
                      <p className="flex-1 text-xs font-medium text-[var(--text-secondary)] group-hover/next:text-[var(--text-primary)] transition-colors">
                        Begin technical interview preparation
                      </p>
                      <ArrowRight className="w-3 h-3 text-[var(--text-subtle)] opacity-40 group-hover/next:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

