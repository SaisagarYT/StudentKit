import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { roadmaps } from '@/config/roadmaps';
import { RoadmapDetailClient } from '@/features/roadmaps/roadmap-detail-client';

export function generateStaticParams() {
  return roadmaps.map((r) => ({ slug: r.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} Roadmap | ${siteConfig.name}`,
    description: `Interactive ${title} roadmap with step-by-step learning path, resources, and progress tracking.`,
    openGraph: {
      title: `${title} Roadmap | ${siteConfig.name}`,
      description: `Interactive ${title} roadmap with step-by-step learning path, resources, and progress tracking.`,
      type: 'website',
      images: [{ url: `/og/roadmaps-${slug}.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <RoadmapDetailClient slug={slug} />;
}
