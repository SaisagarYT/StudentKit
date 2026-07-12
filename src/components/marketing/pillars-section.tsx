'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Map, Hammer } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    number: '01',
    title: 'Calculate',
    subtitle: 'Tools',
    description: 'Instant calculators for grades, attendance, salary, documents, and more.',
    href: '/tools',
    icon: Calculator,
    accent: '#C7FF3D',
  },
  {
    number: '02',
    title: 'Learn',
    subtitle: 'Roadmaps',
    description: 'Interactive career and technology paths to know exactly what to learn next.',
    href: '/roadmaps',
    icon: Map,
    accent: '#D8CCFF',
  },
  {
    number: '03',
    title: 'Build',
    subtitle: 'Projects',
    description: 'Curated project ideas with architecture, milestones, and real-world stacks.',
    href: '/projects',
    icon: Hammer,
    accent: '#A8F0E6',
  },
];

export function PillarsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      gsap.set(cardsRef.current?.children || [], { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.to(cardsRef.current?.children || [], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.15,
            delay: 0.2,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing">
      <div className="container-main">
        <div ref={headingRef} className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-h2 font-bold tracking-tight">
            Three ways to{' '}
            <span className="font-serif italic font-normal">move forward</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-body-lg">
            Tools for today, paths for tomorrow, projects for your portfolio.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.number}
                href={pillar.href}
                className="group relative p-7 md:p-8 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ backgroundColor: `${pillar.accent}20` }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: pillar.accent === '#C7FF3D' ? '#6B8F00' : pillar.accent.replace('FF', 'BB') }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[var(--text-subtle)]">
                    {pillar.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {pillar.title}
                </h3>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)] mt-1">
                  {pillar.subtitle}
                </p>
                <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {pillar.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-[var(--text-primary)] group-hover:gap-2.5 transition-all">
                  Explore
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
