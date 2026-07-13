'use client';

import { useState, useRef, useEffect } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import gsap from 'gsap';

interface SalaryBreakdown {
  monthly: number;
  daily: number;
  hourly: number;
  weekly: number;
  annual: number;
}

export function SalaryForm() {
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'annual' | 'monthly'>('annual');
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    const annual = period === 'annual' ? val : val * 12;
    const monthly = annual / 12;

    setResult({
      annual,
      monthly,
      weekly: annual / 52,
      daily: annual / 260, // 5 working days × 52 weeks
      hourly: annual / (260 * 8),
    });
    trackToolUsage('salary-calculator');
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
              Salary Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-subtle)]">₹</span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="form-input pl-8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Period
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPeriod('annual')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  period === 'annual'
                    ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)]'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  period === 'monthly'
                    ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)]'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!amount}
          className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Calculate
        </button>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">
              Enter salary to see breakdown by period
            </p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Salary Breakdown
            </span>

            <div className="mt-6 space-y-4">
              <SalaryRow label="Annual" amount={result.annual} highlight />
              <SalaryRow label="Monthly" amount={result.monthly} />
              <SalaryRow label="Weekly" amount={result.weekly} />
              <SalaryRow label="Daily" amount={result.daily} sublabel="(5 working days)" />
              <SalaryRow label="Hourly" amount={result.hourly} sublabel="(8 hours/day)" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SalaryRow({
  label,
  amount,
  sublabel,
  highlight,
}: {
  label: string;
  amount: number;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${highlight ? 'bg-[var(--accent-career)]/10' : 'bg-[var(--bg-subtle)]'}`}>
      <div>
        <span className={`text-sm ${highlight ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-[var(--text-subtle)] ml-1">{sublabel}</span>
        )}
      </div>
      <span className={`text-sm font-semibold ${highlight ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
        ₹{Math.round(amount).toLocaleString('en-IN')}
      </span>
    </div>
  );
}
