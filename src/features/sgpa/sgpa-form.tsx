'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { Plus, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { calculateSGPA } from './sgpa.calculator';
import { type SubjectEntry, type SGPAResult } from './sgpa.types';

function createSubject(): SubjectEntry {
  return { id: crypto.randomUUID(), subject: '', gradePoints: undefined, credits: undefined };
}

export function SGPAForm() {
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    createSubject(),
    createSubject(),
    createSubject(),
    createSubject(),
  ]);
  const [result, setResult] = useState<SGPAResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const addSubject = () => {
    setSubjects((prev) => [...prev, createSubject()]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = useCallback(
    (id: string, field: keyof SubjectEntry, value: string) => {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                [field]:
                  field === 'subject'
                    ? value
                    : value === ''
                      ? undefined
                      : Number(value),
              }
            : s
        )
      );
    },
    []
  );

  const handleCalculate = () => {
    const calcResult = calculateSGPA(subjects);
    setResult(calcResult);
    trackToolUsage('sgpa-calculator');
  };

  useEffect(() => {
    if (!result || !resultRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="space-y-3">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-3 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            <span>Subject</span>
            <span>Grade Pts</span>
            <span>Credits</span>
            <span className="w-9" />
          </div>

          {subjects.map((sub, index) => (
            <div key={sub.id} className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-3 items-center">
              <input
                type="text"
                value={sub.subject}
                onChange={(e) => updateSubject(sub.id, 'subject', e.target.value)}
                placeholder={`Subject ${index + 1}`}
                className="form-input"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={sub.gradePoints ?? ''}
                onChange={(e) => updateSubject(sub.id, 'gradePoints', e.target.value)}
                placeholder="0-10"
                className="form-input"
              />
              <input
                type="number"
                min="1"
                max="10"
                value={sub.credits ?? ''}
                onChange={(e) => updateSubject(sub.id, 'credits', e.target.value)}
                placeholder="Cr"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeSubject(sub.id)}
                disabled={subjects.length <= 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-subtle)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSubject}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] border border-dashed border-[var(--border-default)] rounded-xl hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>

        <button
          type="button"
          onClick={handleCalculate}
          className="mt-4 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
        >
          Calculate SGPA
        </button>
      </div>

      {/* Results */}
      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">
              Add subjects with grade points and credits to calculate SGPA
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Semester GPA
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                {result.sgpa.toFixed(2)}
              </span>
              <span className="text-lg font-medium text-[var(--text-subtle)]">/ 10</span>
            </div>

            <div className="mt-6 h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent-college)] transition-all duration-700 ease-out"
                style={{ width: `${(result.sgpa / 10) * 100}%` }}
              />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-center">
                <span className="text-xs text-[var(--text-subtle)]">Subjects</span>
                <div className="mt-1 text-lg font-semibold">{result.subjectCount}</div>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-center">
                <span className="text-xs text-[var(--text-subtle)]">Credits</span>
                <div className="mt-1 text-lg font-semibold">{result.totalCredits}</div>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-center">
                <span className="text-xs text-[var(--text-subtle)]">Total Pts</span>
                <div className="mt-1 text-lg font-semibold">{result.totalGradePoints.toFixed(0)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
