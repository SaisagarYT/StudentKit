'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { calculateCTCToInHand, type CTCBreakdown } from './salary.calculator';

export function CTCForm() {
  const [ctc, setCtc] = useState<string>('');
  const [result, setResult] = useState<CTCBreakdown | null>(null);
  const [error, setError] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setError('');
    const val = parseFloat(ctc);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid CTC amount');
      return;
    }
    if (val < 100000) {
      setError('CTC should be entered as annual amount (e.g. 600000 for 6 LPA)');
      return;
    }
    setResult(calculateCTCToInHand({ annualCTC: val }));
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
              Annual CTC (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-subtle)]">₹</span>
              <input
                type="number"
                min="0"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="e.g. 800000"
                className="form-input pl-8"
              />
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-subtle)]">
              Enter your annual CTC in rupees (e.g. 800000 for 8 LPA)
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-xs font-medium text-[var(--text-subtle)]">Quick select</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[400000, 600000, 800000, 1000000, 1200000, 1500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCtc(String(val))}
                  className="px-3 py-1.5 text-xs font-medium border border-[var(--border-soft)] rounded-lg hover:bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-colors"
                >
                  {val >= 1000000 ? `${val / 1000000} Cr` : `${val / 100000} L`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-[var(--color-error)]">{error}</p>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!ctc}
          className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Calculate In-Hand Salary
        </button>

        <p className="mt-4 text-xs text-[var(--text-subtle)] leading-relaxed">
          This is an estimate based on standard deductions. Actual in-hand salary
          may vary based on your tax regime, investments, and company policies.
        </p>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">
              Enter your CTC to estimate monthly in-hand salary
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Monthly In-Hand (Estimated)
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-lg font-medium text-[var(--text-subtle)]">₹</span>
              <span className="text-4xl md:text-5xl font-bold tracking-tighter">
                {Math.round(result.monthlyInHand).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">
              ₹{Math.round(result.annualInHand).toLocaleString('en-IN')} / year
            </p>

            {/* Breakdown */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
                Breakdown
              </h3>
              <BreakdownRow label="Basic Pay" amount={result.basicPay} />
              <BreakdownRow label="HRA" amount={result.hra} />
              <BreakdownRow label="Special Allowance" amount={result.specialAllowance} />
              <div className="border-t border-[var(--border-soft)] pt-3 mt-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)] mb-3">
                  Deductions
                </h3>
                <BreakdownRow label="Employee PF" amount={-result.employeePF} isDeduction />
                <BreakdownRow label="Professional Tax" amount={-result.professionalTax} isDeduction />
                <BreakdownRow label="Income Tax (est.)" amount={-result.incomeTax} isDeduction />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  amount,
  isDeduction,
}: {
  label: string;
  amount: number;
  isDeduction?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className={`text-sm font-medium ${isDeduction ? 'text-[var(--color-error)]' : 'text-[var(--text-primary)]'}`}>
        {isDeduction ? '−' : ''}₹{Math.abs(Math.round(amount)).toLocaleString('en-IN')}
      </span>
    </div>
  );
}
