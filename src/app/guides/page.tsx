import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Guides | ${siteConfig.name}`,
  description: 'Step-by-step guides for using StudentKit tools and understanding academic calculations.',
};

export default function GuidesPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">Guides</h1>
        <p className="mt-3 text-body-lg text-[var(--text-secondary)]">
          Helpful guides for understanding calculations and making the most of
          StudentKit tools.
        </p>

        <div className="mt-12 p-8 border border-dashed border-[var(--border-default)] rounded-2xl text-center">
          <p className="text-[var(--text-secondary)]">
            Guides are coming soon. In the meantime, each tool page includes
            explanations and FAQs.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors"
          >
            Browse tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
