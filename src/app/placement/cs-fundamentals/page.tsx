import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { CsPageClient } from '@/features/placement/cs-page-client';

export const metadata: Metadata = {
  title: `CS Fundamentals — OS, DBMS, CN, OOPs | ${siteConfig.name}`,
  description: 'Complete CS fundamentals for placement interviews. Operating Systems, DBMS, Computer Networks, and OOPs with key concepts, interview questions, and progress tracking.',
};

export default function CsFundamentalsPage() {
  return <CsPageClient />;
}
