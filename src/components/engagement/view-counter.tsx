'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getContentViews } from '@/lib/cms/analytics';

interface ViewCounterProps {
  type: 'roadmap' | 'project';
  slug: string;
}

function formatViews(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

export function ViewCounter({ type, slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    getContentViews(type, slug).then(setViews);
  }, [type, slug]);

  if (views === null || views === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
      <Users className="w-3 h-3 text-[var(--text-subtle)]" />
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {formatViews(views)} {views === 1 ? 'learner' : 'learners'}
      </span>
    </div>
  );
}
