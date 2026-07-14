import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || '/og/home.png';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.social.twitter,
      images: [image],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function generateToolMetadata(tool: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  return generatePageMetadata({
    title: `${tool.title} — Free Online Calculator`,
    description: tool.description,
    path: `/tools/${tool.slug}`,
    ogImage: `/og/tools-${tool.slug}.png`,
  });
}
