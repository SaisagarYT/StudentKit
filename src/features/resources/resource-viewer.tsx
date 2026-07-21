'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, Tag, BookOpen, ArrowRight, Code, Eye, ChevronDown, Share2 } from 'lucide-react';
import { NewsletterCapture } from '@/components/engagement/newsletter-capture';
import gsap from 'gsap';
import { resourceRepository } from '@/lib/cms/repository';
import { trackPageView } from '@/lib/cms/analytics';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import type { CmsResource, ResourceListItem, ResourceApproach } from '@/lib/cms/types';

const difficultyColors: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
  expert: '#a855f7',
};

function ApproachCard({ approach, index }: { approach: ResourceApproach; index: number }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-md">
            Approach {index + 1}
          </span>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">{approach.name}</h3>
        </div>
      </div>

      {/* Explanation */}
      <div className="px-5 py-4">
        <p className="text-sm text-[var(--text-primary)] opacity-75 leading-relaxed">
          {approach.explanation}
        </p>

        {/* Complexity badges */}
        <div className="flex items-center gap-3 mt-4">
          {approach.timeComplexity && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[rgba(255,255,255,0.05)]">
              <span className="text-[10px] text-[var(--text-subtle)] font-medium">Time:</span>
              <span className="text-[11px] text-[var(--text-primary)] font-bold font-mono">{approach.timeComplexity}</span>
            </div>
          )}
          {approach.spaceComplexity && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[rgba(255,255,255,0.05)]">
              <span className="text-[10px] text-[var(--text-subtle)] font-medium">Space:</span>
              <span className="text-[11px] text-[var(--text-primary)] font-bold font-mono">{approach.spaceComplexity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Code — hidden by default */}
      {approach.code.length > 0 && (
        <div className="border-t border-[rgba(255,255,255,0.05)]">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-4 text-xs font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Reveal Solution Code
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">Solution Code</span>
              </div>
              {approach.code.map((block, j) => (
                <div key={j} className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[rgba(0,0,0,0.2)] border-b border-[rgba(255,255,255,0.04)]">
                    <span className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase">{block.language}</span>
                  </div>
                  <pre className="p-4 bg-[var(--bg-subtle)] overflow-x-auto">
                    <code className="text-[12px] text-[var(--text-primary)] font-mono leading-relaxed whitespace-pre">{block.code}</code>
                  </pre>
                </div>
              ))}
              <button
                onClick={() => setRevealed(false)}
                className="text-[10px] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
              >
                Hide code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ResourceViewer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [resource, setResource] = useState<CmsResource | null>(null);
  const [related, setRelated] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) { setError('No resource specified.'); setLoading(false); return; }

    resourceRepository.getBySlug(slug).then(r => {
      if (!r) {
        setError('Resource not found.');
        setLoading(false);
        return;
      }
      setResource(r);
      setLoading(false);
      trackPageView('resource', slug);

      if (r.relatedResources.length > 0) {
        resourceRepository.listPublished().then(all => {
          setRelated(all.filter(a => r.relatedResources.includes(a.slug)).slice(0, 4));
        });
      }
    }).catch((err) => {
      console.error('[ResourceViewer]', err);
      setError('Failed to load resource.');
      setLoading(false);
    });
  }, [slug]);

  // Dynamic SEO: update title + meta + structured data when resource loads
  useEffect(() => {
    if (!resource) return;
    document.title = `${resource.title} | StudentKit`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = resource.shortDescription?.slice(0, 155) || `${resource.title} - detailed explanation with code`;
    if (metaDesc) metaDesc.setAttribute('content', desc);
    else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = desc;
      document.head.appendChild(meta);
    }
    // Article structured data
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: resource.title,
      description: desc,
      author: { '@type': 'Organization', name: 'StudentKit' },
      publisher: { '@type': 'Organization', name: 'StudentKit', url: 'https://studentkit.app' },
      url: `https://studentkit.app/resources/view?slug=${resource.slug}`,
      datePublished: resource.publishedAt?.toISOString(),
      dateModified: resource.updatedAt?.toISOString(),
    });
    document.head.appendChild(ld);
    return () => { ld.remove(); };
  }, [resource]);

  useEffect(() => {
    if (!loading && resource && ref.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.rv-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo('.rv-content', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
      }, ref);
      return () => ctx.revert();
    }
  }, [loading, resource]);

  if (loading) return (
    <div className="py-20 text-center">
      <div className="inline-block w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="py-20 text-center container-main">
      <BookOpen className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-3" />
      <p className="text-sm text-[var(--text-subtle)]">{error}</p>
      <p className="text-xs text-[var(--text-subtle)] mt-1 opacity-70">This editorial hasn&apos;t been published yet.</p>
      <Link href="/placement/dsa" className="inline-flex items-center gap-1.5 mt-4 text-xs text-[var(--accent-primary)] hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to DSA Sheet
      </Link>
    </div>
  );

  if (!resource) return null;

  return (
    <div ref={ref} className="py-8 md:py-12">
      <div className="container-main max-w-4xl">
        {/* Back */}
        <div className="rv-header">
          <Link
            href="/placement/dsa"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to DSA Sheet
          </Link>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
              style={{ color: difficultyColors[resource.difficulty], background: `${difficultyColors[resource.difficulty]}12` }}
            >
              {resource.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-subtle)]">
              <Clock className="w-3.5 h-3.5" />
              {resource.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            {resource.title}
          </h1>
          {resource.shortDescription && (
            <p className="mt-3 text-sm text-[var(--text-primary)] opacity-60 leading-relaxed">
              {resource.shortDescription}
            </p>
          )}

          {/* Share + Tags */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => {
                const url = `https://studentkit.app/resources/view?slug=${resource.slug}`;
                const text = `${resource.title} - Solved on StudentKit`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] border border-[var(--border-soft)] hover:border-[var(--border-default)] transition-colors"
            >
              <Share2 className="w-3 h-3" /> Share
            </button>
          </div>

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {resource.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-[var(--bg-subtle)] text-[var(--text-subtle)] border border-[rgba(255,255,255,0.05)]">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="rv-content mt-10">
          {/* Markdown explanation first */}
          {resource.content && (
            <div className="mb-10">
              <MarkdownRenderer content={resource.content} />
            </div>
          )}

          {/* Approaches with hidden code */}
          {resource.approaches.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Code className="w-5 h-5 text-[var(--accent-primary)]" />
                Solution Approaches
              </h2>
              <p className="text-xs text-[var(--text-subtle)] -mt-3">
                Try solving it yourself first. Click &quot;Reveal Solution Code&quot; when ready.
              </p>
              {resource.approaches.map((approach, i) => (
                <ApproachCard key={i} approach={approach} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Related Resources */}
        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-[rgba(255,255,255,0.06)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Next Problems</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/resources/view?slug=${r.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] hover:border-[rgba(255,255,255,0.15)] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] truncate transition-colors">
                      {r.title}
                    </h3>
                    <span className="text-[10px] text-[var(--text-subtle)]">{r.readTime} min</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--accent-primary)] shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10 text-center">
          <Link
            href="/placement/dsa"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to DSA Sheet
          </Link>
        </div>

        {/* Newsletter */}
        <div className="mt-12">
          <NewsletterCapture />
        </div>
      </div>
    </div>
  );
}
