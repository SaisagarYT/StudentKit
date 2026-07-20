import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { DsaPageClient } from '@/features/placement/dsa-page-client';

export const metadata: Metadata = {
  title: `DSA Sheet — 250+ Problems | ${siteConfig.name}`,
  description: 'Curated DSA problems from Blind 75, NeetCode 150 & Striver SDE Sheet. Track your progress, filter by difficulty, and crack any coding interview.',
};

export default function DsaPage() {
  return <DsaPageClient />;
}
