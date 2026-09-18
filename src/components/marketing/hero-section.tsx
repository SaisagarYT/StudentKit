'use client';

import Link from 'next/link';
import { ArrowRight, Search, Map, Binary, FolderKanban, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroVisual } from './hero-visual';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const stats = [
  { value: 9, suffix: '+', label: 'Career Roadmaps', icon: Map },
  { value: 250, suffix: '+', label: 'DSA Patterns', icon: Binary },
  { value: 6, suffix: '+', label: 'Portfolio Projects', icon: FolderKanban },
  { value: 100, suffix: '%', label: 'Free & Open', icon: ShieldCheck },
];

const quickPills = [
  { label: 'Frontend Path', href: '/roadmaps/view?slug=frontend-developer' },
  { label: 'DSA Sheet', href: '/placement/dsa' },
  { label: 'React & Node Projects', href: '/projects' },
  { label: 'Interview Prep', href: '/placement/interview' },
  { label: 'Open Source', href: '/open-source' },
];

export function HeroSection() {
  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy & Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Tagline Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-semibold text-[var(--text-secondary)] mb-6">
              <span>Zero-cost engineering mastery for students</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-display font-bold tracking-tighter leading-[0.92]"
            >
              Learn.
              <br />
              Build.
              <br />
              <span className="font-serif italic font-normal text-gradient-primary">
                Get Hired
              </span>.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="mt-6 md:mt-8 text-body-lg text-[var(--text-secondary)] max-w-lg leading-relaxed"
            >
              Your entire engineering journey in one place — structured career
              paths, hands-on production projects, and interview prep that takes
              you from &ldquo;where do I start?&rdquo; to job-ready.
            </motion.p>

            {/* Primary CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-8 md:mt-10 flex flex-wrap gap-3.5">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/start"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-sm hover:opacity-90 transition-opacity shadow-sm"
                >
                  Start your journey
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/roadmaps"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border border-[var(--border-default)] text-[var(--text-primary)] rounded-sm hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] transition-all"
                >
                  Explore Roadmaps
                </Link>
              </motion.div>
            </motion.div>

            {/* Search prompt */}
            <motion.div variants={itemVariants} className="mt-8 md:mt-10">
              <div
                onClick={triggerSearch}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                className="flex items-center gap-3 px-4 py-3 border border-[var(--border-soft)] rounded-sm bg-[var(--bg-surface)] max-w-md cursor-pointer hover:border-[var(--accent-primary)] hover:ring-2 hover:ring-[var(--accent-primary)]/30 transition-all group shadow-sm"
              >
                <Search className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] transition-colors" />
                <span className="text-sm text-[var(--text-subtle)] group-hover:text-[var(--text-secondary)] transition-colors">
                  Search roadmaps, projects, DSA sheets...
                </span>
                <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-sm font-mono">
                  ⌘K
                </kbd>
              </div>

              {/* Quick Jump Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {quickPills.map((pill) => (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="px-2.5 py-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-subtle)] hover:bg-[var(--border-soft)] hover:text-[var(--text-primary)] rounded-sm transition-colors"
                  >
                    {pill.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Live Stats Proof Ticker */}
            <motion.div
              variants={itemVariants}
              className="mt-10 pt-8 border-t border-[var(--border-soft)] grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--text-primary)] leading-none">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-[11px] text-[var(--text-subtle)] mt-1 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right: Modern 3D Visual Widgets */}
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
