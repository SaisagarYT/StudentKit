'use client';

import { useEffect, useState } from 'react';

interface RoadmapProgressProps {
  slug: string;
  totalTopics: number;
}

function loadProgress(slug: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`roadmap-progress-${slug}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function RoadmapProgressCard({ slug, totalTopics }: RoadmapProgressProps) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const progress = loadProgress(slug);
    setCompleted(Object.values(progress).filter(Boolean).length);
  }, [slug]);

  if (completed === 0) return null;

  const percent = totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border-soft)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-medium text-[var(--text-subtle)]">
          {completed}/{totalTopics} topics
        </span>
        <span className="text-[10px] font-bold text-[var(--accent-dark)]">
          {percent}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--border-soft)] overflow-hidden">
        <div
          className={
            percent === 100
              ? 'h-full rounded-full bg-emerald-500 transition-all'
              : 'h-full rounded-full bg-[var(--accent-primary)] transition-all'
          }
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
