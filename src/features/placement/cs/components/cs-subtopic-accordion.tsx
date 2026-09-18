'use client';

import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '@/components/ui/progress';
import { CsConceptCard } from './cs-concept-card';
import type { CsSubtopic } from '@/config/placement/cs-fundamentals';

interface CsSubtopicAccordionProps {
  subtopic: CsSubtopic;
  isExpanded: boolean;
  onToggle: () => void;
  progress: Record<string, boolean>;
  onToggleConcept: (conceptId: string) => void;
  mounted: boolean;
}

export function CsSubtopicAccordion({
  subtopic,
  isExpanded,
  onToggle,
  progress,
  onToggleConcept,
  mounted,
}: CsSubtopicAccordionProps) {
  const totalConcepts = subtopic.concepts.length;
  const doneCount = subtopic.concepts.filter((c) => progress[c.id]).length;
  const isAllDone = totalConcepts > 0 && doneCount === totalConcepts;

  return (
    <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden transition-all hover:border-[var(--border-default)] shadow-sm mb-3">
      {/* Subtopic Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-4.5 text-left select-none hover:bg-[var(--bg-subtle)]/40 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-subtle)] shrink-0 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-[var(--text-primary)]' : ''
            }`}
          />
          <span className="text-sm font-bold text-[var(--text-primary)] truncate">
            {subtopic.title}
          </span>
          {mounted && isAllDone && (
            <span className="text-[10px] font-mono font-bold text-[var(--color-success)] uppercase px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] shrink-0">
              Done
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[var(--text-subtle)]">
              {mounted ? doneCount : 0}/{totalConcepts}
            </span>
            <Progress
              value={mounted ? doneCount : 0}
              max={totalConcepts}
              className="w-16 sm:w-20 h-1.5 hidden sm:inline-flex"
            />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[var(--border-soft)]"
          >
            <div className="divide-y divide-[var(--border-soft)]">
              {subtopic.concepts.map((concept) => (
                <CsConceptCard
                  key={concept.id}
                  concept={concept}
                  isDone={!!progress[concept.id]}
                  onToggle={() => onToggleConcept(concept.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

