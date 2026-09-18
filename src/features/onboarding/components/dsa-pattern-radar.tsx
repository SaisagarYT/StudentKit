'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Binary, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { dsaProblemRepository } from '@/lib/cms/repository';
import type { DsaProblemListItem } from '@/lib/cms/types';
import { dsaTopicsMeta } from '@/config/placement/dsa-topics';

interface DsaPatternRadarProps {
  dsaSolved?: number;
}

const STORAGE_KEY = 'sk-dsa-progress';

function loadUserProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function DsaPatternRadar({ dsaSolved: _dsaSolved = 0 }: DsaPatternRadarProps) {
  const [problems, setProblems] = useState<DsaProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUserProgress(loadUserProgress());

    dsaProblemRepository
      .listPublished()
      .then((items) => {
        setProblems(items);
        setLoading(false);
      })
      .catch(() => {
        setProblems([]);
        setLoading(false);
      });
  }, []);

  const totalCurated = problems.length;
  // Calculate verified solved count: only count if problem actually exists in published database
  const solvedCount = problems.filter((p) => userProgress[p.id]).length;
  const overallPercent = totalCurated > 0 ? Math.round((solvedCount / totalCurated) * 100) : 0;

  // Derive patterns dynamically from database problems
  const patterns = dsaTopicsMeta
    .map((topic) => {
      const topicProblems = problems.filter((p) => p.category === topic.id);
      const completed = topicProblems.filter((p) => userProgress[p.id]).length;
      return {
        name: topic.title,
        completed,
        total: topicProblems.length,
      };
    })
    .filter((p) => p.total > 0);

  if (loading) {
    return (
      <div className="p-5 md:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-48 bg-[var(--bg-subtle)] rounded-sm" />
        <div className="h-16 w-full bg-[var(--bg-subtle)] rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-8 bg-[var(--bg-subtle)] rounded-sm" />
          <div className="h-8 bg-[var(--bg-subtle)] rounded-sm" />
        </div>
      </div>
    );
  }

  if (totalCurated === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-5 md:p-6 rounded-md border border-dashed border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)] text-xs font-bold uppercase tracking-wider">
              <Binary className="w-3.5 h-3.5" />
              Placement Readiness
            </span>
          </div>

          <Link
            href="/placement/dsa"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-dark)] hover:underline shrink-0"
          >
            <span>Open DSA Sheet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="py-10 text-center p-6 rounded-md bg-[var(--bg-subtle)]/40">
          <Binary className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-40 mb-3" />
          <h4 className="text-sm font-bold text-[var(--text-primary)]">
            No DSA Problems Published Yet
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-md mx-auto leading-relaxed">
            Algorithmic patterns and placement readiness tracking will automatically calculate and display here once problems are published from the Admin Dashboard.
          </p>
        </div>
      </motion.div>
    );
  }

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
            <span className="text-xs font-semibold text-[var(--text-subtle)] font-mono">
              DSA Sheet ({totalCurated} Problems)
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
              <AnimatedCounter value={solvedCount} />
              <span className="text-xs text-[var(--text-subtle)] font-normal ml-1">
                / {totalCurated}
              </span>
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
        {patterns.map((pat) => {
          const patPercent = pat.total > 0 ? Math.min(100, Math.round((pat.completed / pat.total) * 100)) : 0;
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
