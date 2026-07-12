import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { UuidGeneratorForm } from '@/features/developer/uuid-generator-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('uuid-generator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What is a UUID?',
    answer: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is practically guaranteed to be unique across all systems. UUID v4 uses random numbers, making collisions extremely unlikely.',
  },
  {
    question: 'Are these UUIDs truly random?',
    answer: 'Yes — they use your browser\'s crypto.randomUUID() or crypto.getRandomValues() APIs, which provide cryptographically secure random numbers.',
  },
  {
    question: 'What format options are available?',
    answer: 'You can generate UUIDs in lowercase or uppercase, and with or without hyphens. Standard format is lowercase with hyphens: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function UuidGeneratorPage() {
  return (
    <>
    <ToolStructuredData tool={tool} breadcrumbs={breadcrumbs} faq={faq} />
    <ToolPageShell
      title={tool.title}
      description={tool.description}
      category={tool.category}
      breadcrumbs={breadcrumbs}
      faq={faq}
      relatedTools={[
        { slug: 'base64-encoder', title: 'Base64 Encoder', description: 'Encode & decode Base64' },
        { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format & validate JSON' },
      ]}
    >
      <UuidGeneratorForm />
    </ToolPageShell>
    </>
  );
}
