import { Metadata } from 'next';
import { ToolDirectory } from '@/components/marketing/tool-directory';
import { JsonLd } from '@/components/seo/json-ld';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/structured-data';
import { siteConfig } from '@/config/site';
import { tools } from '@/config/tools';

export const metadata: Metadata = {
  title: `All Tools | ${siteConfig.name}`,
  description:
    'Browse all free student tools — calculators for attendance, CGPA, salary, and image utilities for documents and applications.',
  openGraph: {
    images: [{ url: '/og/tools.png', width: 1200, height: 630 }],
  },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          title: 'All Tools',
          description: 'Browse all free student tools — calculators and utilities.',
          path: '/tools',
          items: tools.map((t) => ({
            name: t.title,
            url: `${siteConfig.url}/tools/${t.slug}`,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Tools' },
        ])}
      />
      <div className="py-8 md:py-12">
        <ToolDirectory />
      </div>
    </>
  );
}
