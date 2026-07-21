'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, ChevronDown, ChevronRight, Search, BookOpen } from 'lucide-react';
import * as Icons from 'lucide-react';
import { csSubjects, type CsSubject, type CsSubtopic } from '@/config/placement/cs-fundamentals';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';

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

function toPascalCase(str: string) {
  return str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

function getIcon(name: string, className?: string) {
  const key = toPascalCase(name);
  const Icon = Icons[key as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-5 h-5'} /> : null;
}

export function CsFundamentalsView() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [activeSubject, setActiveSubject] = useState<string>(csSubjects[0]?.id || '');
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  const toggleConcept = useCallback((conceptId: string) => {
    setProgress(prev => {
      const next = { ...prev, [conceptId]: !prev[conceptId] };
      saveProgress(next);
      return next;
    });
  }, []);

  const currentSubject = csSubjects.find(s => s.id === activeSubject) || csSubjects[0];

  const filteredSubtopics = search
    ? currentSubject.subtopics.filter(st =>
        st.title.toLowerCase().includes(search.toLowerCase()) ||
        st.concepts.some(c =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.keyPoints.some(kp => kp.toLowerCase().includes(search.toLowerCase()))
        )
      )
    : currentSubject.subtopics;

  const getSubjectProgress = (subject: CsSubject) => {
    const total = subject.subtopics.reduce((sum, st) => sum + st.concepts.length, 0);
    const done = subject.subtopics.reduce((sum, st) =>
      sum + st.concepts.filter(c => progress[c.id]).length, 0
    );
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  return (
    <div className="cs-view">
      <style>{`
        .cs-view { position: relative; }

        .cs-subjects-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .cs-subject-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid var(--border-soft);
          background: var(--bg-surface);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cs-subject-tab:hover { border-color: var(--border-default); color: var(--text-primary); }

        .cs-subject-tab.active {
          border-color: var(--accent-primary);
          background: var(--accent-dark);
          color: var(--accent-primary);
        }

        .cs-subject-percent {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--bg-subtle);
          color: var(--text-subtle);
        }

        .cs-subject-tab.active .cs-subject-percent {
          background: var(--accent-primary)/20;
          color: var(--accent-primary);
        }

        .cs-search {
          position: relative;
          margin-bottom: 20px;
        }

        .cs-search input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: 8px;
          border: 1px solid var(--border-default);
          background: var(--bg-surface);
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
        }

        .cs-search input:focus { border-color: var(--accent-primary); }
        .cs-search input::placeholder { color: var(--text-subtle); }
        .cs-search svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-subtle); }

        .cs-subtopic {
          border: 1px solid var(--border-soft);
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
          background: var(--bg-surface);
        }

        .cs-subtopic-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          cursor: pointer;
          transition: background 0.1s;
        }

        .cs-subtopic-header:hover { background: var(--bg-subtle); }

        .cs-subtopic-title { flex: 1; font-size: 14px; font-weight: 600; color: var(--text-primary); }

        .cs-subtopic-count {
          font-size: 11px;
          color: var(--text-subtle);
          font-variant-numeric: tabular-nums;
        }

        .cs-concepts { border-top: 1px solid var(--border-soft); }

        .cs-concept {
          padding: 16px 18px;
          border-bottom: 1px solid var(--border-soft);
        }

        .cs-concept:last-child { border-bottom: none; }

        .cs-concept-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .cs-concept-check {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          border: 2px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          background: transparent;
          flex-shrink: 0;
        }

        .cs-concept-check:hover { border-color: var(--accent-primary); }
        .cs-concept-check.done { background: #22c55e; border-color: #22c55e; }

        .cs-concept-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .cs-concept-title.done { text-decoration: line-through; color: var(--text-subtle); }

        .cs-key-points {
          padding-left: 30px;
          margin-bottom: 10px;
        }

        .cs-key-point {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 4px;
        }

        .cs-key-point::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-primary);
          margin-top: 6px;
          flex-shrink: 0;
        }

        .cs-questions {
          padding-left: 30px;
          padding: 10px 14px;
          margin-left: 30px;
          border-left: 2px solid var(--border-soft);
          background: var(--bg-subtle);
          border-radius: 0 8px 8px 0;
        }

        .cs-questions-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-subtle);
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cs-question {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 3px;
          padding-left: 12px;
          position: relative;
        }

        .cs-question::before {
          content: 'Q.';
          position: absolute;
          left: 0;
          font-weight: 600;
          color: var(--text-subtle);
          font-size: 10px;
        }

        @media (max-width: 640px) {
          .cs-subjects-nav { gap: 6px; }
          .cs-subject-tab { padding: 8px 12px; font-size: 12px; }
        }
      `}</style>

      {/* Subject tabs */}
      <div className="cs-subjects-nav">
        {csSubjects.map(subject => {
          const { percent } = getSubjectProgress(subject);
          return (
            <button
              key={subject.id}
              className={`cs-subject-tab ${activeSubject === subject.id ? 'active' : ''}`}
              onClick={() => { setActiveSubject(subject.id); setExpandedSubtopic(null); }}
            >
              {getIcon(subject.icon, 'w-4 h-4')}
              {subject.title}
              {mounted && percent > 0 && (
                <span className="cs-subject-percent">{percent}%</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="cs-search">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder={`Search in ${currentSubject.title}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Subtopics */}
      {filteredSubtopics.map(subtopic => {
        const isExpanded = expandedSubtopic === subtopic.id;
        const doneCount = subtopic.concepts.filter(c => progress[c.id]).length;

        return (
          <div key={subtopic.id} className="cs-subtopic">
            <div
              className="cs-subtopic-header"
              onClick={() => setExpandedSubtopic(isExpanded ? null : subtopic.id)}
            >
              {isExpanded
                ? <ChevronDown className="w-4 h-4 text-[var(--text-subtle)]" />
                : <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />
              }
              <span className="cs-subtopic-title">{subtopic.title}</span>
              <span className="cs-subtopic-count">
                {mounted ? doneCount : 0}/{subtopic.concepts.length}
              </span>
            </div>

            {isExpanded && (
              <div className="cs-concepts">
                {subtopic.concepts.map(concept => {
                  const isDone = !!progress[concept.id];
                  return (
                    <div key={concept.id} className="cs-concept">
                      <div className="cs-concept-header">
                        <button
                          className={`cs-concept-check ${isDone ? 'done' : ''}`}
                          onClick={() => toggleConcept(concept.id)}
                        >
                          {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </button>
                        <span className={`cs-concept-title ${isDone ? 'done' : ''}`}>
                          {concept.title}
                        </span>
                      </div>

                      <div className="cs-key-points">
                        {concept.keyPoints.map((point, i) => (
                          <div key={i} className="cs-key-point">{point}</div>
                        ))}
                      </div>

                      {concept.commonQuestions.length > 0 && (
                        <div className="cs-questions">
                          <div className="cs-questions-label">
                            <BookOpen className="w-3 h-3" />
                            Common Interview Questions
                          </div>
                          {concept.commonQuestions.map((q, i) => (
                            <div key={i} className="cs-question">{q}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
