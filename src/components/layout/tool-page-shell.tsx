'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
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
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 20 });
      gsap.set(contentRef.current, { opacity: 0, y: 30 });

      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.1,
      });
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.25,
      });
    });

    return () => ctx.revert();
  }, []);

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
        <div ref={headerRef} className="mb-10">
          <Badge variant={category} className="mb-3">
            {category}
          </Badge>
          <h1 className="text-h1 font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-body-lg text-[var(--text-secondary)] max-w-2xl">
            {description}
          </p>
        </div>

        {/* Main tool interface */}
        <div ref={contentRef} className="mb-16">
          {children}
        </div>

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
              <div className="p-5 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-soft)] font-mono text-sm">
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
                    className="group p-4 border border-[var(--border-soft)] rounded-xl hover:border-[var(--border-default)] hover:bg-[var(--bg-surface)] transition-all"
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
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const toggle = () => {
    if (!contentRef.current || !arrowRef.current) return;
    const isOpen = contentRef.current.style.maxHeight !== '0px' && contentRef.current.style.maxHeight !== '';

    if (isOpen) {
      gsap.to(contentRef.current, { maxHeight: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(arrowRef.current, { rotation: 0, duration: 0.3, ease: 'power2.inOut' });
    } else {
      gsap.set(contentRef.current, { maxHeight: 'none' });
      const height = contentRef.current.scrollHeight;
      gsap.set(contentRef.current, { maxHeight: 0 });
      gsap.to(contentRef.current, { maxHeight: height, opacity: 1, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(arrowRef.current, { rotation: 180, duration: 0.3, ease: 'power2.inOut' });
    }
  };

  return (
    <div className="border border-[var(--border-soft)] rounded-xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <span className="text-sm font-medium text-[var(--text-primary)] pr-4">
          {item.question}
        </span>
        <ChevronRight
          ref={arrowRef}
          className="w-4 h-4 text-[var(--text-subtle)] shrink-0 rotate-90"
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ maxHeight: 0, opacity: 0 }}
      >
        <div className="px-4 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}
