'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { CsFundamentalsView } from '@/features/placement/cs-fundamentals-view';

export function CsPageClient() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/placement"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Placement Hub</span>
          </Link>

          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
            CS <span className="font-serif italic font-normal text-[var(--accent-dark)]">Fundamentals</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Every concept you need for theory and core rounds — Operating Systems, DBMS & SQL, Computer Networks, and OOPs.
            Master key definitions, architectural trade-offs, and common interview questions.
          </p>
        </motion.div>

        {/* CS Fundamentals Interactive View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <CsFundamentalsView />
        </motion.div>
      </div>
    </div>
  );
}
