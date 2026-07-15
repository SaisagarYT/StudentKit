import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { CmsProjectViewer } from '@/features/projects/cms-project-viewer';

export const metadata: Metadata = {
  title: `Project | ${siteConfig.name}`,
  description: 'Guided learning project with milestones and architecture guidance.',
};

export default function CmsProjectPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--text-subtle)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CmsProjectViewer />
    </Suspense>
  );
}
