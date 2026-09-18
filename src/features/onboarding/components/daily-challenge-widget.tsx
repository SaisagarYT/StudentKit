'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, Zap, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { dsaProblemRepository } from '@/lib/cms/repository';
import type { DsaProblemListItem } from '@/lib/cms/types';

interface DailyChallengeWidgetProps {
  isSolved?: boolean;
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

export function DailyChallengeWidget({ isSolved: propSolved }: DailyChallengeWidgetProps) {
  const [problems, setProblems] = useState<DsaProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    setUserProgress(loadUserProgress());

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    setDayIndex(Math.floor((now.getTime() - start.getTime()) / 86400000));

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

  if (loading) {
    return (
      <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm animate-pulse space-y-3">
        <div className="h-5 w-32 bg-[var(--bg-subtle)] rounded-sm" />
        <div className="h-10 w-full bg-[var(--bg-subtle)] rounded-sm" />
        <div className="h-8 w-full bg-[var(--bg-subtle)] rounded-sm" />
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                Daily Challenge
              </h4>
            </div>
          </div>
        </div>

        <div className="py-6 text-center p-3 rounded-md bg-[var(--bg-subtle)]/40 border border-dashed border-[var(--border-soft)]">
          <Terminal className="w-6 h-6 mx-auto text-[var(--text-subtle)] opacity-40 mb-1.5" />
          <p className="text-xs font-semibold text-[var(--text-primary)]">No Daily Challenge Available</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            Daily challenges will unlock once algorithm problems are added via the Admin Dashboard.
          </p>
        </div>
      </motion.div>
    );
  }

  // Pick today's challenge deterministically from published database
  const dailyProblem = problems[dayIndex % problems.length];
  const isSolved = propSolved ?? Boolean(userProgress[dailyProblem.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
              Daily Challenge
            </h4>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-mono font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] px-2 py-0.5 rounded-sm">
          <Zap className="w-3 h-3 text-[var(--accent-dark)] fill-current" />
          +50 XP
        </span>
      </div>

      {/* Problem Title & Meta */}
      <div className="mb-3.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)] capitalize">
            {dailyProblem.difficulty}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">
            {dailyProblem.title}
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {dailyProblem.category.replace(/-/g, ' ')} pattern practice with step-by-step editorial solutions.
        </p>
      </div>

      {/* Company frequency badges */}
      {dailyProblem.companies && dailyProblem.companies.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="text-[10px] font-medium text-[var(--text-subtle)] flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Frequent in:
          </span>
          {dailyProblem.companies.slice(0, 3).map((comp) => (
            <span
              key={comp}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]"
            >
              {comp}
            </span>
          ))}
        </div>
      )}

      {/* Action Button */}
      <Link
        href="/placement/dsa"
        className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold rounded-sm transition-all shadow-sm ${
          isSolved
            ? 'border border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]/80'
            : 'bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:bg-[var(--accent-dark)]/90'
        }`}
      >
        {isSolved ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
            <span>Solved Today — Review Editorial</span>
          </>
        ) : (
          <>
            <span>Solve Daily Problem</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </Link>
    </motion.div>
  );
}
