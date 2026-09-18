'use client';

import { useState } from 'react';
import { Lightbulb, ChevronRight, Clock, HardDrive, Eye, EyeOff } from 'lucide-react';
import type { DsaProblemListItem } from '@/lib/cms/types';

interface ProblemHintsProps {
  problem: DsaProblemListItem;
  categoryPattern: string;
}

export function ProblemHints({ problem, categoryPattern }: ProblemHintsProps) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [showApproach, setShowApproach] = useState(false);

  const hints = problem.hints || [];
  const approach = problem.approach || '';
  const timeComplexity = problem.timeComplexity || '';
  const spaceComplexity = problem.spaceComplexity || '';

  const hasContent = hints.length > 0 || approach;

  if (!hasContent) {
    return (
      <div className="px-5 py-4 bg-[var(--bg-subtle)] border-t border-[var(--border-soft)]">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-[var(--text-subtle)] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-[var(--text-subtle)] mb-1.5">No specific hints yet for this problem. Try the general pattern:</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">{categoryPattern}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 bg-[var(--bg-subtle)] border-t border-[var(--border-soft)] space-y-3">
      {/* Hints - progressive reveal */}
      {hints.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Hints ({revealedHints}/{hints.length})
            </span>
          </div>

          <div className="space-y-2">
            {hints.map((hint, i) => (
              <div key={i}>
                {i < revealedHints ? (
                  <div className="flex items-start gap-2 pl-1">
                    <ChevronRight className="w-3 h-3 text-[var(--accent-dark)] mt-0.5 shrink-0" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{hint}</p>
                  </div>
                ) : i === revealedHints ? (
                  <button
                    onClick={() => setRevealedHints(i + 1)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] font-medium text-[var(--accent-dark)] hover:bg-[var(--bg-surface)] border border-[var(--border-soft)] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    Reveal Hint {i + 1}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approach - hidden by default */}
      {approach && (
        <div className="pt-2 border-t border-[var(--border-soft)]">
          <button
            onClick={() => setShowApproach(!showApproach)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-2"
          >
            {showApproach ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showApproach ? 'Hide Approach' : 'Show Approach'}
          </button>

          {showApproach && (
            <div className="pl-1 space-y-2">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {approach}
              </p>

              {/* Complexity */}
              {(timeComplexity || spaceComplexity) && (
                <div className="flex items-center gap-4 pt-2">
                  {timeComplexity && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                      <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
                      {timeComplexity}
                    </span>
                  )}
                  {spaceComplexity && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                      <HardDrive className="w-3 h-3 text-[var(--text-subtle)]" />
                      {spaceComplexity}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
