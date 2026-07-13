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
} from 'lucide-react';
import type { Roadmap, RoadmapStage, RoadmapTopic } from '@/types/roadmap';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const RESOURCE_STYLES: Record<string, { label: string; bg: string; text: string; icon: typeof Video }> = {
  video: { label: 'Video', bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Video },
  article: { label: 'Article', bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: FileText },
  course: { label: 'Course', bg: 'bg-violet-500/10', text: 'text-violet-500', icon: GraduationCap },
  docs: { label: 'Docs', bg: 'bg-amber-500/10', text: 'text-amber-500', icon: BookOpen },
};

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
  } catch {}
}

function TopicCard({
  topic,
  isCompleted,
  onToggle,
}: {
  topic: RoadmapTopic;
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
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
          : 'border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm'
      )}
    >
      <div
        className="flex items-start gap-3.5 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            'mt-0.5 shrink-0 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-300',
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 scale-110'
              : 'border-[var(--border-default)] hover:border-emerald-400 hover:scale-105'
          )}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'text-[13px] font-semibold leading-snug',
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-[var(--text-primary)]'
              )}
            >
              {topic.title}
            </h4>
            <ChevronDown
              className={cn(
                'w-4 h-4 shrink-0 text-[var(--text-subtle)] transition-transform duration-300',
                expanded && 'rotate-180'
              )}
            />
          </div>
          <p className="mt-1 text-[12px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {topic.description}
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-[11px] text-[var(--text-subtle)]">
            <Clock className="w-3 h-3" />
            {topic.timeEstimate}
          </span>
        </div>
      </div>

      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="px-4 pb-5 space-y-5">
          <div className="h-px bg-[var(--border-soft)]" />

          {topic.whatToLearn.length > 0 && (
            <div>
              <h5 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2.5">
                <Sparkles className="w-3 h-3" />
                What you&apos;ll learn
              </h5>
              <ul className="grid gap-1.5">
                {topic.whatToLearn.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[12px] text-[var(--text-secondary)] leading-relaxed">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--accent-primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topic.resources.length > 0 && (
            <div>
              <h5 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2.5">
                <BookOpen className="w-3 h-3" />
                Resources
              </h5>
              <div className="grid gap-2">
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
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[var(--border-soft)] hover:border-[var(--border-default)] bg-[var(--bg-subtle)]/50 hover:bg-[var(--bg-subtle)] transition-all group/link"
                    >
                      <span className={cn('flex items-center justify-center w-7 h-7 rounded-lg shrink-0', style.bg)}>
                        <Icon className={cn('w-3.5 h-3.5', style.text)} />
                      </span>
                      <span className="flex-1 text-[12px] font-medium text-[var(--text-primary)] truncate group-hover/link:text-[var(--accent-dark)]">
                        {resource.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {topic.project && (
            <div>
              <h5 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2.5">
                <Hammer className="w-3 h-3" />
                Practice Project
              </h5>
              <div className="p-4 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/[0.04]">
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                  {topic.project.title}
                </p>
                <p className="mt-1.5 text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  {topic.project.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StageSection({
  stage,
  index,
  progress,
  onToggleTopic,
  isLast,
}: {
  stage: RoadmapStage;
  index: number;
  progress: Record<string, boolean>;
  onToggleTopic: (topicId: string) => void;
  isLast: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const completedCount = stage.topics.filter((t) => progress[t.id]).length;
  const totalCount = stage.topics.length;
  const stagePercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isStageComplete = completedCount === totalCount && totalCount > 0;

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(sectionRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative opacity-0">
      {!isLast && (
        <div className="absolute left-5 top-[56px] bottom-0 w-px hidden md:block bg-[var(--border-soft)]" />
      )}

      {/* Stage Header */}
      <div className="relative flex items-center gap-4 p-4 md:p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-subtle)]/50 mb-4">
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shrink-0',
            isStageComplete
              ? 'bg-emerald-500 text-white'
              : 'bg-[var(--accent-primary)]/15 text-[var(--accent-dark)]'
          )}
        >
          {isStageComplete ? <Trophy className="w-5 h-5" /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {stage.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {stage.timeEstimate}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[var(--text-secondary)] line-clamp-1">
            {stage.description}
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn(
            'text-[11px] font-semibold',
            isStageComplete ? 'text-emerald-500' : 'text-[var(--text-secondary)]'
          )}>
            {completedCount}/{totalCount}
          </span>
          <div className="w-20 h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isStageComplete ? 'bg-emerald-500' : 'bg-[var(--accent-primary)]'
              )}
              style={{ width: `${stagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics — align-start prevents row siblings from expanding together */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-3 md:pl-5 mb-10">
        {stage.topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isCompleted={!!progress[topic.id]}
            onToggle={() => onToggleTopic(topic.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function InteractiveRoadmap({ roadmap }: { roadmap: Roadmap }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(loadProgress(roadmap.slug));
    setMounted(true);
  }, [roadmap.slug]);

  const toggleTopic = useCallback(
    (topicId: string) => {
      setProgress((prev) => {
        const next = { ...prev, [topicId]: !prev[topicId] };
        saveProgress(roadmap.slug, next);
        return next;
      });
    },
    [roadmap.slug]
  );

  const allTopics = useMemo(() => roadmap.stages.flatMap((s) => s.topics), [roadmap.stages]);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter((t) => progress[t.id]).length;
  const overallPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

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
      {/* Overall Progress */}
      <div className="sticky top-16 md:top-[72px] z-30 -mx-4 px-4 md:-mx-0 md:px-0 mb-10">
        <div className="bg-[var(--bg-surface)]/95 backdrop-blur-lg border border-[var(--border-soft)] rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
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
            <div className="text-right">
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {Math.round(overallPercent)}%
              </span>
            </div>
          </div>
          <div className="relative h-2.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent-primary)]"
              style={{ width: mounted ? `${overallPercent}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {roadmap.stages.map((stage, idx) => (
          <StageSection
            key={stage.id}
            stage={stage}
            index={idx}
            progress={progress}
            onToggleTopic={toggleTopic}
            isLast={idx === roadmap.stages.length - 1}
          />
        ))}
      </div>

      {/* Completion message */}
      {completedTopics === totalTopics && totalTopics > 0 && (
        <div className="mt-8 p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] text-center">
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
