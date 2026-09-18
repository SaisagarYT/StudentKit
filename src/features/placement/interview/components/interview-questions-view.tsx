'use client';

import { useState, useMemo } from 'react';
import {
  User,
  MessageCircle,
  Code,
  Compass,
  HelpCircle,
  ChevronDown,
  Lightbulb,
  Check,
  Search,
  X,
  SearchX,
  RotateCcw,
  Quote,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Progress } from '@/components/ui/progress';
import type { InterviewSection } from '@/config/placement/interview';

interface InterviewQuestionsViewProps {
  sections: InterviewSection[];
  preparedIds: Record<string, boolean>;
  onTogglePrepared: (questionId: string) => void;
  onResetProgress: () => void;
  mounted: boolean;
}

const sectionIconMap: Record<string, LucideIcon> = {
  User,
  MessageCircle,
  Code,
  Compass,
};

export function InterviewQuestionsView({
  sections,
  preparedIds,
  onTogglePrepared,
  onResetProgress,
  mounted,
}: InterviewQuestionsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    // Default expand all sections
    const initial: Record<string, boolean> = {};
    sections.forEach((s) => {
      initial[s.id] = true;
    });
    return initial;
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Total questions across all sections
  const totalQuestions = useMemo(
    () => sections.reduce((sum, s) => sum + s.questions.length, 0),
    [sections]
  );

  const preparedCount = useMemo(
    () => Object.values(preparedIds).filter(Boolean).length,
    [preparedIds]
  );

  const percent = totalQuestions > 0 ? Math.round((preparedCount / totalQuestions) * 100) : 0;

  // Filtered sections and questions
  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sections
      .filter((section) => {
        if (selectedCategory !== 'all' && section.id !== selectedCategory) {
          return false;
        }
        return true;
      })
      .map((section) => {
        if (!query) return section;

        const matchingQuestions = section.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(query) ||
            q.tips.some((t) => t.toLowerCase().includes(query)) ||
            (q.sampleAnswer && q.sampleAnswer.toLowerCase().includes(query))
        );

        return {
          ...section,
          questions: matchingQuestions,
        };
      })
      .filter((section) => section.questions.length > 0);
  }, [sections, search, selectedCategory]);

  const totalFilteredQuestions = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.questions.length, 0),
    [filteredSections]
  );

  return (
    <div className="space-y-6">
      {/* Sticky Practice Cockpit Bar */}
      <div className="sticky top-16 md:top-18 z-20 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-soft)] rounded-md p-4 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <HelpCircle className="w-4 h-4 text-[var(--accent-dark)]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
                <AnimatedCounter value={mounted ? preparedCount : 0} />
                <span className="text-xs font-normal text-[var(--text-subtle)] ml-1">
                  / {totalQuestions} questions practiced
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-mono text-[var(--text-primary)]">
              {mounted ? percent : 0}%
            </span>
            <button
              type="button"
              onClick={onResetProgress}
              className="p-1.5 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Reset practice checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Progress value={mounted ? preparedCount : 0} max={totalQuestions} className="h-2" />
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-subtle)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interview questions, behavioral scenarios, answers..."
            className="w-full pl-10 pr-24 py-2.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-dark)] transition-colors shadow-sm"
          />
          {search && (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-2">
              <span className="text-[11px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                {totalFilteredQuestions} results
              </span>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Sections ({totalQuestions})
          </button>
          {sections.map((section) => {
            const isSelected = selectedCategory === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedCategory(section.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
                }`}
              >
                {section.title} ({section.questions.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Sections and Questions List */}
      {filteredSections.length > 0 ? (
        <div className="space-y-4">
          {filteredSections.map((section) => {
            const isSectionExpanded = !!expandedSections[section.id];
            const SectionIcon = sectionIconMap[section.icon] || HelpCircle;
            const sectionPreparedCount = section.questions.filter((q) => preparedIds[q.id]).length;
            const isAllSectionPrepared =
              section.questions.length > 0 && sectionPreparedCount === section.questions.length;

            return (
              <div
                key={section.id}
                className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden shadow-sm transition-all hover:border-[var(--border-default)]"
              >
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left select-none hover:bg-[var(--bg-subtle)]/40 transition-colors cursor-pointer"
                  aria-expanded={isSectionExpanded}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                      <SectionIcon className="w-4 h-4 text-[var(--accent-dark)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                          {section.title}
                        </h3>
                        {mounted && isAllSectionPrepared && (
                          <span className="text-[10px] font-mono font-bold text-[var(--color-success)] uppercase px-1.5 py-0.2 rounded-sm bg-[var(--bg-subtle)]">
                            Done
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-subtle)] truncate mt-0.5">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-medium text-[var(--text-subtle)]">
                      {mounted ? sectionPreparedCount : 0}/{section.questions.length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--text-subtle)] transition-transform duration-200 ${
                        isSectionExpanded ? 'rotate-180 text-[var(--text-primary)]' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Section Questions */}
                <AnimatePresence initial={false}>
                  {isSectionExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="border-t border-[var(--border-soft)] divide-y divide-[var(--border-soft)]"
                    >
                      {section.questions.map((q) => {
                        const isQExpanded = !!expandedQuestions[q.id];
                        const isPrepared = !!preparedIds[q.id];

                        return (
                          <div
                            key={q.id}
                            className={`transition-colors ${
                              isPrepared ? 'bg-[var(--bg-subtle)]/20' : 'bg-[var(--bg-surface)]'
                            }`}
                          >
                            {/* Question Row Header */}
                            <div className="flex items-start gap-3 p-4 select-none">
                              <button
                                type="button"
                                onClick={() => onTogglePrepared(q.id)}
                                className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                                  isPrepared
                                    ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                                    : 'border-[var(--border-default)] hover:border-[var(--accent-dark)] bg-transparent'
                                }`}
                                aria-label={`Mark question as ${isPrepared ? 'unpracticed' : 'practiced'}`}
                              >
                                {isPrepared && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </button>

                              <div
                                onClick={() => toggleQuestion(q.id)}
                                className="flex-1 min-w-0 cursor-pointer"
                              >
                                <span
                                  className={`text-sm font-medium leading-snug transition-colors ${
                                    isPrepared
                                      ? 'line-through text-[var(--text-subtle)]'
                                      : 'text-[var(--text-primary)] hover:text-[var(--accent-dark)]'
                                  }`}
                                >
                                  {q.question}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleQuestion(q.id)}
                                className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                                aria-label="Toggle answer tips"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isQExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Question Expanded Tips & Sample Answer */}
                            <AnimatePresence initial={false}>
                              {isQExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  className="overflow-hidden bg-[var(--bg-subtle)]/50 border-t border-[var(--border-soft)] px-4 sm:px-6 py-4"
                                >
                                  {/* Tips */}
                                  <div className="mb-4">
                                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                                      <Lightbulb className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                                      <span>Interview Strategy & Tips</span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {q.tips.map((tip, i) => (
                                        <div
                                          key={i}
                                          className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-subtle)] mt-1.5 shrink-0" />
                                          <span>{tip}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Sample Answer if present */}
                                  {q.sampleAnswer && (
                                    <div className="p-3 sm:p-4 rounded-md border-l-2 border-[var(--accent-dark)] bg-[var(--bg-surface)] shadow-xs">
                                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-1.5">
                                        <Quote className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                                        <span>Sample Benchmark Response</span>
                                      </div>
                                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                                        &ldquo;{q.sampleAnswer}&rdquo;
                                      </p>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-[var(--border-soft)] rounded-md bg-[var(--bg-surface)]">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-subtle)] mb-3">
            <SearchX className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No interview questions match &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search keywords or select a different category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--border-soft)] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

