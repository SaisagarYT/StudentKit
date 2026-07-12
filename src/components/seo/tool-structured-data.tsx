import { JsonLd } from './json-ld';
import {
  webApplicationSchema,
  faqSchema,
  breadcrumbSchema,
} from '@/lib/structured-data';
import { type FAQItem, type BreadcrumbItem } from '@/types/common';

interface ToolStructuredDataProps {
  tool: {
    title: string;
    description: string;
    slug: string;
    category: string;
  };
  breadcrumbs: BreadcrumbItem[];
  faq?: FAQItem[];
}

export function ToolStructuredData({
  tool,
  breadcrumbs,
  faq,
}: ToolStructuredDataProps) {
  return (
    <>
      <JsonLd data={webApplicationSchema(tool)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {faq && faq.length > 0 && <JsonLd data={faqSchema(faq)} />}
    </>
  );
}
