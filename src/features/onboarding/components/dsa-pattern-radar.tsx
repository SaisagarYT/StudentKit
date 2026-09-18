'use client';

import Link from 'next/link';
import { Binary, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface DsaPatternRadarProps {
  dsaSolved: number;
}

const keyPatterns = [
  { name: 'Arrays & Hashing', completed: 8, total: 20 },
  { name: 'Two Pointers', completed: 5, total: 12 },
  { name: 'Sliding Window', completed: 4, total: 10 },
  { name: 'Binary Trees', completed: 6, total: 18 },
  { name: 'Graphs & BFS/DFS', completed: 3, total: 16 },
  { name: 'Dynamic Programming', completed: 2, total: 20 },
];

export function DsaPatternRadar({ dsaSolved }: DsaPatternRadarProps) {
  const totalCurated = 250;
  const overallPercent = Math.round((dsaSolved / totalCurated) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-5 md:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)] text-xs font-bold uppercase tracking-wider">
              <Binary className="w-3.5 h-3.5" />
              Placement Readiness
            </span>
            <span className="text-xs font-semibold text-[var(--text-subtle)]">
              DSA Sheet (250+ Problems)
            </span>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            Algorithmic Patterns Progress
          </h3>
        </div>

        <Link
          href="/placement/dsa"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-dark)] hover:underline shrink-0"
        >
          <span>Open Full DSA Sheet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overview Stat Strip */}
      <div className="p-3.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-subtle)] font-medium">Problems Solved</p>
            <p className="text-base font-bold text-[var(--text-primary)] leading-none font-mono">
              <AnimatedCounter value={dsaSolved} />
              <span className="text-xs text-[var(--text-subtle)] font-normal ml-1">/ {totalCurated}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-[var(--text-subtle)] font-medium">Interview Readiness</p>
          <p className="text-base font-bold text-[var(--text-primary)] font-mono leading-none">
            {overallPercent}%
          </p>
        </div>
      </div>

      {/* Pattern Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
        {keyPatterns.map((pat) => {
          const patPercent = Math.min(100, Math.round((pat.completed / pat.total) * 100));
          return (
            <div key={pat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)] truncate">
                  {pat.name}
                </span>
                <span className="text-[11px] text-[var(--text-subtle)] font-mono">
                  {pat.completed}/{pat.total}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${patPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[var(--accent-dark)]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
