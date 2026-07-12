'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { calculateAge, type AgeResult } from './age.calculator';

export function AgeForm() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setError('');
    if (!birthDate) {
      setError('Please enter your date of birth');
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate || new Date().toISOString().split('T')[0]);

    if (birth > target) {
      setError('Date of birth cannot be in the future');
      return;
    }

    setResult(calculateAge(birth, target));
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
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="form-input"
              max={targetDate}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Calculate Age As Of
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="form-input"
            />
            <p className="mt-1.5 text-xs text-[var(--text-subtle)]">
              Defaults to today. Change to check age on a specific date.
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-[var(--color-error)]">{error}</p>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!birthDate}
          className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Calculate Age
        </button>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">
              Enter your date of birth to calculate your exact age
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Your Age
            </span>

            {/* Main age display */}
            <div className="mt-4 flex items-baseline gap-3">
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-bold tracking-tighter">{result.years}</span>
                <span className="block text-xs text-[var(--text-subtle)] mt-1">years</span>
              </div>
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-bold tracking-tighter">{result.months}</span>
                <span className="block text-xs text-[var(--text-subtle)] mt-1">months</span>
              </div>
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-bold tracking-tighter">{result.days}</span>
                <span className="block text-xs text-[var(--text-subtle)] mt-1">days</span>
              </div>
            </div>

            {/* Detailed stats */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
                <span className="text-xs text-[var(--text-subtle)]">Total Days</span>
                <div className="mt-1 text-lg font-semibold">{result.totalDays.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
                <span className="text-xs text-[var(--text-subtle)]">Total Weeks</span>
                <div className="mt-1 text-lg font-semibold">{result.totalWeeks.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
                <span className="text-xs text-[var(--text-subtle)]">Total Months</span>
                <div className="mt-1 text-lg font-semibold">{result.totalMonths}</div>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
                <span className="text-xs text-[var(--text-subtle)]">Next Birthday</span>
                <div className="mt-1 text-lg font-semibold">{result.nextBirthday} days</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
