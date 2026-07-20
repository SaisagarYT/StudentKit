import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { RoadmapsListClient } from '@/features/roadmaps/roadmaps-list-client';

export const metadata: Metadata = {
  title: `Roadmaps | ${siteConfig.name}`,
  description: 'Interactive career and technology roadmaps for students. Step-by-step paths with progress tracking for frontend, backend, AI, placements and more.',
  openGraph: {
    images: [{ url: '/og/roadmaps.png', width: 1200, height: 630 }],
  },
};

export default function RoadmapsPage() {
  return <RoadmapsListClient />;
}
