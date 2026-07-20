'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { CsFundamentalsView } from '@/features/placement/cs-fundamentals-view';

export function CsPageClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cs-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo('.cs-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="py-8 md:py-12">
      <div className="container-main">
        <div className="cs-header">
          <Link
            href="/placement"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Placement Hub
          </Link>

          <h1 className="text-h1 font-bold text-[var(--text-primary)] tracking-tight">
            CS <span className="font-serif italic font-normal">Fundamentals</span>
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Every concept you need for theory rounds — Operating Systems, DBMS, Computer Networks, and OOPs.
            Mark concepts as done and track your preparation progress.
          </p>
        </div>

        <div className="cs-content mt-8">
          <CsFundamentalsView />
        </div>
      </div>
    </div>
  );
}
