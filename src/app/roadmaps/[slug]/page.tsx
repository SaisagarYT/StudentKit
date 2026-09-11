import { Metadata } from 'next';
import { roadmaps, getRoadmapBySlug } from '@/config/roadmaps';
import { RoadmapDetailClient } from '@/features/roadmaps/roadmap-detail-client';
import { siteConfig } from '@/config/site';

interface RoadmapPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (roadmaps.length === 0) {
    return [{ slug: '_' }];
  }
  return roadmaps.map((roadmap) => ({
    slug: roadmap.slug,
  }));
}

export async function generateMetadata({ params }: RoadmapPageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmapBySlug(slug);

  if (!roadmap) {
    return {
      title: `Roadmap | ${siteConfig.name}`,
    };
  }

  const title = `${roadmap.title} Roadmap (2026)`;
  const description =
    roadmap.description ||
    `Step-by-step ${roadmap.title} learning roadmap with milestones, interactive checklist, and project guides.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: 'article',
      url: `${siteConfig.url}/roadmaps/${slug}`,
      images: [
        {
          url: `/og/roadmaps.png`,
          width: 1200,
          height: 630,
          alt: `${roadmap.title} Roadmap`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: ['/og/roadmaps.png'],
    },
  };
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { slug } = await params;
  return <RoadmapDetailClient slug={slug} />;
}

