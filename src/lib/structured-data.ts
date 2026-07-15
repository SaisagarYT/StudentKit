import { siteConfig } from '@/config/site';
import { type FAQItem, type BreadcrumbItem } from '@/types/common';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo-dark.png`,
    description: siteConfig.description,
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webApplicationSchema(tool: {
  title: string;
  description: string;
  slug: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    description: tool.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    applicationSubCategory: tool.category,
  };
}

export function faqSchema(items: FAQItem[]) {
  if (!items.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter((item) => item.href || item.label)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(item.href && { item: `${siteConfig.url}${item.href}` }),
      })),
  };
}

export function collectionPageSchema(page: {
  title: string;
  description: string;
  path: string;
  items: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.title,
    description: page.description,
    url: `${siteConfig.url}${page.path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: page.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function courseSchema(roadmap: {
  title: string;
  description: string;
  slug: string;
  totalTime: string;
  stages: { title: string; topics: { title: string }[] }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${roadmap.title} Roadmap`,
    description: roadmap.description,
    url: `${siteConfig.url}/roadmaps/${roadmap.slug}`,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: roadmap.totalTime,
    },
    syllabusSections: roadmap.stages.map((stage) => ({
      '@type': 'Syllabus',
      name: stage.title,
      numberOfLessons: stage.topics.length,
    })),
    totalHistoricalEnrollment: roadmap.stages.reduce(
      (sum, s) => sum + s.topics.length,
      0
    ),
  };
}
