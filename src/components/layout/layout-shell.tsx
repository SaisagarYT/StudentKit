'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/navigation/site-header';
import { ProductTour } from '@/components/tour/product-tour';
import { SiteFooter } from '@/components/layout/site-footer';
import { UserAuthProvider } from '@/lib/firebase/user-auth';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { RegisterSW } from '@/components/pwa/register-sw';
import { MilestoneProvider } from '@/features/profile/milestone-provider';
import { XpToast } from '@/components/engagement/xp-toast';

const NO_FOOTER_ROUTES = ['/login', '/profile', '/start'];

function FooterWrapper() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  const routeHidden = NO_FOOTER_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const check = () => setHidden(document.body.hasAttribute('data-no-footer'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-no-footer'] });
    return () => observer.disconnect();
  }, []);

  if (routeHidden || hidden) return null;
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
        <main className="flex-1">{children}</main>
        <XpToast />
        <FooterWrapper />
      </UserAuthProvider>
    </ThemeProvider>
  );
}
