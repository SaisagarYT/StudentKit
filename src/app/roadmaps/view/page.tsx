import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { RoadmapViewWrapper } from '@/features/roadmaps/roadmap-view-wrapper';

export const metadata: Metadata = {
  title: `Roadmap | ${siteConfig.name}`,
  description: 'Interactive career and technology roadmap with progress tracking.',
};

export default function RoadmapViewPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--text-subtle)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RoadmapViewWrapper />
    </Suspense>
  );
}
