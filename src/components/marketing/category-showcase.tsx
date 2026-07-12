'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/config/categories';

gsap.registerPlugin(ScrollTrigger);

function getIcon(name: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className="w-5 h-5" /> : null;
}

const accentMap: Record<string, string> = {
  college: 'group-hover:border-[var(--accent-college)]',
  exams: 'group-hover:border-[var(--accent-exams)]',
  career: 'group-hover:border-[var(--accent-career)]',
  documents: 'group-hover:border-[var(--accent-documents)]',
};

const iconBgMap: Record<string, string> = {
  college: 'bg-[var(--accent-college)]/20',
  exams: 'bg-[var(--accent-exams)]/20',
  career: 'bg-[var(--accent-career)]/20',
  documents: 'bg-[var(--accent-documents)]/20',
};

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
          <h2 className="text-h2 font-bold tracking-tight">
            Built for every part of student{' '}
            <span className="font-serif italic font-normal">life</span>.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] max-w-lg">
            From academics to career preparation — organized so you find what
            you need instantly.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`group flex flex-col p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-primary)] hover:bg-[var(--bg-surface)] transition-all ${accentMap[cat.slug] || ''}`}
            >
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-xl ${iconBgMap[cat.slug] || 'bg-[var(--bg-subtle)]'}`}
              >
                {getIcon(cat.icon)}
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                {cat.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] transition-colors">
                Explore
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
