'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/navigation/site-header';
import { ProductTour } from '@/components/tour/product-tour';
import { SiteFooter } from '@/components/layout/site-footer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <ProductTour />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
