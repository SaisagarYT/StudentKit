'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/navigation/site-header';
import { ProductTour } from '@/components/tour/product-tour';
import { SiteFooter } from '@/components/layout/site-footer';
import { UserAuthProvider, useUserAuth } from '@/lib/firebase/user-auth';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { RegisterSW } from '@/components/pwa/register-sw';
import { MilestoneProvider } from '@/features/profile/milestone-provider';
import { XpToast } from '@/components/engagement/xp-toast';
import { AuthGuard } from '@/components/auth/auth-guard';

const NO_FOOTER_ROUTES = ['/login', '/profile', '/start'];

function FooterWrapper() {
  const pathname = usePathname();
  const { user } = useUserAuth();

  // Hide footer completely whenever user is logged in
  if (user) return null;

  const routeHidden = NO_FOOTER_ROUTES.some((route) => pathname.startsWith(route));
  if (routeHidden) return null;

  return <SiteFooter />;
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <UserAuthProvider>
        <RegisterSW />
        <MilestoneProvider />
        <SiteHeader />
        <ProductTour />
        <main className="flex-1">
          <AuthGuard>{children}</AuthGuard>
        </main>
        <XpToast />
        <FooterWrapper />
      </UserAuthProvider>
    </ThemeProvider>
  );
}
