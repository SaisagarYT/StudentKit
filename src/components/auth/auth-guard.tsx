'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useUserAuth } from '@/lib/firebase/user-auth';

// Define which routes can be accessed without login
export function isPublicRoute(pathname: string): boolean {
  // Tools are explicitly open without login
  if (pathname === '/tools' || pathname.startsWith('/tools/')) return true;

  // Educational content (publicly indexable for Google AdSense & SEO)
  if (pathname === '/roadmaps' || pathname.startsWith('/roadmaps/')) return true;
  if (pathname === '/guides' || pathname.startsWith('/guides/')) return true;
  if (pathname === '/resources' || pathname.startsWith('/resources/')) return true;
  if (pathname === '/projects' || pathname.startsWith('/projects/')) return true;
  if (
    pathname === '/placement' ||
    pathname.startsWith('/placement/cs-fundamentals') ||
    pathname.startsWith('/placement/interview')
  ) {
    return true;
  }

  // Landing & Marketing / Legal / Auth pages
  if (pathname === '/') return true;
  if (pathname.startsWith('/about')) return true;
  if (pathname.startsWith('/contact')) return true;
  if (pathname.startsWith('/terms')) return true;
  if (pathname.startsWith('/privacy')) return true;
  if (pathname.startsWith('/disclaimer')) return true;
  if (pathname.startsWith('/login')) return true;
  if (pathname.startsWith('/start')) return true;
  if (pathname.startsWith('/categories')) return true;
  if (pathname.startsWith('/admin')) return true; // Admin has its own password auth

  return false;
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUserAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublic = isPublicRoute(pathname);

  useEffect(() => {
    if (mounted && !loading && !user && !isPublic) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [mounted, loading, user, isPublic, pathname, router]);

  // Public routes: render immediately
  if (isPublic) {
    return <>{children}</>;
  }

  // Still verifying auth session on protected routes
  if (loading || !mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-dark)] border-t-transparent animate-spin" />
        <p className="text-xs font-medium text-[var(--text-subtle)]">Verifying developer session...</p>
      </div>
    );
  }

  // Not authenticated: render modern lock screen while redirecting
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] text-center space-y-5 shadow-xs relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/15 text-[var(--accent-dark)] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-dark)] text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              Member Access Only
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Sign In to Continue
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              This feature requires a StudentKit account to track your progress, practice interview questions, and sync your XP.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-dark)] text-[var(--accent-primary)] text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
            >
              Sign In Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Explore Free Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: allow access
  return <>{children}</>;
}

