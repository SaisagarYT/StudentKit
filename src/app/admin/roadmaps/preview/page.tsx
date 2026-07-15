'use client';

import { Suspense } from 'react';
import { RoadmapPreview } from '@/features/admin/components/roadmap-preview';
import { Loader2 } from 'lucide-react';

export default function PreviewRoadmapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>}>
      <RoadmapPreview />
    </Suspense>
  );
}
