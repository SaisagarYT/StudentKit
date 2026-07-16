import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { InterviewPrepView } from '@/features/placement/interview-prep-view';

export const metadata: Metadata = {
  title: `Interview Prep — HR, Behavioral & Technical | ${siteConfig.name}`,
  description: 'Complete interview preparation guide. HR questions, behavioral (STAR method), company-wise patterns for Google, Amazon, Microsoft & more. Resume tips included.',
};

export default function InterviewPage() {
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
            Interview Prep
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Master every stage of the interview — from HR screenings to final technical rounds.
            Company-specific patterns, STAR method for behavioral, and resume best practices.
          </p>
        </div>

        <InterviewPrepView />
      </div>
    </div>
  );
}
