import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { siteConfig } from '@/config/site';
import { categories } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { Badge } from '@/components/ui/badge';
import { JsonLd } from '@/components/seo/json-ld';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/structured-data';
import { type ToolCategory } from '@/types/tool';

function getIcon(name: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className="w-4 h-4" /> : null;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.title} Tools | ${siteConfig.name}`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const tools = getToolsByCategory(slug);

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          title: `${category.title} Tools`,
          description: category.description,
          path: `/categories/${slug}`,
          items: tools.map((t) => ({
            name: t.title,
            url: `${siteConfig.url}/tools/${t.slug}`,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.title },
        ])}
      />
    <div className="py-8 md:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12">
          <Badge variant={category.slug as ToolCategory} className="mb-3">
            {category.title}
          </Badge>
          <h1 className="text-h1 font-bold tracking-tight">
            {category.title} Tools
          </h1>
          <p className="mt-3 text-body-lg text-[var(--text-secondary)] max-w-lg">
            {category.description}
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:bg-[var(--bg-muted)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                  {getIcon(tool.icon)}
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                {tool.shortDescription}
              </p>
              <span className="mt-4 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                Use tool
              </span>
            </Link>
          ))}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-secondary)]">
              No tools in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
