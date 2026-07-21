import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { ResourceViewer } from '@/features/resources/resource-viewer';

export const metadata: Metadata = {
  title: `Resource | ${siteConfig.name}`,
  description: 'In-depth tutorial with code examples, explanations, and related practice problems.',
};

export default function ResourceViewPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="inline-block w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResourceViewer />
    </Suspense>
  );
}
