'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { calculateCGPA } from './cgpa.calculator';
import { type SemesterEntry, type CGPAResult } from './cgpa.types';
import { CGPAResultDisplay } from './cgpa-result';

function createSemester(): SemesterEntry {
  return { id: crypto.randomUUID(), sgpa: undefined, credits: undefined };
}

export function CGPAForm() {
  const [semesters, setSemesters] = useState<SemesterEntry[]>([
    createSemester(),
    createSemester(),
  ]);
  const [result, setResult] = useState<CGPAResult | null>(null);

  const addSemester = () => {
    setSemesters((prev) => [...prev, createSemester()]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSemester = useCallback(
    (id: string, field: 'sgpa' | 'credits', value: string) => {
      setSemesters((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, [field]: value === '' ? undefined : Number(value) }
            : s
        )
      );
    },
    []
  );

  const handleCalculate = () => {
    const calcResult = calculateCGPA(semesters);
    setResult(calcResult);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            <span>SGPA</span>
            <span>Credits</span>
            <span className="w-9" />
          </div>

          {semesters.map((sem, index) => (
            <div
              key={sem.id}
              className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
            >
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={sem.sgpa ?? ''}
                  onChange={(e) =>
                    updateSemester(sem.id, 'sgpa', e.target.value)
                  }
                  placeholder={`Sem ${index + 1}`}
                  className="form-input"
                />
              </div>
              <input
                type="number"
                min="1"
                max="50"
                value={sem.credits ?? ''}
                onChange={(e) =>
                  updateSemester(sem.id, 'credits', e.target.value)
                }
                placeholder="Credits"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => removeSemester(sem.id)}
                disabled={semesters.length <= 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-subtle)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove semester"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSemester}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] border border-dashed border-[var(--border-default)] rounded-xl hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Semester
        </button>

        <button
          type="button"
          onClick={handleCalculate}
          className="mt-4 w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
        >
          Calculate CGPA
        </button>
      </div>

      {/* Results */}
      <CGPAResultDisplay result={result} />
    </div>
  );
}
