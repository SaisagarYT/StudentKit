import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ResourcesHub } from '@/features/resources/resources-hub';

export const metadata: Metadata = {
  title: `Resources | ${siteConfig.name}`,
  description: 'Free tutorials, DSA editorials, CS concept deep-dives, and career guides. Everything you need to learn — on one platform, no external links needed.',
};

export default function ResourcesPage() {
  return <ResourcesHub />;
}
