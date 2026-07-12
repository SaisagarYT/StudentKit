'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import gsap from 'gsap';
import { HeroVisual } from './hero-visual';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.set([headingRef.current, subtextRef.current, ctaRef.current, searchRef.current], {
        opacity: 0,
        y: 50,
      });

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
      })
        .to(
          subtextRef.current,
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to(searchRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            <h1
              ref={headingRef}
              className="text-display font-bold tracking-tighter leading-[0.92]"
            >
              Everything a student{' '}
              <span className="font-serif italic font-normal">needs</span> to
              calculate, convert &amp;&nbsp;simplify.
            </h1>

            <p
              ref={subtextRef}
              className="mt-6 md:mt-8 text-body-lg text-text-secondary max-w-lg leading-relaxed"
            >
              Free calculators and utilities for college, exams, documents and
              your career — fast, private and easy to use.
            </p>

            <div ref={ctaRef} className="mt-8 md:mt-10 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-colors"
              >
                Explore all tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] transition-colors"
              >
                Browse categories
              </Link>
            </div>

            {/* Search prompt */}
            <div ref={searchRef} className="mt-10 md:mt-12">
              <div className="flex items-center gap-3 px-4 py-3 border border-[var(--border-soft)] rounded-xl bg-[var(--bg-surface)] max-w-md cursor-pointer hover:border-[var(--border-default)] transition-colors group">
                <Search className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--text-secondary)] transition-colors" />
                <span className="text-sm text-[var(--text-subtle)]">
                  What do you need help with?
                </span>
                <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-md font-mono">
                  ⌘K
                </kbd>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Attendance', 'CGPA', 'Salary', 'Image Compress'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right: Visual */}
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
