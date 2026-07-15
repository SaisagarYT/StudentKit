import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Code2, ArrowRight } from 'lucide-react';
import { getRoadmapBySlug, roadmaps } from '@/config/roadmaps';
import { InteractiveRoadmap } from '@/features/roadmaps/interactive-roadmap';
import { TrackView } from '@/features/roadmaps/track-view';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return roadmaps.map((r) => ({ slug: r.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmapBySlug(slug);
  if (!roadmap) return {};

  return {
    title: `${roadmap.title} Roadmap | ${siteConfig.name}`,
    description: roadmap.description,
    openGraph: {
      title: `${roadmap.title} Roadmap | ${siteConfig.name}`,
      description: roadmap.description,
      type: 'website',
      images: [{ url: `/og/roadmaps-${slug}.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const roadmap = getRoadmapBySlug(slug);
  if (!roadmap) return notFound();

  const totalTopics = roadmap.stages.reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <div className="py-8 md:py-12">
      <div className="container-main">
        {/* Back link */}
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All Roadmaps
        </Link>

        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="text-h1 font-bold tracking-tight">
            {roadmap.title}{' '}
            <span className="font-serif italic font-normal">Roadmap</span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
            {roadmap.description}
          </p>
          <div className="flex items-center gap-6 mt-6">
            <span className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
              <Clock className="w-4 h-4" />
              {roadmap.totalTime}
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--text-subtle)]">
              <BookOpen className="w-4 h-4" />
              {totalTopics} topics across {roadmap.stages.length} stages
            </span>
          </div>

          {/* Language options */}
          {roadmap.languages && roadmap.languages.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <Code2 className="w-4 h-4 text-[var(--text-subtle)]" />
              {roadmap.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 text-xs font-medium rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Roadmap */}
        <TrackView type="roadmap" slug={slug} />
        <div className="mt-12">
          <InteractiveRoadmap roadmap={roadmap} />
        </div>

        {/* Related Roadmaps */}
        {roadmap.relatedRoadmaps && roadmap.relatedRoadmaps.length > 0 && (
          <div className="mt-16 border-t border-[var(--border-soft)] pt-12">
            <h2 className="text-h3 font-bold mb-6">Related Roadmaps</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roadmap.relatedRoadmaps.map((related) => {
                const linkedRoadmap = getRoadmapBySlug(related.slug);
                if (!linkedRoadmap) return null;
                return (
                  <Link
                    key={related.slug}
                    href={`/roadmaps/${related.slug}`}
                    className="group flex flex-col gap-2 p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:underline">
                        {linkedRoadmap.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {related.description}
                    </span>
                    <span className="mt-auto pt-2 text-[10px] uppercase tracking-wider font-medium text-[var(--text-subtle)] opacity-70">
                      {related.relation.replace('-', ' ')}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
