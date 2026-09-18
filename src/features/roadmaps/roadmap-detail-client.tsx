'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Code2,
  ArrowRight,
  Loader2,
  FolderKanban,
  GitFork,
  MessageSquare,
  Target,
  Map,
} from 'lucide-react';
import { motion } from 'motion/react';
import { InteractiveRoadmap } from './interactive-roadmap';
import { TrackView } from './track-view';
import { fetchRoadmapBySlug } from '@/lib/firebase/roadmaps';
import { isFirebaseConfigured } from '@/lib/firebase/client';
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
        setRoadmap(null);
      } catch (err) {
        console.error('[RoadmapDetail] Failed to load roadmap from backend:', err);
        setRoadmap(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-subtle)] mx-auto mb-4">
          <Map className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[var(--text-primary)]">
          Roadmap Not Found
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
          This roadmap does not exist in the database or has not been published yet.
        </p>
        <Link
          href="/roadmaps"
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all roadmaps
        </Link>
      </div>
    );
  }

  const totalTopics = roadmap.stages.reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Roadmaps</span>
        </Link>

        {/* Roadmap Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-8"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
            {roadmap.title}{' '}
            <span className="font-serif italic font-normal text-[var(--accent-dark)]">Roadmap</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {roadmap.description}
          </p>

          <div className="flex items-center gap-5 mt-4">
            <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-subtle)]">
              <Clock className="w-3.5 h-3.5" />
              <span>{roadmap.totalTime}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-subtle)]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{totalTopics} topics across {roadmap.stages.length} stages</span>
            </span>
          </div>

          {/* Languages Supported */}
          {roadmap.languages && roadmap.languages.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Code2 className="w-4 h-4 text-[var(--text-subtle)]" />
              {roadmap.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Track View */}
        <TrackView type="roadmap" slug={slug} />

        {/* Interactive Roadmap Mind-Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8"
        >
          <InteractiveRoadmap roadmap={roadmap} />
        </motion.div>

        {/* Continue Your Journey Cross-Links */}
        <div className="mt-16 border-t border-[var(--border-soft)] pt-12">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Continue Your Engineering Journey
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
              Solidify your {roadmap.title.toLowerCase()} curriculum with hands-on guided projects, open-source codebases, and technical interviews.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <Link
              href="/projects"
              className="group flex flex-col gap-3 p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] shadow-xs transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)]">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Build Projects
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed">
                  Apply your {roadmap.title.toLowerCase()} concepts in full-stack applications
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/open-source"
              className="group flex flex-col gap-3 p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] shadow-xs transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)]">
                <GitFork className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Explore Open Source
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed">
                  Inspect production codebases and make pull requests
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/placement/dsa"
              className="group flex flex-col gap-3 p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] shadow-xs transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)]">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Practice DSA Sheet
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed">
                  250+ curated problems covering foundational algorithms
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/placement/interview"
              className="group flex flex-col gap-3 p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] shadow-xs transition-all"
            >
              <div className="w-9 h-9 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  Interview Prep
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed">
                  STAR method, behavioral drills, and technical rounds
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] mt-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Related Roadmaps */}
          {roadmap.relatedRoadmaps && roadmap.relatedRoadmaps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-dark)]" />
                <span>Complementary Paths</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {roadmap.relatedRoadmaps.map((related) => {
                  const relationLabels: Record<string, string> = {
                    prerequisite: 'Prerequisite',
                    'builds-on': 'Next Step',
                    'shared-topics': 'Related Track',
                    alternative: 'Alternative',
                  };
                  const label = relationLabels[related.relation] || related.relation;

                  return (
                    <Link
                      key={related.slug}
                      href={`/roadmaps/view?slug=${related.slug}`}
                      className="group flex items-start gap-3 p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] shadow-xs transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-soft)]">
                            {label}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors capitalize">
                          {related.slug.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-[var(--text-subtle)] mt-1 leading-relaxed line-clamp-2">
                          {related.description}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
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
