'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  interviewSections,
  companyPatterns,
  starMethod,
  resumeTips,
} from '@/config/placement/interview';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import { logXpEvent } from '@/lib/xp';
import { InterviewTabsNav, type InterviewTabType } from './interview/components/interview-tabs-nav';
import { InterviewQuestionsView } from './interview/components/interview-questions-view';
import { InterviewCompaniesView } from './interview/components/interview-companies-view';
import { InterviewStarView } from './interview/components/interview-star-view';
import { InterviewResumeView } from './interview/components/interview-resume-view';

const STORAGE_KEY = 'sk-interview-progress';

function loadPreparedProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePreparedProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    emitProgressChanged();
  } catch {}
}

export function InterviewPrepView() {
  const [activeTab, setActiveTab] = useState<InterviewTabType>('questions');
  const [preparedIds, setPreparedIds] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPreparedIds(loadPreparedProgress());
    setMounted(true);
  }, []);

  const togglePrepared = useCallback((questionId: string) => {
    setPreparedIds((prev) => {
      const next = { ...prev, [questionId]: !prev[questionId] };
      savePreparedProgress(next);
      if (next[questionId]) {
        logXpEvent('CS_TOPIC', 'Interview question prepared');
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(
      'Are you sure you want to reset your interview preparation checklist? This cannot be undone.'
    );
    if (!confirmed) return;

    setPreparedIds({});
    savePreparedProgress({});
  }, []);

  const totalQuestions = useMemo(
    () => interviewSections.reduce((sum, s) => sum + s.questions.length, 0),
    []
  );

  const totalResumeRules = useMemo(
    () => resumeTips.reduce((sum, s) => sum + s.tips.length, 0),
    []
  );

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <InterviewTabsNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          questions: totalQuestions,
          companies: companyPatterns.length,
          star: starMethod.length,
          resume: totalResumeRules,
        }}
      />

      {/* Tab Content Views */}
      {activeTab === 'questions' && (
        <InterviewQuestionsView
          sections={interviewSections}
          preparedIds={preparedIds}
          onTogglePrepared={togglePrepared}
          onResetProgress={handleReset}
          mounted={mounted}
        />
      )}

      {activeTab === 'companies' && (
        <InterviewCompaniesView companies={companyPatterns} />
      )}

      {activeTab === 'star' && (
        <InterviewStarView steps={starMethod} />
      )}

      {activeTab === 'resume' && (
        <InterviewResumeView sections={resumeTips} />
      )}
    </div>
  );
}
