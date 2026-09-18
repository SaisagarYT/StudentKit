'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface ProjectRelatedRoadmapsProps {
  relatedRoadmapIds: string[];
}

export function ProjectRelatedRoadmaps({ relatedRoadmapIds }: ProjectRelatedRoadmapsProps) {
  if (!relatedRoadmapIds || relatedRoadmapIds.length === 0) return null;

  return (
    <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs p-5 sm:p-6 mb-8">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            Related Career Roadmaps
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Learning paths that teach the prerequisites and libraries for this build
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {relatedRoadmapIds.map((slug) => (
          <Link
            key={slug}
            href={`/roadmaps/view?slug=${slug}`}
            className="group flex items-center justify-between p-3.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-dark)] shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors capitalize truncate block">
                  {slug.replace(/-/g, ' ')}
                </span>
                <span className="text-[10px] text-[var(--text-subtle)] font-mono">
                  Interactive Curriculum
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}

