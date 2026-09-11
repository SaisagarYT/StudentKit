import { Metadata } from 'next';
import { staticProjects, getProjectBySlug } from '@/config/projects';
import { CmsProjectViewer } from '@/features/projects/cms-project-viewer';
import { siteConfig } from '@/config/site';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = staticProjects.map((project) => ({
    slug: project.slug,
  }));
  return slugs.length > 0 ? slugs : [{ slug: '_' }];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: `Project | ${siteConfig.name}`,
    };
  }

  const title = `${project.title} — Guided Project`;
  const description =
    project.shortDescription ||
    project.description ||
    'Guided learning project with milestones, architecture, and roadmap connections.';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: 'article',
      url: `${siteConfig.url}/projects/${slug}`,
      images: [
        {
          url: `/og/projects.png`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: ['/og/projects.png'],
    },
  };
}

import { Suspense } from 'react';

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center">
          <div className="w-6 h-6 border-2 border-[var(--text-subtle)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CmsProjectViewer slug={slug} />
    </Suspense>
  );
}

