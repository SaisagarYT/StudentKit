'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { DsaSheet } from '@/features/placement/dsa-sheet';

export function DsaPageClient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dsa-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      gsap.fromTo('.dsa-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="py-8 md:py-12">
      <div className="container-main">
        <div className="dsa-header">
          <Link
            href="/placement"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Placement Hub
          </Link>

          <h1 className="text-h1 font-bold text-[var(--text-primary)] tracking-tight">
            DSA <span className="font-serif italic font-normal">Sheet</span>
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            250+ handpicked problems covering all essential topics. Start from basics, build pattern recognition,
            and work your way up to hard problems asked at Google, Meta, Amazon & more.
          </p>
        </div>

        <div className="dsa-content mt-8">
          <DsaSheet />
        </div>
      </div>
    </div>
  );
}
