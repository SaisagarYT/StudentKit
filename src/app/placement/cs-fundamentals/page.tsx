import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { CsFundamentalsView } from '@/features/placement/cs-fundamentals-view';

export const metadata: Metadata = {
  title: `CS Fundamentals — OS, DBMS, CN, OOPs | ${siteConfig.name}`,
  description: 'Complete CS fundamentals for placement interviews. Operating Systems, DBMS, Computer Networks, and OOPs with key concepts, interview questions, and progress tracking.',
};

export default function CsFundamentalsPage() {
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
            CS Fundamentals
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Every concept you need for theory rounds — Operating Systems, DBMS, Computer Networks, and OOPs.
            Mark concepts as done and track your preparation progress.
          </p>
        </div>

        <CsFundamentalsView />
      </div>
    </div>
  );
}
