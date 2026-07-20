'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { InterviewPrepView } from '@/features/placement/interview-prep-view';

export function InterviewPageClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.iv-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo('.iv-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="py-8 md:py-12">
      <div className="container-main">
        <div className="iv-header">
          <Link
            href="/placement"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Placement Hub
          </Link>

          <h1 className="text-h1 font-bold text-[var(--text-primary)] tracking-tight">
            Interview <span className="font-serif italic font-normal">Prep</span>
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Master every stage of the interview — from HR screenings to final technical rounds.
            Company-specific patterns, STAR method for behavioral, and resume best practices.
          </p>
        </div>

        <div className="iv-content mt-8">
          <InterviewPrepView />
        </div>
      </div>
    </div>
  );
}
