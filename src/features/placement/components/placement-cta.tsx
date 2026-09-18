'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight, Layers, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export function PlacementCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 md:p-12 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] relative overflow-hidden shadow-sm"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            Take Action Today
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Start Your Interview Preparation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Begin with 250+ handpicked DSA problems or revise high-yield Computer Science fundamentals. Track all your milestones locally in your browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/placement/dsa"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:bg-[var(--accent-dark)]/90 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open DSA Sheet</span>
          </Link>
          <Link
            href="/placement/cs-fundamentals"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>CS Fundamentals</span>
          </Link>
          <Link
            href="/placement/interview"
            className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Interview Q&A</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

