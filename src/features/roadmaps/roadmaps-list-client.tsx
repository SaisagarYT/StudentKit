'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Map,
  Code,
  Server,
  Smartphone,
  Brain,
  Shield,
  Cloud,
  Database,
  Clock,
  BookOpen,
  Blocks,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StreakBanner } from '@/components/engagement/streak-banner';
import { RoadmapProgressCard } from '@/components/engagement/roadmap-progress-card';
import { fetchAllRoadmaps, type RoadmapListEntry } from '@/lib/firebase/roadmaps';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { roadmaps as staticRoadmaps } from '@/config/roadmaps';

const ICON_MAP: Record<string, typeof Code> = {
  Code,
  Server,
  Database,
  Brain,
  Smartphone,
  Cloud,
  Shield,
  Map,
  Blocks,
};

function getIcon(iconName: string) {
  return ICON_MAP[iconName] || Map;
}

export function RoadmapsListClient() {
  const [roadmaps, setRoadmaps] = useState<RoadmapListEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (isFirebaseConfigured) {
          const data = await fetchAllRoadmaps();
          if (data.length > 0) {
            setRoadmaps(data);
            return;
          }
        }
      } catch {
        // Fall through to static fallback
      }

      // Fallback: use static config data
      const fallback: RoadmapListEntry[] = staticRoadmaps.map((r) => ({
        slug: r.slug,
        title: r.title,
        description: r.description,
        icon: r.icon || 'Map',
        accent: r.accent || '#C7FF3D',
        totalTime: r.totalTime,
        totalTopics: r.stages.reduce((sum, s) => sum + s.topics.length, 0),
        stageCount: r.stages.length,
      }));
      setRoadmaps(fallback);
    }

    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-8 md:py-16">
        <div className="container-main">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent-primary)]">
              Learn
            </span>
            <h1 className="mt-3 text-h1 font-bold tracking-tight">
              Interactive{' '}
              <span className="font-serif italic font-normal">Roadmaps</span>
            </h1>
            <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
              Step-by-step career and technology paths with topics, resources,
              projects, and progress tracking. Know exactly what to learn next.
            </p>
          </div>
          <div className="mt-16 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="py-8 md:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent-primary)]">
            Learn
          </span>
          <h1 className="mt-3 text-h1 font-bold tracking-tight">
            Interactive{' '}
            <span className="font-serif italic font-normal">Roadmaps</span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
            Step-by-step career and technology paths with topics, resources,
            projects, and progress tracking. Know exactly what to learn next.
          </p>
        </div>

        {/* Streak */}
        <div className="mt-8">
          <StreakBanner />
        </div>

        {/* Roadmap Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roadmaps.map((roadmap) => {
            const Icon = getIcon(roadmap.icon);

            return (
              <Link
                key={roadmap.slug}
                href={`/roadmaps/view?slug=${roadmap.slug}`}
                className="group relative p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-md transition-all duration-200"
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ backgroundColor: `${roadmap.accent}20` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color:
                        roadmap.accent === '#C7FF3D'
                          ? '#6B8F00'
                          : roadmap.accent.replace('FF', 'CC'),
                    }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {roadmap.title}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--text-subtle)] leading-relaxed">
                  {roadmap.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
                      <Clock className="w-3 h-3" />
                      {roadmap.totalTime}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
                      <BookOpen className="w-3 h-3" />
                      {roadmap.totalTopics} topics
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-dark)] opacity-100 transition-opacity" />
                </div>
                <RoadmapProgressCard slug={roadmap.slug} totalTopics={roadmap.totalTopics} />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            More roadmaps coming soon
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            We&apos;re building more interactive paths. In the meantime, start
            with our available roadmaps.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-colors"
          >
            Explore tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
