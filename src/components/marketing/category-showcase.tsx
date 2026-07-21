'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Map, FolderGit2, GitFork, Flame, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Placement Prep',
    description: 'Curated DSA problems, CS fundamentals, and interview questions — track your streak and progress.',
    href: '/placement',
    icon: Code2,
    accent: '#C7FF3D',
    stats: '150+ Problems',
    highlights: ['DSA Sheet', 'CS Concepts', 'Company Tags'],
  },
  {
    title: 'Career Roadmaps',
    description: 'Step-by-step learning paths for web dev, ML, DevOps, and more — with linked resources at every step.',
    href: '/roadmaps',
    icon: Map,
    accent: '#D8CCFF',
    stats: 'Multiple Paths',
    highlights: ['Full Stack', 'AI/ML', 'DevOps'],
  },
  {
    title: 'Build Projects',
    description: 'Real-world project ideas with architecture, milestones, and tech stacks to level up your portfolio.',
    href: '/projects',
    icon: FolderGit2,
    accent: '#A8F0E6',
    stats: 'Portfolio Ready',
    highlights: ['Guided Steps', 'Real Stacks', 'All Levels'],
  },
  {
    title: 'Open Source',
    description: 'Discover beginner-friendly repos, understand contribution flows, and land your first PR.',
    href: '/open-source',
    icon: GitFork,
    accent: '#FFD6A8',
    stats: 'Curated Repos',
    highlights: ['Good First Issues', 'By Language', 'Guided'],
  },
];

export function CategoryShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      gsap.set(gridRef.current?.children || [], { opacity: 0, y: 40, scale: 0.97 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.to(gridRef.current?.children || [], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.15,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing bg-[var(--bg-surface)]">
      <div className="container-main">
        <div ref={headingRef}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
              <Flame className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-dark)]">Core Features</span>
            </div>
          </div>
          <h2 className="text-h2 font-bold tracking-tight">
            Everything you need to{' '}
            <span className="font-serif italic font-normal">get placed</span>.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] max-w-lg">
            From DSA prep to building projects — a complete system designed for placement success.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex flex-col p-6 md:p-7 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-primary)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ backgroundColor: `${feature.accent}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feature.accent === '#C7FF3D' ? '#6B8F00' : feature.accent.replace('FF', 'BB') }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                    {feature.stats}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {feature.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {feature.highlights.map((h) => (
                    <span key={h} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-subtle)] border border-[var(--border-soft)]">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] group-hover:gap-2.5 transition-all">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Progress tracking callout */}
        <div className="mt-8 flex items-center gap-4 p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-primary)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 shrink-0">
            <Trophy className="w-5 h-5 text-[var(--accent-dark)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Track your progress</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Maintain streaks, earn badges, and sync across devices with a free account.</p>
          </div>
          <Link href="/login" className="shrink-0 text-xs font-semibold text-[var(--accent-dark)] hover:underline hidden sm:block">
            Sign up free →
          </Link>
        </div>
      </div>
    </section>
  );
}
