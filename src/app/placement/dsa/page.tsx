import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { DsaSheet } from '@/features/placement/dsa-sheet';

export const metadata: Metadata = {
  title: `DSA Sheet — 250+ Problems | ${siteConfig.name}`,
  description: 'Curated DSA problems from Blind 75, NeetCode 150 & Striver SDE Sheet. Track your progress, filter by difficulty, and crack any coding interview.',
};

export default function DsaPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container-main">
        <Link
          href="/placement"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Placement Hub
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            DSA Sheet
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            250+ handpicked problems covering all essential topics. Start from basics, build pattern recognition,
            and work your way up to hard problems asked at Google, Meta, Amazon & more.
          </p>
        </div>

        <DsaSheet />
      </div>
    </div>
  );
}
