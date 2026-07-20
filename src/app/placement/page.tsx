import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { PlacementHero } from '@/features/placement/placement-hero';

export const metadata: Metadata = {
  title: `Placement Preparation | ${siteConfig.name}`,
  description: 'Complete placement preparation — DSA sheet with 250+ problems, CS fundamentals (OS, DBMS, CN, OOPs), interview prep, and company-wise patterns. From zero to FAANG.',
  openGraph: {
    images: [{ url: '/og/placement.png', width: 1200, height: 630 }],
  },
};

export default function PlacementPage() {
  return <PlacementHero />;
}
