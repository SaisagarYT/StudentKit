import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { ResumeBuilderClient } from '@/features/resume/resume-builder-client';

export const metadata: Metadata = {
  title: `Resume Builder | ${siteConfig.name}`,
  description: 'Create a clean, ATS-friendly resume in minutes. Free, no sign-up required. Auto-saved and print to PDF.',
  keywords: ['resume builder', 'free resume maker', 'ATS resume', 'student resume', 'fresher resume template'],
};

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResumeBuilderClient />
    </Suspense>
  );
}
