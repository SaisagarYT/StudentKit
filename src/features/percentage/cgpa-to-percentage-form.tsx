'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  convertCGPAToPercentage,
  getFormulaOptions,
  type ConversionFormula,
  type CGPAToPercentageResult,
} from './percentage.calculator';

export function CGPAToPercentageForm() {
  const [cgpa, setCgpa] = useState<string>('');
  const [formula, setFormula] = useState<ConversionFormula>('generic');
  const [result, setResult] = useState<CGPAToPercentageResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const formulaOptions = getFormulaOptions();

  const handleCalculate = () => {
    const val = parseFloat(cgpa);
    if (isNaN(val) || val < 0 || val > 10) return;
    setResult(convertCGPAToPercentage(val, formula));
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
              CGPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.5"
              className="form-input"
            />
            <p className="mt-1.5 text-xs text-[var(--text-subtle)]">
              Enter your CGPA on a 10-point scale
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Conversion Formula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value as ConversionFormula)}
              className="form-input"
            >
              {formulaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-[var(--text-subtle)]">
              Select the formula used by your university
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!cgpa}
          className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Convert to Percentage
        </button>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">
              Enter your CGPA to see the equivalent percentage
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Equivalent Percentage
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                {result.percentage.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-[var(--text-subtle)]">%</span>
            </div>

            <div className="mt-8 p-4 bg-[var(--bg-subtle)] rounded-xl">
              <span className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                Formula Used
              </span>
              <p className="mt-2 font-mono text-sm text-[var(--text-primary)]">
                {result.formula}
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                {result.formulaName}
              </p>
            </div>

            <p className="mt-4 text-xs text-[var(--text-subtle)] leading-relaxed">
              Note: Different universities use different conversion formulas.
              This is an approximation — check your institution&apos;s official
              method for exact results.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
