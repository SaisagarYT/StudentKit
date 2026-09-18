'use client';

import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Choose your career track.',
    description:
      'Select from 9 comprehensive engineering roadmaps — Full-Stack, AI/ML, DevOps, Frontend, Backend, or Placement Prep.',
    tags: ['Full-Stack', 'AI Engineer', 'DevOps', 'Mobile'],
  },
  {
    number: '02',
    title: 'Master concepts & build systems.',
    description:
      'Work through milestones, build production-grade guided projects with architecture blueprints, and track your XP and streaks.',
    tags: ['System Architecture', 'Microservices', 'Real Projects'],
  },
  {
    number: '03',
    title: 'Ace technical interviews.',
    description:
      'Tackle 250+ curated DSA patterns, review high-yield CS fundamentals (OS, DBMS, CN), and generate an ATS-ready resume.',
    tags: ['DSA Patterns', 'CS Fundamentals', 'ATS Resume'],
  },
];

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="section-spacing">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span>Proven 3-Step Strategy</span>
          </div>
          <h2 className="text-h2 font-bold tracking-tight">
            How it works.
          </h2>
          <p className="mt-3 text-body-lg text-[var(--text-secondary)] max-w-xl">
            A frictionless, zero-distraction roadmap designed to get you from beginner to top-tier engineer.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative flex flex-col justify-between p-6 sm:p-7 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all shadow-sm"
            >
              {/* Header Step Number */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tighter text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] px-3 py-1 rounded-md leading-none">
                    {step.number}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
                    Phase {idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-[var(--border-soft)] flex flex-wrap gap-1.5">
                {step.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[var(--text-secondary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] px-2 py-0.5 rounded-sm"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[var(--color-success)]" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Link below workflow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/start"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors group"
          >
            <span>Ready to start your personalized track?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
