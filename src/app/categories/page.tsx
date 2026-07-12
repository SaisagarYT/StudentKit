import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { siteConfig } from '@/config/site';
import { categories } from '@/config/categories';
import { getToolsByCategory } from '@/config/tools';

export const metadata: Metadata = {
  title: `Categories | ${siteConfig.name}`,
  description: 'Browse student tools by category — college, exams, career, and documents.',
};

function getIcon(name: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className="w-6 h-6" /> : null;
}

const iconBgMap: Record<string, string> = {
  college: 'bg-[var(--accent-college)]/20',
  exams: 'bg-[var(--accent-exams)]/20',
  career: 'bg-[var(--accent-career)]/20',
  documents: 'bg-[var(--accent-documents)]/20',
};

export default function CategoriesPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container-main">
        <div className="max-w-2xl mb-12">
          <h1 className="text-h1 font-bold tracking-tight">Categories</h1>
          <p className="mt-3 text-body-lg text-[var(--text-secondary)]">
            Browse tools organized by what you need them for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const tools = getToolsByCategory(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconBgMap[cat.slug]}`}>
                  {getIcon(cat.icon)}
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {cat.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 text-sm text-[var(--text-subtle)]">
                  {tools.length} tool{tools.length !== 1 ? 's' : ''}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse tools
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
