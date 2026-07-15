import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Map, Code, Server, Smartphone, Brain, Shield, Cloud, Database, Clock, BookOpen, Blocks } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { roadmaps as liveRoadmaps } from '@/config/roadmaps';
import { cn } from '@/lib/utils';
import { StreakBanner } from '@/components/engagement/streak-banner';
import { RoadmapProgressCard } from '@/components/engagement/roadmap-progress-card';

export const metadata: Metadata = {
  title: `Roadmaps | ${siteConfig.name}`,
  description: 'Interactive career and technology roadmaps for students. Step-by-step paths with progress tracking for frontend, backend, AI, placements and more.',
  openGraph: {
    images: [{ url: '/og/roadmaps.png', width: 1200, height: 630 }],
  },
};

const allRoadmaps = [
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'HTML, CSS, JavaScript, React, and modern frontend tools.',
    icon: Code,
    accent: '#D8CCFF',
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    description: 'APIs, databases, authentication, and server architecture.',
    icon: Server,
    accent: '#A8F0E6',
  },
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    description: 'End-to-end web development from frontend to deployment.',
    icon: Database,
    accent: '#FFB36B',
  },
  {
    slug: 'ai-engineer',
    title: 'AI / ML Engineer',
    description: 'Machine learning, deep learning, NLP, and AI applications.',
    icon: Brain,
    accent: '#C7FF3D',
  },
  {
    slug: 'mobile-developer',
    title: 'Mobile Developer',
    description: 'Flutter, React Native, and native app development.',
    icon: Smartphone,
    accent: '#FFE066',
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'CI/CD, containers, cloud, and infrastructure as code.',
    icon: Cloud,
    accent: '#A8F0E6',
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Network security, ethical hacking, and threat analysis.',
    icon: Shield,
    accent: '#D8CCFF',
  },
  {
    slug: 'placement-preparation',
    title: 'Placement Preparation',
    description: 'DSA, aptitude, interviews, and campus placement strategy.',
    icon: Map,
    accent: '#FFB36B',
  },
  {
    slug: 'object-oriented-programming',
    title: 'Object Oriented Programming',
    description: 'Classes, inheritance, polymorphism, and design patterns in Java, Python, C++, and JS.',
    icon: Blocks,
    accent: '#D8CCFF',
  },
];

export default function RoadmapsPage() {
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
          {allRoadmaps.map((roadmap) => {
            const Icon = roadmap.icon;
            const liveData = liveRoadmaps.find((r) => r.slug === roadmap.slug);
            const isLive = !!liveData;
            const totalTopics = liveData
              ? liveData.stages.reduce((sum, s) => sum + s.topics.length, 0)
              : 0;

            const CardContent = (
              <>
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ backgroundColor: `${roadmap.accent}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: roadmap.accent === '#C7FF3D' ? '#6B8F00' : roadmap.accent.replace('FF', 'CC') }} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {roadmap.title}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--text-subtle)] leading-relaxed">
                  {roadmap.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {isLive ? (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
                        <Clock className="w-3 h-3" />
                        {liveData.totalTime}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
                        <BookOpen className="w-3 h-3" />
                        {totalTopics} topics
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <ArrowRight className={cn(
                    'w-3.5 h-3.5 transition-opacity',
                    isLive ? 'text-[var(--accent-dark)] opacity-100' : 'text-[var(--text-subtle)] opacity-0 group-hover:opacity-100'
                  )} />
                </div>
                {isLive && <RoadmapProgressCard slug={roadmap.slug} totalTopics={totalTopics} />}
              </>
            );

            if (isLive) {
              return (
                <Link
                  key={roadmap.slug}
                  href={`/roadmaps/${roadmap.slug}`}
                  className="group relative p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-md transition-all duration-200"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div
                key={roadmap.slug}
                className="group relative p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all duration-200"
              >
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            More roadmaps coming soon
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            We&apos;re building interactive paths for Backend, Full Stack, AI/ML, Mobile, DevOps, and Cybersecurity. In the meantime, start with our available roadmaps.
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
