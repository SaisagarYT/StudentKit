'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { type ToolCategory } from '@/types/tool';
import { type BreadcrumbItem, type FAQItem } from '@/types/common';

interface ToolPageShellProps {
  title: string;
  description: string;
  category: ToolCategory;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  explanation?: React.ReactNode;
  formula?: React.ReactNode;
  howToUse?: React.ReactNode;
  faq?: FAQItem[];
  relatedTools?: { slug: string; title: string; description: string }[];
}

export function ToolPageShell({
  title,
  description,
  category,
  breadcrumbs,
  children,
  explanation,
  formula,
  howToUse,
  faq,
  relatedTools,
}: ToolPageShellProps) {
  return (
    <div className="py-8 md:py-12">
      <div className="container-main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[var(--text-primary)] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--text-secondary)] font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-10"
        >
          <Badge variant={category} className="mb-3">
            {category}
          </Badge>
          <h1 className="text-h1 font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-body-lg text-[var(--text-secondary)] max-w-2xl">
            {description}
          </p>
        </motion.div>

        {/* Main tool interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="mb-16"
        >
          {children}
        </motion.div>

        {/* Supplementary content */}
        <div className="max-w-3xl space-y-16">
          {explanation && (
            <section>
              <h2 className="text-h3 font-semibold tracking-tight mb-4">
                How it works
              </h2>
              <div className="prose prose-sm text-[var(--text-secondary)] leading-relaxed">
                {explanation}
              </div>
            </section>
          )}

          {formula && (
            <section>
              <h2 className="text-h3 font-semibold tracking-tight mb-4">
                Formula
              </h2>
              <div className="p-5 bg-[var(--bg-subtle)] rounded-sm border border-[var(--border-soft)] font-mono text-sm">
                {formula}
              </div>
            </section>
          )}

          {howToUse && (
            <section>
              <h2 className="text-h3 font-semibold tracking-tight mb-4">
                How to use
              </h2>
              <div className="text-[var(--text-secondary)] leading-relaxed space-y-3">
                {howToUse}
              </div>
            </section>
          )}

          {faq && faq.length > 0 && (
            <section>
              <h2 className="text-h3 font-semibold tracking-tight mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {faq.map((item, i) => (
                  <FAQAccordionItem key={i} item={item} />
                ))}
              </div>
            </section>
          )}

          {relatedTools && relatedTools.length > 0 && (
            <section>
              <h2 className="text-h3 font-semibold tracking-tight mb-6">
                Related tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group p-4 border border-[var(--border-soft)] rounded-sm hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)] transition-all"
                  >
                    <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-dark)]">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--text-subtle)]">
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--border-soft)] rounded-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <span className="text-sm font-medium text-[var(--text-primary)] pr-4">
          {item.question}
        </span>
        <ChevronRight
          className={`w-4 h-4 text-[var(--text-subtle)] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
