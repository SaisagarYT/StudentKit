'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    number: '01',
    title: 'Fast',
    description: 'Get answers instantly. No loading screens, no sign-up walls.',
  },
  {
    number: '02',
    title: 'Private',
    description:
      'Most calculations happen directly in your browser. Your data stays yours.',
  },
  {
    number: '03',
    title: 'Free',
    description:
      'Essential student tools without unnecessary barriers or hidden charges.',
  },
  {
    number: '04',
    title: 'Accurate',
    description:
      'Clear calculations with understandable formulas and transparent logic.',
  },
];

export function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      gsap.set(itemsRef.current?.children || [], { opacity: 0, x: -30 });

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
          gsap.to(itemsRef.current?.children || [], {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.2,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing bg-[var(--bg-surface)]">
      <div className="container-main">
        <div ref={headingRef} className="max-w-lg mb-16">
          <h2 className="text-h2 font-bold tracking-tight">
            Useful by{' '}
            <span className="font-serif italic font-normal">design</span>.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)]">
            Built to help you get answers and move on — nothing more, nothing
            less.
          </p>
        </div>

        <div ref={itemsRef} className="space-y-0">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="group flex items-start gap-6 md:gap-10 py-8 border-b border-[var(--border-soft)] last:border-b-0"
            >
              <span className="text-sm font-mono text-[var(--accent-primary)] font-semibold shrink-0 pt-1">
                {benefit.number}
              </span>
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-8 flex-1">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--text-primary)] min-w-[120px]">
                  {benefit.title}
                </h3>
                <p className="mt-2 md:mt-0 text-[var(--text-secondary)] leading-relaxed max-w-md">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
