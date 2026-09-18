import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code, FileText, Calculator } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Guides | ${siteConfig.name}`,
  description: 'Step-by-step guides for using StudentKit tools, understanding academic calculations, and navigating your career.',
};

const guideCategories = [
  {
    title: 'Calculator Guides',
    description: 'How to use each calculator and understand the formulas behind them.',
    icon: Calculator,
    count: 'Coming soon',
  },
  {
    title: 'Career Guides',
    description: 'Resume tips, interview preparation, and placement strategies.',
    icon: FileText,
    count: 'Coming soon',
  },
  {
    title: 'Developer Guides',
    description: 'Git workflows, project setup, deployment, and best practices.',
    icon: Code,
    count: 'Coming soon',
  },
  {
    title: 'Academic Guides',
    description: 'Understanding grading systems, credit calculations, and eligibility.',
    icon: BookOpen,
    count: 'Coming soon',
  },
];

export default function GuidesPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)]" />
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-h1 font-bold tracking-tight">Guides</h1>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
            Step-by-step guides to help you understand calculations, prepare for
            your career, and make the most of every tool.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guideCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--accent-dark)] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--text-subtle)] leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-flex mt-4 px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-sm">
                  {cat.count}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 md:p-10 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Guides are being written. In the meantime, each tool page includes
            explanations and FAQs, and our roadmaps provide structured learning paths.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors"
            >
              Browse tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-[var(--text-subtle)]">·</span>
            <Link
              href="/roadmaps"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors"
            >
              View roadmaps
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
