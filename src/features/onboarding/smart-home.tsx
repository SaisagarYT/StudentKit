'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { ReturningDashboard } from './returning-dashboard';

interface SmartHomeProps {
  marketingContent: React.ReactNode;
}

export function SmartHome({ marketingContent }: SmartHomeProps) {
  const { user, loading } = useUserAuth();
  const searchParams = useSearchParams();
  const isLandingForced = searchParams.get('view') === 'landing';

  // The student dashboard is accessible ONLY when the user is authenticated.
  const showDashboard = !loading && Boolean(user) && !isLandingForced;

  useEffect(() => {
    if (showDashboard) {
      document.body.setAttribute('data-no-footer', 'true');
    } else {
      document.body.removeAttribute('data-no-footer');
    }
    return () => document.body.removeAttribute('data-no-footer');
  }, [showDashboard]);

  // While checking auth status, render marketing landing page
  if (loading) {
    return <>{marketingContent}</>;
  }

  // Authenticated users default to their Student Dashboard
  if (showDashboard) {
    return <ReturningDashboard />;
  }

  // Non-authenticated visitors (or authenticated users viewing landing page)
  return (
    <>
      {/* Notice for authenticated users who chose to view the landing page */}
      {user && isLandingForced && (
        <div className="bg-[var(--accent-dark)] text-[var(--text-inverse)] text-xs py-2.5 px-4 text-center sticky top-16 md:top-18 z-40 flex items-center justify-center gap-3 shadow-xs">
          <span>You are viewing the landing page as <strong>{user.displayName || user.email}</strong></span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-bold text-[var(--text-inverse)] underline underline-offset-2 hover:opacity-80 ml-2"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Go to Student Dashboard
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
      {marketingContent}
    </>
  );
}
