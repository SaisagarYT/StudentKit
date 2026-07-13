'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  Sparkles,
  ArrowRight,
  Monitor,
  Terminal,
  GitBranch,
  Globe,
} from 'lucide-react';
import type { Roadmap, RoadmapStage, RoadmapTopic } from '@/types/roadmap';
import { cn } from '@/lib/utils';
import { trackRoadmapProgress } from '@/lib/analytics';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RESOURCE_STYLES: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof Video }
> = {
  video: { label: 'Video', bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Video },
  article: { label: 'Article', bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: FileText },
  course: { label: 'Course', bg: 'bg-violet-500/10', text: 'text-violet-500', icon: GraduationCap },
  docs: { label: 'Docs', bg: 'bg-amber-500/10', text: 'text-amber-500', icon: BookOpen },
};

const STAGE_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

const PREREQUISITES = [
  'Basic computer skills',
  'A text editor installed',
  'Browser (Chrome recommended)',
];

const TOOLS = [
  { label: 'VS Code (Editor)', icon: Monitor },
  { label: 'Chrome DevTools', icon: Globe },
  { label: 'Git + GitHub', icon: GitBranch },
  { label: 'Terminal/CMD', icon: Terminal },
];

// ─── Persistence helpers ──────────────────────────────────────────────────────

function getStorageKey(slug: string) {
  return `roadmap-progress-${slug}`;
}

function loadProgress(slug: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getStorageKey(slug));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(slug: string, progress: Record<string, boolean>) {
  try {
    localStorage.setItem(getStorageKey(slug), JSON.stringify(progress));
  } catch {
    // silently fail
  }
}

// ─── Prerequisites & Tools Header ────────────────────────────────────────────

