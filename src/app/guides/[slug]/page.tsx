import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { technicalGuides, getGuideBySlug } from '@/config/guides';
import { siteConfig } from '@/config/site';
import { ArrowLeft, Clock, BookOpen, CheckCircle2, Sparkles, MessageSquare, Award } from 'lucide-react';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = technicalGuides.map((guide) => ({
    slug: guide.slug,
  }));
  return slugs.length > 0 ? slugs : [{ slug: '_' }];
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: `Guide | ${siteConfig.name}`,
    };
  }

  const title = `${guide.title} | ${siteConfig.name} Masterclass`;
  const description = guide.summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteConfig.url}/guides/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="py-8 md:py-16">
      <div className="container-main max-w-4xl">
        {/* Back navigation */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All Masterclasses
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-primary)]/20 text-[var(--accent-dark)]">
              {guide.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-semibold text-[var(--text-subtle)] bg-[var(--bg-subtle)]">
              {guide.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-subtle)] ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTime}
            </span>
          </div>

          <h1 className="text-h1 font-bold text-[var(--text-primary)] tracking-tight leading-tight">
            {guide.title}
          </h1>
          <p className="mt-3 text-body-lg text-[var(--text-secondary)] leading-relaxed">
            {guide.subtitle}
          </p>
        </header>

        {/* Layer 1: Why it exists (The Origin Story) */}
        <section className="mb-10 p-6 rounded-sm border border-l-4 border-l-[var(--accent-dark)] border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            Layer 1: The Origin Story (Why does this exist?)
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {guide.whyItExists}
          </p>
        </section>

        {/* Layer 2: Industry Architecture */}
        <section className="mb-10 p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent-dark)]" />
            Layer 2: Industry Architecture & Trade-Offs
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {guide.industryArchitecture}
          </p>
        </section>

        {/* Layer 3: Step-by-Step Build */}
        <section className="mb-12 space-y-8">
          <h2 className="text-lg font-bold text-[var(--text-primary)] pb-2 border-b border-[var(--border-soft)]">
            Layer 3: Building from Scratch (No Magic Libraries)
          </h2>

          {guide.sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {section.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {section.content}
              </p>

              {section.codeSnippet && (
                <div className="rounded-sm overflow-hidden border border-[var(--border-soft)] bg-[#151515] text-[#F7F7F2]">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs font-mono text-[var(--text-subtle)] bg-black/40">
                    <span>{section.codeSnippet.language}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Layer 4: Interview Questions */}
        <section className="mb-10 p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Layer 4: Technical Interview Questions Recruiters Ask About This
          </h2>

          <div className="space-y-4">
            {guide.interviewQuestions.map((qa, i) => (
              <div key={i} className="p-4 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                <p className="text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Q{i + 1}: {qa.question}
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Ideal Answer: </span>
                  {qa.idealAnswer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Layer 5: Resume Bullet Points */}
        <section className="p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--accent-primary)]/[0.06]">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--accent-dark)]" />
            Resume Bullet Points (STAR Method)
          </h2>
          <p className="text-xs text-[var(--text-subtle)] mb-4">
            Copy and paste these verified impact bullets into your resume once you implement this project.
          </p>

          <ul className="space-y-2.5">
            {guide.resumeBulletPoints.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

