import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import { siteConfig } from '@/config/site';
import { categories } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: `Categories | ${siteConfig.name}`,
  description: 'Browse student tools by category — college, exams, career, and documents.',
};

function getIcon(name: string, className?: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-6 h-6'} /> : null;
}

const accentColors: Record<string, string> = {
  college: '#D8CCFF',
  exams: '#FFE066',
  career: '#FFB36B',
  documents: '#A8F0E6',
  developer: '#C7FF3D',
};

export default function CategoriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Categories' },
        ])}
      />

      <div className="py-12 md:py-20">
        <div className="container-main">
          {/* Hero header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {categories.length} Categories
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              Tools for every{' '}
              <span className="font-serif italic font-normal">need</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-md mx-auto">
              Free, fast, and private — organized by what you&apos;re working on right now.
            </p>
          </div>

          {/* Featured category (first one larger) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {categories.slice(0, 2).map((cat) => {
              const tools = getToolsByCategory(cat.slug);
              const accent = accentColors[cat.slug] || '#C7FF3D';
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group relative p-8 md:p-10 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all overflow-hidden"
                >
                  {/* Accent glow */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ background: accent }}
                  />

                  <div className="relative">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                      style={{ backgroundColor: `${accent}25` }}
                    >
                      {getIcon(cat.icon, 'w-6 h-6')}
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      {cat.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
                      {cat.description}
                    </p>

                    <div className="mt-5 flex items-center gap-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-primary)]">
                        {tools.length} tool{tools.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] group-hover:gap-2 transition-all">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Tool previews */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {tools.slice(0, 4).map((tool) => (
                        <span
                          key={tool.slug}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                        >
                          {tool.title}
                        </span>
                      ))}
                      {tools.length > 4 && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-primary)] text-[var(--text-subtle)]">
                          +{tools.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Remaining categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.slice(2).map((cat) => {
              const tools = getToolsByCategory(cat.slug);
              const accent = accentColors[cat.slug] || '#C7FF3D';
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group relative p-6 md:p-7 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all overflow-hidden"
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-15 group-hover:opacity-25 transition-opacity"
                    style={{ background: accent }}
                  />

                  <div className="relative">
                    <div
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                      style={{ backgroundColor: `${accent}25` }}
                    >
                      {getIcon(cat.icon, 'w-5 h-5')}
                    </div>

                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                      {cat.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                        {tools.length} tool{tools.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] transition-colors">
                        View
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
