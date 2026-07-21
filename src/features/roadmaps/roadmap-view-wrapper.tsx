'use client';

import { useSearchParams } from 'next/navigation';
import { RoadmapDetailClient } from './roadmap-detail-client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function RoadmapViewWrapper() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  if (!slug) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--text-secondary)]">Roadmap not found</p>
        <Link
          href="/roadmaps"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-dark)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to roadmaps
        </Link>
      </div>
    );
  }

  return <RoadmapDetailClient slug={slug} />;
}
