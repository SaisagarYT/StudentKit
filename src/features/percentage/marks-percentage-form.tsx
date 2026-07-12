'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { calculateMarksPercentage, type MarksPercentageResult } from './percentage.calculator';

export function MarksPercentageForm() {
  const [obtained, setObtained] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [result, setResult] = useState<MarksPercentageResult | null>(null);
  const [error, setError] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setError('');
    const ob = parseFloat(obtained);
    const tot = parseFloat(total);

    if (isNaN(ob) || isNaN(tot)) {
      setError('Please enter valid numbers');
      return;
    }
    if (tot <= 0) {
      setError('Total marks must be greater than 0');
      return;
    }
    if (ob < 0) {
      setError('Obtained marks cannot be negative');
      return;
    }
    if (ob > tot) {
      setError('Obtained marks cannot exceed total marks');
      return;
    }

    setResult(calculateMarksPercentage(ob, tot));
  };

  useEffect(() => {
    if (!result || !resultRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Marks Obtained
            </label>
            <input
              type="number"
              min="0"
              value={obtained}
              onChange={(e) => setObtained(e.target.value)}
              placeholder="e.g. 420"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Total Marks
            </label>
            <input
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="e.g. 600"
              className="form-input"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-[var(--color-error)]">{error}</p>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!obtained || !total}
          className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Calculate Percentage
        </button>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">
              Enter marks to calculate percentage
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Your Percentage
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                {result.percentage.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-[var(--text-subtle)]">%</span>
            </div>

            <div className="mt-6 h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-700 ease-out"
                style={{ width: `${Math.min(result.percentage, 100)}%` }}
              />
            </div>

            <div className="mt-6 p-4 bg-[var(--bg-subtle)] rounded-xl">
              <span className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                Calculation
              </span>
              <p className="mt-2 font-mono text-sm text-[var(--text-primary)]">
                ({result.obtained} / {result.total}) × 100 = {result.percentage.toFixed(2)}%
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
