'use client';

import Link from 'next/link';
import { Terminal, ArrowRight, Zap, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface DailyChallengeWidgetProps {
  isSolved: boolean;
}

export function DailyChallengeWidget({ isSolved }: DailyChallengeWidgetProps) {
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
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)]">
            Easy
          </span>
          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            Two Sum (#1)
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          Given an array of integers and a target integer, return indices of the two numbers that add up to target.
        </p>
      </div>

      {/* Company frequency badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <span className="text-[10px] font-medium text-[var(--text-subtle)] flex items-center gap-1">
          <Building2 className="w-3 h-3" /> Frequent in:
        </span>
        {['Google', 'Amazon', 'Meta'].map((comp) => (
          <span
            key={comp}
            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]"
          >
            {comp}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <Link
        href="/challenges"
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
