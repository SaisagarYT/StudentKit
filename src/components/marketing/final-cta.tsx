'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, { opacity: 0, y: 40, scale: 0.98 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(contentRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing">
      <div className="container-main">
        <div
          ref={contentRef}
          className="relative overflow-hidden rounded-3xl bg-[var(--bg-dark)] p-10 md:p-16 lg:p-20"
        >
          {/* Content */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-h2 font-bold tracking-tight text-[var(--text-inverse)]">
              Your next step starts{' '}
              <span className="text-[var(--accent-primary)]">here</span>.
            </h2>
            <p className="mt-5 text-base text-[var(--text-inverse)]/70 leading-relaxed max-w-md">
              Calculate grades, discover your path, build real projects — everything
              a student needs to move forward, in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                Explore tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/roadmaps"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold border border-white/20 text-[var(--text-inverse)] rounded-xl hover:bg-white/5 transition-colors"
              >
                View roadmaps
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-32 h-32 border border-white/5 rounded-full" />
          <div className="absolute -bottom-10 right-20 w-48 h-48 border border-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-[var(--accent-primary)] rounded-full opacity-40" />
          <div className="absolute bottom-12 right-1/3 w-2 h-2 bg-[var(--accent-primary)] rounded-full opacity-20" />

          {/* Large background number */}
          <div className="absolute -right-8 -bottom-8 text-[12rem] md:text-[16rem] font-bold tracking-tighter text-white/[0.03] leading-none select-none pointer-events-none">
            SK
          </div>
        </div>
      </div>
    </section>
  );
}