function PrerequisitesAndTools() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
      {/* Prerequisites */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Prerequisites</h3>
        <ul className="space-y-2 mb-4">
          {PREREQUISITES.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <a
          href="#setup"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--accent-dark)] hover:underline"
        >
          Don&apos;t have these? Start here
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Recommended Tools */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Recommended Tools</h3>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border border-[var(--border-default)] bg-[var(--accent-primary)]/[0.06] text-[var(--text-secondary)]"
              >
                <Icon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                {tool.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Topic Branch Node ────────────────────────────────────────────────────────

function TopicBranchNode({
  topic,
  globalIndex,
  isCompleted,
  onToggle,
}: {
  topic: RoadmapTopic;
  globalIndex: number;
  isCompleted: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (expanded) {
      const height = contentRef.current.scrollHeight;
      gsap.to(contentRef.current, { height, opacity: 1, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }
  }, [expanded]);

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200 overflow-hidden w-full',
        isCompleted
          ? 'border-emerald-500/40 bg-emerald-500/[0.06] shadow-sm'
          : 'border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm hover:border-[var(--accent-primary)]/60 hover:shadow-md'
      )}
    >
      {/* Topic header */}
      <div
        className="flex items-start gap-3 p-3.5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Completion checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            'mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300',
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 scale-110'
              : 'border-[var(--border-default)] hover:border-emerald-400 hover:scale-105'
          )}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'text-[13px] font-semibold leading-snug',
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400 line-through decoration-emerald-400/40'
                  : 'text-[var(--text-primary)]'
              )}
            >
              <span className="text-[var(--accent-primary)] font-bold mr-1.5">
                {globalIndex}.
              </span>
              {topic.title}
            </h4>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 shrink-0 text-[var(--text-subtle)] transition-transform duration-300',
                expanded && 'rotate-180'
              )}
            />
          </div>
          <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-[var(--text-subtle)]">
            <Clock className="w-3 h-3" />
            {topic.timeEstimate}
          </span>
        </div>
      </div>

      {/* Expandable content */}
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="px-3.5 pb-4 space-y-4">
          <div className="h-px bg-[var(--border-default)]" />

          {/* Description */}
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            {topic.description}
          </p>

          {/* What you'll learn */}
          {topic.whatToLearn.length > 0 && (
            <div>
              <h5 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                <Sparkles className="w-3 h-3" />
                What you&apos;ll learn
              </h5>
              <ul className="grid gap-1.5">
                {topic.whatToLearn.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)] leading-relaxed">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--accent-primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {topic.resources.length > 0 && (
            <div>
              <h5 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                <BookOpen className="w-3 h-3" />
                Resources
              </h5>
              <div className="grid gap-1.5">
                {topic.resources.map((resource, idx) => {
                  const style = RESOURCE_STYLES[resource.type];
                  const Icon = style.icon;
                  return (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 bg-[var(--bg-subtle)] hover:bg-[var(--accent-primary)]/[0.06] transition-all group/link"
                    >
                      <span className={cn('flex items-center justify-center w-6 h-6 rounded-md shrink-0', style.bg)}>
                        <Icon className={cn('w-3 h-3', style.text)} />
                      </span>
                      <span className="flex-1 text-[11px] font-medium text-[var(--text-primary)] truncate group-hover/link:text-[var(--accent-dark)]">
                        {resource.title}
                      </span>
                      <span className={cn('text-[9px] font-bold uppercase px-1.5 py-0.5 rounded', style.bg, style.text)}>
                        {style.label}
                      </span>
                      <ExternalLink className="w-3 h-3 text-[var(--text-subtle)] shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Practice Project */}
          {topic.project && (
            <div className="p-3 rounded-lg border border-dashed border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/[0.08]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Hammer className="w-3 h-3 text-[var(--accent-primary)]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-dark)]">
                  Practice Project
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[var(--text-primary)]">
                {topic.project.title}
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {topic.project.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Project Milestone Node ──────────────────────────────────────────────────

function ProjectMilestone({
  title,
  description,
  stageIndex,
}: {
  title: string;
  description: string;
  stageIndex: number;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(nodeRef.current, { opacity: 1, scale: 1 });
      return;
    }
    gsap.fromTo(
      nodeRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: nodeRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <div ref={nodeRef} className="relative flex justify-center my-8 opacity-0">
      {/* Connector dot on spine */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--accent-primary)] border-4 border-[var(--bg-surface)] z-10" />
      <div className="hidden md:block lg:hidden absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--accent-primary)] border-4 border-[var(--bg-surface)] z-10" />

      <div className="w-full max-w-md mx-auto lg:mx-0 p-4 rounded-xl border-2 border-dashed border-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/[0.08] shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{'🛠️'}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-dark)]">
            Project Milestone {stageIndex}
          </span>
        </div>
        <p className="text-[13px] font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="mt-1 text-[12px] text-[var(--text-secondary)] leading-relaxed">{description}</p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)]">
          Build this before moving to the next stage
        </p>
      </div>
    </div>
  );
}

// ─── Stage Node (Central Spine) ──────────────────────────────────────────────

function StageNode({
  stage,
  index,
  completedCount,
  totalCount,
}: {
  stage: RoadmapStage;
  index: number;
  completedCount: number;
  totalCount: number;
}) {
  const isComplete = completedCount === totalCount && totalCount > 0;
  const numberSymbol = STAGE_NUMBERS[index] || `${index + 1}`;

  return (
    <div className="relative flex justify-center mb-6">
      {/* The stage card */}
      <div
        className={cn(
          'relative min-w-[200px] max-w-[280px] w-full p-4 rounded-2xl border-l-4 border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-md',
          isComplete ? 'border-l-emerald-500' : 'border-l-[var(--accent-primary)]'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-xl text-base font-bold shrink-0',
              isComplete
                ? 'bg-emerald-500/15 text-emerald-600'
                : 'bg-[var(--accent-primary)]/15 text-[var(--accent-dark)]'
            )}
          >
            {isComplete ? <Trophy className="w-4.5 h-4.5" /> : numberSymbol}
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold text-[var(--text-primary)] truncate">
              {stage.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-[var(--text-subtle)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stage.timeEstimate}
              </span>
              <span className="text-[11px] text-[var(--text-subtle)]">
                {totalCount} topics
              </span>
            </div>
          </div>
        </div>
        {/* Mini progress */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-[var(--border-soft)] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isComplete ? 'bg-emerald-500' : 'bg-[var(--accent-primary)]'
              )}
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className={cn(
            'text-[10px] font-semibold',
            isComplete ? 'text-emerald-500' : 'text-[var(--text-subtle)]'
          )}>
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Tree Branch Section ─────────────────────────────────────────────────────

function TreeBranchSection({
  stage,
  stageIndex,
  globalTopicOffset,
  progress,
  onToggleTopic,
}: {
  stage: RoadmapStage;
  stageIndex: number;
  globalTopicOffset: number;
  progress: Record<string, boolean>;
  onToggleTopic: (topicId: string) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const branchSide = stageIndex % 2 === 0 ? 'right' : 'left';
  const completedCount = stage.topics.filter((t) => progress[t.id]).length;

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(sectionRef.current.querySelectorAll('.tree-node'), { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const nodes = sectionRef.current!.querySelectorAll('.tree-node');
      gsap.fromTo(
        nodes,
        { opacity: 0, x: branchSide === 'right' ? -20 : 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [branchSide]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Stage Node */}
      <StageNode
        stage={stage}
        index={stageIndex}
        completedCount={completedCount}
        totalCount={stage.topics.length}
      />

      {/* Topic branches - Desktop: alternate left/right, Tablet: all right, Mobile: stacked */}
      <div
        className={cn(
          'relative',
          // Desktop: position branches left or right of center
          'lg:grid lg:grid-cols-2',
          // Tablet: single column offset to the right
          'md:max-lg:pl-16',
          // Mobile: plain stack
          'max-md:space-y-3'
        )}
      >
        {/* Desktop: empty column for the side without branches */}
        {branchSide === 'right' && (
          <div className="hidden lg:block" aria-hidden="true" />
        )}

        {/* Topics container */}
        <div className="space-y-3 lg:px-6">
          {stage.topics.map((topic, topicIdx) => (
            <div key={topic.id} className="tree-node opacity-0 relative">
              {/* Horizontal branch connector - Desktop */}
              <div
                className={cn(
                  'hidden lg:block absolute top-5 w-6 h-[2px] bg-[var(--border-default)]',
                  branchSide === 'right' ? '-left-6' : '-right-6'
                )}
              />
              {/* Connector dot */}
              <div
                className={cn(
                  'hidden lg:block absolute top-5 w-2.5 h-2.5 rounded-full -translate-y-1/2 border-2 border-[var(--bg-surface)]',
                  progress[topic.id] ? 'bg-emerald-500' : 'bg-[var(--border-default)]',
                  branchSide === 'right' ? '-left-8' : '-right-8'
                )}
              />
              {/* Tablet connector */}
              <div className="hidden md:block lg:hidden absolute top-5 -left-8 w-8 h-[2px] bg-[var(--border-default)]" />
              <div
                className={cn(
                  'hidden md:block lg:hidden absolute top-5 -left-10 w-2.5 h-2.5 rounded-full -translate-y-1/2 border-2 border-[var(--bg-surface)]',
                  progress[topic.id] ? 'bg-emerald-500' : 'bg-[var(--border-default)]'
                )}
              />

              <TopicBranchNode
                topic={topic}
                globalIndex={globalTopicOffset + topicIdx + 1}
                isCompleted={!!progress[topic.id]}
                onToggle={() => onToggleTopic(topic.id)}
              />
            </div>
          ))}
        </div>

        {/* Desktop: empty column for the side without branches */}
        {branchSide === 'left' && (
          <div className="hidden lg:block" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function InteractiveRoadmap({ roadmap }: { roadmap: Roadmap }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(loadProgress(roadmap.slug));
    setMounted(true);
  }, [roadmap.slug]);

  const toggleTopic = useCallback(
    (topicId: string) => {
      setProgress((prev) => {
        const next = { ...prev, [topicId]: !prev[topicId] };
        saveProgress(roadmap.slug, next);
        if (next[topicId]) {
          trackRoadmapProgress(roadmap.slug, topicId);
        }
        return next;
      });
    },
    [roadmap.slug]
  );

  const allTopics = useMemo(() => roadmap.stages.flatMap((s) => s.topics), [roadmap.stages]);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter((t) => progress[t.id]).length;
  const overallPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Calculate global topic offsets per stage
  const stageOffsets = useMemo(() => {
    const offsets: number[] = [];
    let count = 0;
    for (const stage of roadmap.stages) {
      offsets.push(count);
      count += stage.topics.length;
    }
    return offsets;
  }, [roadmap.stages]);

  // Animate progress bar
  useEffect(() => {
    if (!mounted || !progressBarRef.current) return;
    gsap.to(progressBarRef.current, {
      width: `${overallPercent}%`,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [overallPercent, mounted]);

  return (
    <div className="w-full">
      {/* Prerequisites & Tools */}
      <PrerequisitesAndTools />

      {/* Sticky Progress Bar */}
      <div className="sticky top-16 md:top-[72px] z-30 -mx-4 px-4 md:-mx-0 md:px-0 mb-12">
        <div className="bg-[var(--bg-surface)]/95 backdrop-blur-lg border border-[var(--border-default)] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--accent-primary)]/15">
                <Trophy className="w-4 h-4 text-[var(--accent-dark)]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Your Progress
                </h2>
                <p className="text-[11px] text-[var(--text-subtle)]">
                  {completedTopics} of {totalTopics} topics completed
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {Math.round(overallPercent)}%
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-[var(--border-soft)] overflow-hidden">
            <div
              ref={progressBarRef}
              className={cn(
                'absolute inset-y-0 left-0 rounded-full transition-colors',
                completedTopics === totalTopics && totalTopics > 0
                  ? 'bg-emerald-500'
                  : 'bg-[var(--accent-primary)]'
              )}
              style={{ width: mounted ? `${overallPercent}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Tree / Mind-map layout */}
      <div ref={treeRef} className="relative">
        {/* Central spine - Desktop */}
        <div
          className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-[var(--border-default)] rounded-full"
          aria-hidden="true"
        />
        {/* Central spine - Tablet (left aligned) */}
        <div
          className="hidden md:block lg:hidden absolute left-8 top-0 bottom-0 w-[3px] bg-[var(--border-default)] rounded-full"
          aria-hidden="true"
        />
        {/* Mobile: left timeline line */}
        <div
          className="block md:hidden absolute left-3 top-0 bottom-0 w-[3px] bg-[var(--border-default)] rounded-full"
          aria-hidden="true"
        />

        {/* Stages and branches */}
        {roadmap.stages.map((stage, idx) => (
          <div key={stage.id}>
            {/* Stage + topics */}
            <TreeBranchSection
              stage={stage}
              stageIndex={idx}
              globalTopicOffset={stageOffsets[idx]}
              progress={progress}
              onToggleTopic={toggleTopic}
            />

            {/* Project Milestone between stages */}
            {idx < roadmap.stages.length - 1 && stage.topics.length > 0 && (
              <ProjectMilestone
                title={stage.topics[stage.topics.length - 1].project.title}
                description={stage.topics[stage.topics.length - 1].project.description}
                stageIndex={idx + 1}
              />
            )}
          </div>
        ))}
      </div>

      {/* Completion celebration */}
      {completedTopics === totalTopics && totalTopics > 0 && (
        <div className="mt-12 p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 mb-4">
            <Trophy className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Roadmap Completed!
          </h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            You&apos;ve finished all {totalTopics} topics. Time to build something amazing with your new skills.
          </p>
        </div>
      )}
    </div>
  );
}
