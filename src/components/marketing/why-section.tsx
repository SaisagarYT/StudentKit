'use client';

import { motion } from 'motion/react';
import { Route, Code2, Award, Zap } from 'lucide-react';

const benefits = [
  {
    number: '01',
    title: 'Structured Career Paths',
    description:
      'End tutorial paralysis. Every roadmap is broken down into ordered milestones, essential topics, curated tutorials, and practical assignments.',
    icon: Route,
  },
  {
    number: '02',
    title: 'Production-Grade Projects',
    description:
      'Build portfolio projects that impress tech recruiters — featuring microservices, WebSockets, vector databases, and system architecture blueprints.',
    icon: Code2,
  },
  {
    number: '03',
    title: '100% Free & Open Access',
    description:
      'All 250+ DSA patterns, core CS fundamentals (OS, DBMS, CN, OOPs), interactive roadmaps, and the ATS resume builder are completely open.',
    icon: Award,
  },
  {
    number: '04',
    title: 'Interview-Tested Rigor',
    description:
      'Curated questions mapped directly to real company hiring bars (Google, Amazon, Meta) with step-by-step approaches from brute force to optimal.',
    icon: Zap,
  },
];

export function WhySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="section-spacing bg-[var(--bg-surface)] border-y border-[var(--border-soft)]">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span>The StudentKit Difference</span>
          </div>
          <h2 className="text-h2 font-bold tracking-tight">
            Engineered for{' '}
            <span className="font-serif italic font-normal">clarity & depth</span>.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
            Everything you need to break into tech without expensive bootcamps, noisy communities, or fragmented tutorials.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-0"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.number}
                variants={itemVariants}
                className="group flex items-start gap-6 md:gap-10 py-8 border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--bg-muted)]/50 px-3 md:px-4 rounded-sm transition-colors duration-150"
              >
                <div className="flex items-center gap-3 shrink-0 pt-1">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] px-2 py-0.5 rounded-sm">
                    {benefit.number}
                  </span>
                  <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] hidden sm:flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline md:gap-8 flex-1">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)] md:w-64 shrink-0">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 md:mt-0 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed flex-1">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
