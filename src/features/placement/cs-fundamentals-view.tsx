'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { csSubjects, type CsSubject } from '@/config/placement/cs-fundamentals';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { logXpEvent } from '@/lib/xp';
import { CsStatsBar } from './cs/components/cs-stats-bar';
import { CsSubjectTabs } from './cs/components/cs-subject-tabs';
import { CsSearchBar } from './cs/components/cs-search-bar';
import { CsSubtopicAccordion } from './cs/components/cs-subtopic-accordion';
import { SearchX } from 'lucide-react';

const STORAGE_KEY = 'sk-cs-progress';

function loadProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    emitProgressChanged();
  } catch {}
}

export function CsFundamentalsView() {
  const { user: authUser } = useUserAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [activeSubject, setActiveSubject] = useState<string>(csSubjects[0]?.id || 'os');
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  const toggleConcept = useCallback((conceptId: string) => {
    setProgress((prev) => {
      const next = { ...prev, [conceptId]: !prev[conceptId] };
      saveProgress(next);
      if (next[conceptId]) {
        logXpEvent('CS_TOPIC', 'CS concept completed');
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(
      'Are you sure you want to reset all your CS Fundamentals progress? This cannot be undone.'
    );
    if (!confirmed) return;

    setProgress({});
    saveProgress({});
  }, []);

  const currentSubject = useMemo(
    () => csSubjects.find((s) => s.id === activeSubject) || csSubjects[0],
    [activeSubject]
  );

  const handleSelectSubject = useCallback((subjectId: string) => {
    setActiveSubject(subjectId);
    setExpandedSubtopic(null);
  }, []);

  const getSubjectProgress = useCallback(
    (subject: CsSubject) => {
      const total = subject.subtopics.reduce((sum, st) => sum + st.concepts.length, 0);
      const done = subject.subtopics.reduce(
        (sum, st) => sum + st.concepts.filter((c) => progress[c.id]).length,
        0
      );
      return {
        total,
        done,
        percent: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    },
    [progress]
  );

  // Global counts across all 4 subjects
  const { totalConceptsAll, completedConceptsAll, overallPercent } = useMemo(() => {
    let total = 0;
    let done = 0;
    csSubjects.forEach((subject) => {
      subject.subtopics.forEach((st) => {
        total += st.concepts.length;
        done += st.concepts.filter((c) => progress[c.id]).length;
      });
    });
    return {
      totalConceptsAll: total,
      completedConceptsAll: done,
      overallPercent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [progress]);

  const currentSubjectStats = useMemo(
    () => getSubjectProgress(currentSubject),
    [currentSubject, getSubjectProgress]
  );

  const filteredSubtopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return currentSubject.subtopics;

    return currentSubject.subtopics.filter(
      (st) =>
        st.title.toLowerCase().includes(query) ||
        st.concepts.some(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.keyPoints.some((kp) => kp.toLowerCase().includes(query)) ||
            c.commonQuestions.some((q) => q.toLowerCase().includes(query))
        )
    );
  }, [currentSubject, search]);

  return (
    <div className="w-full">
      {/* Sticky Cockpit Stats Bar */}
      <CsStatsBar
        completedCount={completedConceptsAll}
        totalConcepts={totalConceptsAll}
        percent={overallPercent}
        currentSubjectTitle={currentSubject.title}
        currentSubjectCompleted={currentSubjectStats.done}
        currentSubjectTotal={currentSubjectStats.total}
        currentSubjectPercent={currentSubjectStats.percent}
        mounted={mounted}
        onReset={handleReset}
        authUser={authUser}
      />

      {/* Segmented Subject Selector Tabs */}
      <CsSubjectTabs
        subjects={csSubjects}
        activeSubjectId={activeSubject}
        onSelectSubject={handleSelectSubject}
        getSubjectProgress={getSubjectProgress}
        mounted={mounted}
      />

      {/* Search Input Bar */}
      <CsSearchBar
        search={search}
        onSearchChange={setSearch}
        placeholder={`Search concepts, key points, or questions in ${currentSubject.title}...`}
        matchedCount={filteredSubtopics.length}
        totalCount={currentSubject.subtopics.length}
      />

      {/* Subtopics List / Accordions */}
      {filteredSubtopics.length > 0 ? (
        <div className="space-y-3">
          {filteredSubtopics.map((subtopic) => (
            <CsSubtopicAccordion
              key={subtopic.id}
              subtopic={subtopic}
              isExpanded={
                search.trim().length > 0 ? true : expandedSubtopic === subtopic.id
              }
              onToggle={() =>
                setExpandedSubtopic((prev) => (prev === subtopic.id ? null : subtopic.id))
              }
              progress={progress}
              onToggleConcept={toggleConcept}
              mounted={mounted}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-[var(--border-soft)] rounded-md bg-[var(--bg-surface)]">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-subtle)] mb-3">
            <SearchX className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No concepts matched &ldquo;{search}&rdquo;
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search keywords or clear the filter to view all topics in {currentSubject.title}.
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--border-soft)] transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
