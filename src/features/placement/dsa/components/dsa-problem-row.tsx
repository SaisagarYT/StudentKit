'use client';

import Link from 'next/link';
import { Check, Lightbulb, ExternalLink, Video, FileCode, Code2 } from 'lucide-react';
import type { DsaProblemListItem } from '@/lib/cms/types';
import { ProblemHints } from '../../problem-hints';

interface DsaProblemRowProps {
  problem: DsaProblemListItem;
  isDone: boolean;
  onToggle: (slug: string) => void;
  hintsOpen: boolean;
  onToggleHints: (slug: string) => void;
  hasEditorial: boolean;
  categoryPattern: string;
  onOpenSolution?: (problem: DsaProblemListItem) => void;
}

export function DsaProblemRow({
  problem,
  isDone,
  onToggle,
  hintsOpen,
  onToggleHints,
  hasEditorial,
  categoryPattern,
  onOpenSolution,
}: DsaProblemRowProps) {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'text-[var(--color-success)] border-[var(--border-soft)]';
      case 'medium':
        return 'text-[var(--color-warning)] border-[var(--border-soft)]';
      case 'hard':
        return 'text-[var(--color-error)] border-[var(--border-soft)]';
      default:
        return 'text-[var(--text-secondary)] border-[var(--border-soft)]';
    }
  };

  return (
    <div className="border-b border-[var(--border-soft)] last:border-b-0 transition-colors">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-[var(--bg-subtle)]/40 transition-colors">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(problem.slug)}
          className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            isDone
              ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
              : 'border-[var(--border-default)] hover:border-[var(--accent-dark)] bg-transparent'
          }`}
          title={isDone ? 'Mark as unsolved' : 'Mark as solved'}
          aria-label={`Mark ${problem.title} as ${isDone ? 'unsolved' : 'solved'}`}
        >
          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Problem Title */}
        <div className="flex-1 min-w-0 pr-2">
          {problem.link ? (
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs sm:text-sm font-medium hover:underline block truncate ${
                isDone
                  ? 'text-[var(--text-subtle)] line-through'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              {problem.title}
            </a>
          ) : (
            <span
              className={`text-xs sm:text-sm font-medium block truncate ${
                isDone
                  ? 'text-[var(--text-subtle)] line-through'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              {problem.title}
            </span>
          )}
        </div>

        {/* Difficulty Pill */}
        <span
          className={`px-2 py-0.5 text-[10px] font-mono font-bold capitalize rounded-sm bg-[var(--bg-subtle)] border shrink-0 ${getDifficultyBadge(
            problem.difficulty
          )}`}
        >
          {problem.difficulty}
        </span>

        {/* Curated list badges (Blind 75 / NeetCode 150) */}
        {problem.curatedLists?.includes('blind-75') && (
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-sm bg-[var(--accent-dark)]/10 text-[var(--accent-dark)] border border-[var(--accent-dark)]/20 shrink-0">
            Blind 75
          </span>
        )}

        {/* Companies tags (desktop) */}
        {problem.companies && problem.companies.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 shrink-0 max-w-[150px] overflow-hidden">
            {problem.companies.slice(0, 2).map((comp) => (
              <span
                key={comp}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-subtle)] truncate"
              >
                {comp}
              </span>
            ))}
            {problem.companies.length > 2 && (
              <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                +{problem.companies.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Solution Drawer button */}
        {(problem.codeSolutions || problem.approach || problem.description) && onOpenSolution && (
          <button
            type="button"
            onClick={() => onOpenSolution(problem)}
            className="flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-semibold bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--text-inverse)] text-[var(--text-primary)] border border-[var(--border-soft)] hover:border-[var(--accent-dark)] transition-colors cursor-pointer shrink-0"
            title="View Solution & Multi-Language Code"
            aria-label="View solution"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Solution</span>
          </button>
        )}

        {/* Actions group */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Hints Toggle */}
          <button
            type="button"
            onClick={() => onToggleHints(problem.slug)}
            className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
              hintsOpen
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title="Hints & Approach"
            aria-label="Toggle hints"
          >
            <Lightbulb className="w-3.5 h-3.5" />
          </button>

          {/* Video Solution Link */}
          {problem.videoSolution && (
            <a
              href={problem.videoSolution}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="Watch Video Solution"
              aria-label="Watch video solution"
            >
              <Video className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Editorial Article Link */}
          {hasEditorial && (
            <Link
              href={`/resources/view?slug=${problem.editorial}`}
              className="p-1.5 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="Read StudentKit Editorial"
              aria-label="Read editorial"
            >
              <FileCode className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* External Problem Link */}
          {problem.link && (
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              title="Open on LeetCode / Practice Platform"
              aria-label="Open problem link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Progressive Hints expansion */}
      {hintsOpen && (
        <ProblemHints problem={problem} categoryPattern={categoryPattern} />
      )}
    </div>
  );
}

