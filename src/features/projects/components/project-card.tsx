'use client';

import Link from 'next/link';
import { Clock, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { BookmarkButton } from '@/components/engagement/bookmark-button';
import { cn } from '@/lib/utils';
import type { CuratedProject } from '@/config/projects';

interface ProjectCardProps {
  project: CuratedProject;
  featured?: boolean;
}

const DIFFICULTY_TOKENS: Record<
  string,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  beginner: {
    label: 'Beginner',
    textClass: 'text-[var(--color-success)]',
    bgClass: 'bg-[var(--bg-subtle)]',
    borderClass: 'border-[var(--border-soft)]',
  },
  intermediate: {
    label: 'Intermediate',
    textClass: 'text-[var(--color-warning)]',
    bgClass: 'bg-[var(--bg-subtle)]',
    borderClass: 'border-[var(--border-soft)]',
  },
  advanced: {
    label: 'Advanced',
    textClass: 'text-[var(--text-primary)]',
    bgClass: 'bg-[var(--bg-subtle)]',
    borderClass: 'border-[var(--border-soft)]',
  },
  expert: {
    label: 'Expert',
    textClass: 'text-[var(--color-error)]',
    bgClass: 'bg-[var(--bg-subtle)]',
    borderClass: 'border-[var(--border-soft)]',
  },
};

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const diff = DIFFICULTY_TOKENS[project.difficulty] || DIFFICULTY_TOKENS.beginner;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Link
        href={`/projects/view?slug=${project.slug}`}
        className={cn(
          'group relative flex flex-col h-full p-5 sm:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-xs transition-all',
          featured && 'border-l-4 border-l-[var(--accent-dark)]'
        )}
      >
        {/* Top bar: Difficulty + Featured + Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider border',
                diff.textClass,
                diff.bgClass,
                diff.borderClass
              )}
            >
              {diff.label}
            </span>

            {featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)]">
                <Star className="w-3 h-3 text-[var(--accent-dark)] fill-[var(--accent-dark)]" />
                Featured
              </span>
            )}
          </div>

          <div
            onClick={(e) => {
              // Prevent link navigation when clicking bookmark
              e.stopPropagation();
            }}
            className="shrink-0"
          >
            <BookmarkButton
              type="project"
              slug={project.slug}
              title={project.title}
              size="sm"
            />
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        {project.technologies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[var(--border-soft)] flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-soft)]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer info: Duration + CTA */}
        <div className="mt-4 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-subtle)] font-mono text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{project.estimatedDuration}</span>
          </div>

          <span className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] group-hover:translate-x-0.5 transition-all text-xs">
            View Architecture
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

