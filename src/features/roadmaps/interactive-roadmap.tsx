'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { Roadmap } from '@/types/roadmap';
import { cn } from '@/lib/utils';
import { trackRoadmapProgress } from '@/lib/analytics';
import { logXpEvent } from '@/lib/xp';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { RoadmapProgressStrip } from './components/roadmap-progress-strip';
import { RoadmapPrerequisites } from './components/roadmap-prerequisites';
import { RoadmapStageNode } from './components/roadmap-stage-node';
import { RoadmapTopicNode } from './components/roadmap-topic-node';
import { RoadmapProjectMilestone } from './components/roadmap-project-milestone';
import { curatedProjects } from '@/config/projects';

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
    emitProgressChanged();
  } catch {
    // silently fail
  }
}

// ─── Stack Variant Tabs ──────────────────────────────────────────────────────

function StackTabs({
  variants,
  activeVariant,
  onSelect,
}: {
  variants: { id: string; label: string }[];
  activeVariant: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
          Choose your specialization / stack:
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 border cursor-pointer',
              activeVariant === v.id
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)] shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-soft)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function InteractiveRoadmap({ roadmap }: { roadmap: Roadmap }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [activeVariant, setActiveVariant] = useState<string>(() => {
    if (typeof window !== 'undefined' && roadmap.variants?.length) {
      const saved = localStorage.getItem(`roadmap-variant-${roadmap.slug}`);
      if (saved && roadmap.variants.some((v) => v.id === saved)) return saved;
    }
    return roadmap.variants?.[0]?.id ?? '';
  });

  const matchingProject = useMemo(() => {
    return curatedProjects.find((p) => p.relatedRoadmapIds?.includes(roadmap.slug));
  }, [roadmap.slug]);

  useEffect(() => {
    setProgress(loadProgress(roadmap.slug));
    setMounted(true);
  }, [roadmap.slug]);

  const handleVariantChange = useCallback(
    (id: string) => {
      setActiveVariant(id);
      try {
        localStorage.setItem(`roadmap-variant-${roadmap.slug}`, id);
      } catch {
        // silently fail
      }
    },
    [roadmap.slug]
  );

  const toggleTopic = useCallback(
    (topicId: string) => {
      setProgress((prev) => {
        const next = { ...prev, [topicId]: !prev[topicId] };
        saveProgress(roadmap.slug, next);
        if (next[topicId]) {
          trackRoadmapProgress(roadmap.slug, topicId);
          logXpEvent('ROADMAP_TOPIC', 'Topic completed');
        }
        return next;
      });
    },
    [roadmap.slug]
  );

  const allTopics = useMemo(
    () =>
      roadmap.stages
        .flatMap((s) => s.topics)
        .filter((t) => !t.variant || t.variant === activeVariant),
    [roadmap.stages, activeVariant]
  );

  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter((t) => progress[t.id]).length;
  const overallPercent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Calculate global topic offsets per stage (respecting variant filter)
  const stageOffsets = useMemo(() => {
    const offsets: number[] = [];
    let count = 0;
    for (const stage of roadmap.stages) {
      offsets.push(count);
      count += stage.topics.filter(
        (t) => !t.variant || t.variant === activeVariant
      ).length;
    }
    return offsets;
  }, [roadmap.stages, activeVariant]);

  return (
    <div className="w-full">
      {/* Prerequisites & Tools */}
      <RoadmapPrerequisites />

      {/* Stack Selection Tabs */}
      {roadmap.variants && roadmap.variants.length > 0 && (
        <StackTabs
          variants={roadmap.variants}
          activeVariant={activeVariant}
          onSelect={handleVariantChange}
        />
      )}

      {/* Sticky Progress Strip */}
      <RoadmapProgressStrip
        roadmapTitle={roadmap.title}
        roadmapSlug={roadmap.slug}
        completedTopics={completedTopics}
        totalTopics={totalTopics}
        overallPercent={overallPercent}
        mounted={mounted}
      />

      {/* Mind-map / Timeline Spine layout */}
      <div className="relative">
        {/* Central spine - Desktop */}
        <div
          className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-[var(--border-soft)]"
          aria-hidden="true"
        />
        {/* Spine - Tablet */}
        <div
          className="hidden md:block lg:hidden absolute left-8 top-0 bottom-0 w-[2px] bg-[var(--border-soft)]"
          aria-hidden="true"
        />
        {/* Spine - Mobile */}
        <div
          className="block md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-[var(--border-soft)]"
          aria-hidden="true"
        />

        {/* Stages and topic branches */}
        {roadmap.stages.map((stage, stageIdx) => {
          const branchSide = stageIdx % 2 === 0 ? 'right' : 'left';
          const visibleTopics = stage.topics.filter(
            (t) => !t.variant || t.variant === activeVariant
          );
          const stageCompleted = visibleTopics.filter((t) => progress[t.id]).length;
          const globalOffset = stageOffsets[stageIdx] ?? 0;
          const lastTopicInStage = visibleTopics[visibleTopics.length - 1];

          return (
            <div key={stage.id} className="relative mb-12">
              {/* Stage Node */}
              <RoadmapStageNode
                stage={stage}
                index={stageIdx}
                completedCount={stageCompleted}
                totalCount={visibleTopics.length}
                roadmapTitle={roadmap.title}
              />

              {/* Topics Container */}
              <div
                className={cn(
                  'relative mt-6',
                  // Desktop: 2 columns
                  'lg:grid lg:grid-cols-2',
                  // Tablet: single column indented from left spine
                  'md:max-lg:pl-16',
                  // Mobile: single column indented
                  'max-md:pl-10 space-y-3'
                )}
              >
                {/* Desktop: empty column for alternating zigzag side */}
                {branchSide === 'right' && (
                  <div className="hidden lg:block" aria-hidden="true" />
                )}

                {/* Topics list */}
                <div className="space-y-3 lg:px-6">
                  {visibleTopics.map((topic, topicIdx) => {
                    const globalIdx = globalOffset + topicIdx;
                    const nextTopicInAll = allTopics[globalIdx + 1] || null;
                    const isLast =
                      globalIdx === allTopics.length - 1 &&
                      stageIdx === roadmap.stages.length - 1;

                    return (
                      <div key={topic.id} className="relative">
                        {/* Desktop connector line & dot */}
                        <div
                          className={cn(
                            'hidden lg:block absolute top-6 w-6 h-[2px] bg-[var(--border-soft)]',
                            branchSide === 'right' ? '-left-6' : '-right-6'
                          )}
                        />
                        <div
                          className={cn(
                            'hidden lg:block absolute top-6 w-2.5 h-2.5 rounded-full -translate-y-1/2 border-2 border-[var(--bg-surface)]',
                            progress[topic.id]
                              ? 'bg-[var(--color-success)]'
                              : 'bg-[var(--border-default)]',
                            branchSide === 'right' ? '-left-8' : '-right-8'
                          )}
                        />

                        {/* Tablet connector line & dot */}
                        <div className="hidden md:block lg:hidden absolute top-6 -left-8 w-8 h-[2px] bg-[var(--border-soft)]" />
                        <div
                          className={cn(
                            'hidden md:block lg:hidden absolute top-6 -left-10 w-2.5 h-2.5 rounded-full -translate-y-1/2 border-2 border-[var(--bg-surface)]',
                            progress[topic.id]
                              ? 'bg-[var(--color-success)]'
                              : 'bg-[var(--border-default)]'
                          )}
                        />

                        <RoadmapTopicNode
                          topic={topic}
                          globalIndex={globalIdx + 1}
                          isCompleted={!!progress[topic.id]}
                          onToggle={() => toggleTopic(topic.id)}
                          nextTopic={nextTopicInAll}
                          isLastInRoadmap={isLast}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestone Project between stages */}
              {stageIdx < roadmap.stages.length - 1 && lastTopicInStage && (
                <RoadmapProjectMilestone
                  title={lastTopicInStage.project.title}
                  description={lastTopicInStage.project.description}
                  stageIndex={stageIdx + 1}
                  projectSlug={matchingProject?.slug}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {completedTopics === totalTopics && totalTopics > 0 && (
        <div className="mt-12 p-8 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-center shadow-xs">
          <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--color-success)] mb-4">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Roadmap Completed!
          </h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            You&apos;ve finished all {totalTopics} topics. Time to apply your skills on real-world projects and interview prep.
          </p>
        </div>
      )}
    </div>
  );
}
