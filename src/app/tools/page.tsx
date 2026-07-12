import { Metadata } from 'next';
import { ToolDirectory } from '@/components/marketing/tool-directory';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `All Tools | ${siteConfig.name}`,
  description:
    'Browse all free student tools — calculators for attendance, CGPA, salary, and image utilities for documents and applications.',
};

export default function ToolsPage() {
  return (
    <div className="py-8 md:py-12">
      <ToolDirectory />
    </div>
  );
}
