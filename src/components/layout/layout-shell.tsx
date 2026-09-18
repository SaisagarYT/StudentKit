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

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason &&
        (reason.name === 'AbortError' ||
          reason.code === 20 ||
          (typeof reason.message === 'string' &&
            (reason.message.includes('aborted') ||
              reason.message.includes('The user aborted a request'))))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, { capture: true });
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, { capture: true });
    };
  }, []);

  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <ThemeProvider>{children}</ThemeProvider>;
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
