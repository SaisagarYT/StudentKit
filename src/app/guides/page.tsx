import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ResourcesHub } from '@/features/resources/resources-hub';

export const metadata: Metadata = {
  title: `Guides & Masterclasses | ${siteConfig.name}`,
  description:
    'Deep engineering breakdowns, architecture trade-offs, and build-from-scratch tutorials designed to bridge the gap between syntax and hireable software engineering.',
  openGraph: {
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
};

export default function GuidesPage() {
  return <ResourcesHub />;
}
