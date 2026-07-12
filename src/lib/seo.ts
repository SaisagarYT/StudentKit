import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.social.twitter,
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
    title: `${tool.title} — Free Online ${tool.title} | ${siteConfig.name}`,
    description: tool.description,
    path: `/tools/${tool.slug}`,
  });
}
