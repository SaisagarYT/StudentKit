'use client';

import Link from 'next/link';
import { Binary, Layers, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const pillars = [
  {
    title: 'DSA Problem Sheet',
    tag: 'Primary • Coding Rounds',
    description: '250+ handpicked problems from Blind 75, NeetCode 150, and Striver SDE Sheet. Filter by difficulty, company, and algorithmic pattern.',
    href: '/placement/dsa',
    icon: Binary,
    stats: '15 Patterns • 250+ Problems',
    topics: ['Arrays & Hashing', 'Two Pointers', 'Trees', 'Graphs', 'DP'],
  },
  {
    title: 'CS Core Fundamentals',
    tag: 'Theory • Core Rounds',
    description: 'Operating Systems, DBMS & SQL, Computer Networks, and Object-Oriented Design. Crisp concept summaries, architecture diagrams, and viva Q&A.',
    href: '/placement/cs-fundamentals',
    icon: Layers,
    stats: '4 Subjects • 60+ Concepts',
    topics: ['OS Processes', 'SQL Indexing', 'TCP/IP Model', 'OOP Design'],
  },
  {
    title: 'Interview & Behavioral Prep',
    tag: 'Technical & HR Rounds',
    description: 'Master the STAR framework for behavioral rounds, project pitching formulas, situational scenarios, and company-wise interview rounds.',
    href: '/placement/interview',
    icon: MessageSquare,
    stats: '60+ Questions • 12 Companies',
    topics: ['STAR Framework', 'HR Strategy', 'Project Deep-Dive', 'Company Insights'],
  },
];

export function PlacementPillars() {
  return (
    <div className="mb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            Core Learning Tracks
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Three Pillars of Placement Readiness
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md">
          Every interview stage covered: from online coding tests to deep computer science fundamentals and senior manager behavioral rounds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={pillar.href}
                className="group flex flex-col h-full p-6 sm:p-7 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-all shadow-sm"
              >
                {/* Header with Icon and Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--accent-dark)] group-hover:text-[var(--text-inverse)] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                    {pillar.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {pillar.description}
                </p>

                {/* Topic Pills */}
                <div className="flex flex-wrap gap-1.5 my-5">
                  {pillar.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)]/70 text-[var(--text-secondary)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer Stats & Arrow */}
                <div className="pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[var(--text-subtle)]">
                    {pillar.stats}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)] group-hover:translate-x-1 transition-transform">
                    Explore Track
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

