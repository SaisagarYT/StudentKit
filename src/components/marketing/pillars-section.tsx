'use client';

import Link from 'next/link';
import { ArrowRight, Map, Hammer, Target } from 'lucide-react';
import { motion } from 'motion/react';

const pillars = [
  {
    number: '01',
    title: 'Learn',
    subtitle: 'Career Roadmaps',
    description: 'Structured step-by-step engineering paths so you always know what to learn next without tutorial hell.',
    href: '/roadmaps',
    icon: Map,
    highlights: ['9 Tech Paths', 'Milestone Checklists', 'Curated Resources'],
  },
  {
    number: '02',
    title: 'Prepare',
    subtitle: 'Placement & DSA',
    description: 'Master 250+ essential algorithmic patterns and review CS fundamentals (OS, DBMS, CN) to crack technical interviews.',
    href: '/placement',
    icon: Target,
    highlights: ['250+ Pattern Sheet', 'Core CS Notes', 'Company Breakdowns'],
  },
  {
    number: '03',
    title: 'Build',
    subtitle: 'Guided Projects',
    description: 'Build production-grade portfolio projects with architecture diagrams, phased milestones, and real-world tech stacks.',
    href: '/projects',
    icon: Hammer,
    highlights: ['System Architecture', 'Production Stacks', 'Resume-Ready'],
  },
];

export function PillarsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
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
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span>Structured for Student Success</span>
          </div>
          <h2 className="text-h2 font-bold tracking-tight">
            Three pillars to{' '}
            <span className="font-serif italic font-normal">accelerate your career</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-body-lg leading-relaxed">
            From your first line of code to landing high-impact offers — structured paths, interview mastery, and resume-defining projects.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.number}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <Link
                  href={pillar.href}
                  className="group relative flex flex-col justify-between h-full p-7 md:p-8 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-lg hover:shadow-black/5 transition-all duration-200"
                >
                  <div>
                    {/* Top Row: Icon + Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] group-hover:bg-[var(--accent-dark)] group-hover:text-[var(--text-inverse)] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-[var(--text-subtle)]">
                        {pillar.number}
                      </span>
                    </div>

                    {/* Subtitle & Title */}
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                      {pillar.title}
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {pillar.subtitle}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Highlights Badges */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {pillar.highlights.map((h) => (
                        <span
                          key={h}
                          className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Link Action */}
                  <div className="mt-8 pt-5 border-t border-[var(--border-soft)] flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                    <span>Explore {pillar.subtitle}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
