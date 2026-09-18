'use client';

import { Progress } from '@/components/ui/progress';
import type { RoadmapStage } from '@/types/roadmap';

interface RoadmapStageNodeProps {
  stage: RoadmapStage;
  index: number;
  completedCount: number;
  totalCount: number;
  roadmapTitle: string;
}

export function RoadmapStageNode({
  stage,
  index,
  completedCount,
  totalCount,
}: RoadmapStageNodeProps) {
  const isComplete = totalCount > 0 && completedCount === totalCount;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="relative my-8">
      {/* Node pin on spine */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--accent-dark)] border-4 border-[var(--bg-surface)] z-10" />
      <div className="hidden md:block lg:hidden absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--accent-dark)] border-4 border-[var(--bg-surface)] z-10" />

      {/* Stage Banner Card */}
      <div className="w-full max-w-lg mx-auto p-4 sm:p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs transition-all hover:border-[var(--border-default)]">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)]">
              Stage {index + 1}
            </span>
            {isComplete && (
              <span className="text-[10px] font-mono font-bold text-[var(--color-success)] uppercase px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)]">
                Completed
              </span>
            )}
          </div>

          <span className="text-xs font-mono font-medium text-[var(--text-subtle)]">
            {completedCount}/{totalCount} topics ({percent}%)
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
          {stage.title}
        </h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
          {stage.description}
        </p>

        <div className="mt-3">
          <Progress value={completedCount} max={totalCount} className="h-1.5" />
        </div>
      </div>
    </div>
  );
}

