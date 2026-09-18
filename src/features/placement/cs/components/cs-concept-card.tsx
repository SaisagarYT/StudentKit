'use client';

import { Check, BookOpen } from 'lucide-react';
import type { CsConcept } from '@/config/placement/cs-fundamentals';

interface CsConceptCardProps {
  concept: CsConcept;
  isDone: boolean;
  onToggle: () => void;
}

export function CsConceptCard({ concept, isDone, onToggle }: CsConceptCardProps) {
  return (
    <div
      className={`p-4 sm:p-5 border-b border-[var(--border-soft)] last:border-b-0 transition-colors ${
        isDone ? 'bg-[var(--bg-subtle)]/20' : 'bg-[var(--bg-surface)]'
      }`}
    >
      {/* Concept Header */}
      <div className="flex items-start gap-3 mb-2.5">
        <button
          type="button"
          onClick={onToggle}
          className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
            isDone
              ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
              : 'border-[var(--border-default)] hover:border-[var(--accent-dark)] bg-transparent'
          }`}
          aria-label={`Mark ${concept.title} as ${isDone ? 'incomplete' : 'completed'}`}
        >
          {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        <h4
          className={`text-sm font-semibold leading-tight transition-colors ${
            isDone
              ? 'line-through text-[var(--text-subtle)]'
              : 'text-[var(--text-primary)]'
          }`}
        >
          {concept.title}
        </h4>
      </div>

      {/* Key Points */}
      <div className="pl-8 space-y-1.5 mb-3">
        {concept.keyPoints.map((point, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-subtle)] mt-1.5 shrink-0" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* Common Interview Questions Viva Box */}
      {concept.commonQuestions.length > 0 && (
        <div className="ml-8 p-3 sm:p-3.5 rounded-r-md border-l-2 border-[var(--accent-dark)] bg-[var(--bg-subtle)]/70">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            <span>Common Interview Questions</span>
          </div>
          <div className="space-y-1.5">
            {concept.commonQuestions.map((question, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-snug">
                <span className="text-[10px] font-mono font-bold text-[var(--text-subtle)] shrink-0 mt-0.5">
                  Q.
                </span>
                <span>{question}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

