'use client';

import { Target } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const stats = [
  { value: 250, suffix: '+', label: 'Curated Problems' },
  { value: 60, suffix: '+', label: 'Core CS Concepts' },
  { value: 12, suffix: '+', label: 'Target Tech Companies' },
  { value: 100, suffix: '%', label: 'Free & Open Access' },
];

export function PlacementHeader() {
  return (
    <div className="max-w-4xl mb-12">
      {/* Category Pill */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] mb-6 shadow-sm"
      >
        <Target className="w-3.5 h-3.5 text-[var(--text-primary)]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">
          Placement Hub • 0 to Offer
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]"
      >
        Crack Any{' '}
        <span className="font-serif italic font-normal text-[var(--accent-dark)]">Interview</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl"
      >
        Structured, battle-tested engineering preparation. Master algorithmic patterns, core CS fundamentals, and behavioral frameworks designed to take you from foundational syntax to FAANG-ready.
      </motion.p>

      {/* Stats Proof Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-center transition-all hover:border-[var(--border-default)] shadow-sm"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-mono">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs font-medium text-[var(--text-subtle)] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

