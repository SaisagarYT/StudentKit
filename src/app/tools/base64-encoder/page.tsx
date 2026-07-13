import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { Base64Form } from '@/features/developer/base64-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('base64-encoder')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What is Base64 encoding?',
    answer: 'Base64 is a way to represent binary data using only ASCII text characters. It\'s commonly used in data URIs, email attachments, and API payloads where binary data needs to be transmitted as text.',
  },
  {
    question: 'Does this support Unicode/emoji?',
    answer: 'Yes — the encoder uses proper UTF-8 encoding via the TextEncoder API, so it handles all Unicode characters including emoji correctly.',
  },
  {
    question: 'Can I encode files?',
    answer: 'Yes — use the "Encode file" button to select any file. It will be encoded as a Base64 data URI that you can use in HTML, CSS, or API requests.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function Base64EncoderPage() {
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
        { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format, validate & minify JSON' },
        { slug: 'regex-tester', title: 'Regex Tester', description: 'Test & debug regular expressions' },
        { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate unique identifiers (UUID v4)' },
        { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text' },
      ]}
    >
      <Base64Form />
    </ToolPageShell>
    </>
  );
}
