'use client';

import Link from 'next/link';
import { FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ResumeTipSection } from '@/config/placement/interview';

interface InterviewResumeViewProps {
  sections: ResumeTipSection[];
}

export function InterviewResumeView({ sections }: InterviewResumeViewProps) {
  return (
    <div className="space-y-6">
      {/* Resume Builder Promotion Banner */}
      <div className="p-5 sm:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[var(--accent-dark)] text-[var(--text-inverse)] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Build an ATS-Proof Tech Resume
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
              Use StudentKit&apos;s free interactive Resume Builder to craft clean, single-page, ATS-optimized engineering resumes tested against real recruiter screeners.
            </p>
          </div>
        </div>

        <Link
          href="/resume-builder"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[var(--accent-dark)] text-[var(--text-inverse)] text-xs sm:text-sm font-semibold hover:bg-[var(--accent-dark)]/90 transition-colors shrink-0 shadow-xs group"
        >
          <span>Open Resume Builder</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Resume Tip Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div
            key={section.category}
            className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 shadow-sm transition-all hover:border-[var(--border-default)]"
          >
            <h3 className="text-sm font-bold text-[var(--text-primary)] pb-2.5 mb-3 border-b border-[var(--border-soft)] flex items-center justify-between">
              <span>{section.category}</span>
              <span className="text-[11px] font-mono font-normal text-[var(--text-subtle)]">
                {section.tips.length} rules
              </span>
            </h3>

            <div className="space-y-2">
              {section.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
