'use client';
import Link from 'next/link';
import { Hammer, ArrowRight } from 'lucide-react';

interface RoadmapProjectMilestoneProps {
  title: string;
  description: string;
  stageIndex: number;
  projectSlug?: string;
}

export function RoadmapProjectMilestone({
  title,
  description,
  stageIndex,
  projectSlug,
}: RoadmapProjectMilestoneProps) {
  return (
    <div className="relative flex justify-center my-8">
      {/* Central connector dot */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--accent-dark)] border-4 border-[var(--bg-surface)] z-10" />
      <div className="hidden md:block lg:hidden absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--accent-dark)] border-4 border-[var(--bg-surface)] z-10" />

      <div className="w-full max-w-md mx-auto lg:mx-0 p-4 sm:p-5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-subtle)]/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
            <Hammer className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-dark)]">
            Milestone Project {stageIndex}
          </span>
        </div>
        <p className="text-sm font-bold text-[var(--text-primary)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
        <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
          Build this project before advancing to stage {stageIndex + 1}
        </p>
        
        {projectSlug ? (
          <div className="mt-3.5 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
              Guided Project Available
            </span>
            <Link
              href={`/projects/view?slug=${projectSlug}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <span>Build Project</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
            Build this project before advancing to stage {stageIndex + 1}
          </p>
        )}
      </div>
    </div>
  );
}

