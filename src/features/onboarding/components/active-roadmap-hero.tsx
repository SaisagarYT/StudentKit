'use client';

import Link from 'next/link';
import { Route, ArrowRight, Play, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { roadmaps } from '@/config/roadmaps';

interface ActiveRoadmapItem {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
}

interface ActiveRoadmapHeroProps {
  activeRoadmaps: ActiveRoadmapItem[];
}

export function ActiveRoadmapHero({ activeRoadmaps }: ActiveRoadmapHeroProps) {
  const primary = activeRoadmaps[0];
  const roadmapData = primary ? roadmaps.find((r) => r.slug === primary.slug) : null;

  // Derive next lesson info from roadmap data
  const nextLessonTitle = roadmapData?.stages?.[0]?.topics?.[0]?.title || 'Next Scheduled Topic';
  const nextLessonDuration = roadmapData?.stages?.[0]?.topics?.[0]?.timeEstimate || '15 min read';

  if (!primary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="p-6 md:p-8 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-default)] text-xs font-bold uppercase tracking-wider mb-3">
              <Route className="w-3.5 h-3.5" />
              <span>Career Roadmap</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              No active learning path selected yet
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-lg leading-relaxed">
              Choose from 9 structured engineering roadmaps with milestone checklists, curated tutorials, and portfolio projects.
            </p>
          </div>
          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-sm hover:bg-[var(--accent-dark)]/90 transition-all shadow-sm shrink-0"
          >
            Explore Roadmaps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="p-6 md:p-7 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm relative overflow-hidden"
    >
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Roadmap Name & Overall Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] text-xs font-bold uppercase tracking-wider">
              <Route className="w-3.5 h-3.5" />
              Active Path
            </span>
            <span className="text-xs font-medium text-[var(--text-subtle)] font-mono">
              {primary.completed} of {primary.total} topics mastered
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] capitalize">
            {primary.title}
          </h2>
        </div>

        {/* Progress percent badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-[var(--text-primary)] font-mono tabular-nums">
              {primary.percent}%
            </span>
            <p className="text-[10px] text-[var(--text-subtle)] uppercase font-semibold">Completed</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${primary.percent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-[var(--accent-dark)] rounded-full"
        />
      </div>

      {/* "Next Up" Lesson Banner */}
      <div className="p-4 sm:p-5 rounded-md bg-[var(--bg-subtle)]/70 border border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)] font-medium mb-1">
              <span>Next Up to Learn</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {nextLessonDuration}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {nextLessonTitle}
            </h4>
          </div>
        </div>

        <Link
          href={`/roadmaps/view?slug=${primary.slug}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-sm hover:bg-[var(--accent-dark)]/90 transition-all shadow-sm shrink-0"
        >
          <span>Resume Lesson</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Secondary Tracks (if multiple enrolled) */}
      {activeRoadmaps.length > 1 && (
        <div className="mt-5 pt-4 border-t border-[var(--border-soft)] flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-[var(--text-subtle)] uppercase tracking-wider text-[11px]">
            Other Enrolled Tracks:
          </span>
          {activeRoadmaps.slice(1, 4).map((r) => (
            <Link
              key={r.slug}
              href={`/roadmaps/view?slug=${r.slug}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
            >
              <span>{r.title}</span>
              <span className="font-bold text-[var(--accent-dark)] font-mono">{r.percent}%</span>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
