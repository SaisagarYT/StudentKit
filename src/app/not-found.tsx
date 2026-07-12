import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
      <div className="container-main text-center">
        <span className="text-8xl md:text-9xl font-bold tracking-tighter text-[var(--accent-primary)] select-none">
          404
        </span>
        <h1 className="mt-4 text-h2 font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try searching for a tool or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-colors"
          >
            Go home
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  );
}
