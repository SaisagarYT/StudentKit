import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { siteConfig } from '@/config/site';
import { categories } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { JsonLd } from '@/components/seo/json-ld';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/structured-data';
import { type ToolCategory } from '@/types/tool';

function getIcon(name: string, className?: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-4 h-4'} /> : null;
}

const accentColors: Record<string, string> = {
  college: '#D8CCFF',
  exams: '#FFE066',
  career: '#FFB36B',
  documents: '#A8F0E6',
  developer: '#C7FF3D',
};

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
  const accent = accentColors[slug] || '#C7FF3D';

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

      <div className="py-12 md:py-20">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] mb-8">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/categories" className="hover:text-[var(--text-primary)] transition-colors">Categories</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--text-primary)] font-medium">{category.title}</span>
          </nav>

          {/* Hero header */}
          <div className="relative p-8 md:p-10 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] mb-10 overflow-hidden">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20"
              style={{ background: accent }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center gap-5">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
                style={{ backgroundColor: `${accent}25` }}
              >
                {getIcon(category.icon, 'w-7 h-7')}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                  {category.title} Tools
                </h1>
                <p className="mt-2 text-[var(--text-secondary)] max-w-lg">
                  {category.description}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center px-4 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{tools.length}</p>
                  <p className="text-[10px] font-medium text-[var(--text-subtle)] uppercase tracking-wider">Tools</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tools grid */}
          {tools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group relative flex flex-col p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ backgroundColor: `${accent}15` }}
                    >
                      {getIcon(tool.icon, 'w-4 h-4 text-[var(--text-secondary)]')}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 translate-y-1 group-hover:translate-y-0 transition-all" />
                  </div>

                  <h2 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                    {tool.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                    {tool.shortDescription}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[var(--border-soft)] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[var(--text-subtle)]">
                      Free &middot; No signup
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Open
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-[var(--border-soft)]">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4">
                {getIcon(category.icon, 'w-5 h-5 text-[var(--text-subtle)]')}
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                No tools in this category yet.
              </p>
              <p className="text-xs text-[var(--text-subtle)] mt-1">
                Check back soon — we&apos;re adding new tools regularly.
              </p>
            </div>
          )}

          {/* Other categories */}
          <div className="mt-16 pt-10 border-t border-[var(--border-soft)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-5">Other categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.slug !== slug).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  {getIcon(cat.icon, 'w-4 h-4')}
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
