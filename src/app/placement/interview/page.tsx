import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { InterviewPageClient } from '@/features/placement/interview-page-client';

export const metadata: Metadata = {
  title: `Interview Prep — HR, Behavioral & Technical | ${siteConfig.name}`,
  description: 'Complete interview preparation guide. HR questions, behavioral (STAR method), company-wise patterns for Google, Amazon, Microsoft & more. Resume tips included.',
};

export default function InterviewPage() {
  return <InterviewPageClient />;
}
