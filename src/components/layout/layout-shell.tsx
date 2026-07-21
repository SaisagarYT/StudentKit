'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/navigation/site-header';
import { ProductTour } from '@/components/tour/product-tour';
import { SiteFooter } from '@/components/layout/site-footer';
import { UserAuthProvider } from '@/lib/firebase/user-auth';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <UserAuthProvider>
      <SiteHeader />
      <ProductTour />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </UserAuthProvider>
  );
}
