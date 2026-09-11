'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Code2, ArrowRight, Loader2, FolderKanban, GitFork, MessageSquare, Target } from 'lucide-react';
import { InteractiveRoadmap } from './interactive-roadmap';
import { TrackView } from './track-view';
import { fetchRoadmapBySlug } from '@/lib/firebase/roadmaps';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { getRoadmapBySlug } from '@/config/roadmaps';
import type { Roadmap } from '@/types/roadmap';

export function RoadmapDetailClient({ slug }: { slug: string }) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (isFirebaseConfigured) {
          const data = await fetchRoadmapBySlug(slug);
          if (data) {
            setRoadmap(data);
            return;
          }
        }
        // Fallback to static config if Firebase fails or roadmap not in Firestore
        const staticData = getRoadmapBySlug(slug);
        if (staticData) {
          setRoadmap(staticData);
        }
      } catch {
        // Fallback to static config on any error
        const staticData = getRoadmapBySlug(slug);
        if (staticData) {
          setRoadmap(staticData);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  if (!roadmap) {
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
                  className="px-2.5 py-1 text-xs font-medium rounded-sm border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Track View */}
        <TrackView type="roadmap" slug={slug} />

        {/* Interactive Roadmap */}
        <div className="mt-12">
          <InteractiveRoadmap roadmap={roadmap} />
        </div>

        {/* Continue Your Journey Section */}
        <div className="mt-16 border-t border-[var(--border-soft)] pt-12">
          <div className="mb-8">
            <h2 className="text-h3 font-bold text-[var(--text-primary)]">
              Continue your journey
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-lg">
              Complement this learning path with hands-on projects, open-source exploration, and interview preparation.
            </p>
          </div>

          {/* Action cards grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <Link
              href="/projects"
              className="group flex flex-col gap-3 p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-violet-500/10 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Build Projects
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                  Apply your {roadmap.title.toLowerCase()} skills with guided projects
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/open-source"
              className="group flex flex-col gap-3 p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-cyan-500/10 flex items-center justify-center">
                <GitFork className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Explore Open Source
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                  Study real-world codebases and start contributing
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/placement/dsa"
              className="group flex flex-col gap-3 p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Practice DSA
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                  250+ problems to sharpen problem-solving skills
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/placement/interview"
              className="group flex flex-col gap-3 p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-sm bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Interview Prep
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                  Practice questions for {roadmap.title.toLowerCase()} roles
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Related Roadmaps */}
          {roadmap.relatedRoadmaps && roadmap.relatedRoadmaps.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--text-subtle)]" />
                Continue with another path
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.relatedRoadmaps.map((related) => {
                  const relationLabels: Record<string, { label: string; color: string }> = {
                    'prerequisite': { label: 'Prerequisite', color: 'text-blue-500 bg-blue-500/10' },
                    'builds-on': { label: 'Next step', color: 'text-emerald-500 bg-emerald-500/10' },
                    'shared-topics': { label: 'Related', color: 'text-violet-500 bg-violet-500/10' },
                    'alternative': { label: 'Alternative', color: 'text-amber-500 bg-amber-500/10' },
                  };
                  const rel = relationLabels[related.relation] || { label: related.relation, color: 'text-[var(--text-subtle)] bg-[var(--bg-subtle)]' };

                  return (
                    <Link
                      key={related.slug}
                      href={`/roadmaps/${related.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${rel.color}`}>
                            {rel.label}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors capitalize">
                          {related.slug.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed line-clamp-2">
                          {related.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
