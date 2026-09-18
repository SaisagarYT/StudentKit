'use client';

import { Trophy } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Progress } from '@/components/ui/progress';
import { ShareProgress } from '@/components/engagement/share-progress';

interface RoadmapProgressStripProps {
  roadmapTitle: string;
  roadmapSlug: string;
  completedTopics: number;
  totalTopics: number;
  overallPercent: number;
  mounted: boolean;
}

export function RoadmapProgressStrip({
  roadmapTitle,
  roadmapSlug,
  completedTopics,
  totalTopics,
  overallPercent,
  mounted,
}: RoadmapProgressStripProps) {
  return (
    <div className="sticky top-16 md:top-[72px] z-30 mb-8">
      <div className="bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-soft)] rounded-md p-4 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[var(--text-primary)] truncate">
                Your Progress
              </h2>
              <p className="text-[11px] text-[var(--text-subtle)] font-mono">
                <AnimatedCounter value={mounted ? completedTopics : 0} /> / {totalTopics} topics completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ShareProgress
              roadmapTitle={roadmapTitle}
              roadmapSlug={roadmapSlug}
              completedTopics={completedTopics}
              totalTopics={totalTopics}
            />
            <span className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)]">
              {Math.round(overallPercent)}%
            </span>
          </div>
        </div>

        {/* Standardized Progress primitive */}
        <Progress value={mounted ? completedTopics : 0} max={totalTopics} className="h-2" />
      </div>
    </div>
  );
}

