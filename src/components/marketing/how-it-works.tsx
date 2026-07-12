'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Find your tool.',
    description: 'Search or browse by category to find exactly what you need.',
  },
  {
    number: '02',
    title: 'Enter your information.',
    description: 'Simple inputs, clear labels — no guesswork required.',
  },
  {
    number: '03',
    title: 'Get a clear answer.',
    description: 'Instant results with context and explanation.',
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      gsap.set(stepsRef.current?.children || [], { opacity: 0, y: 40 });

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
          gsap.to(stepsRef.current?.children || [], {
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
        <div ref={headingRef} className="mb-16">
          <h2 className="text-h2 font-bold tracking-tight">
            How it works.
          </h2>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="block text-6xl md:text-7xl font-bold tracking-tighter text-[var(--accent-primary)] leading-none select-none">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
