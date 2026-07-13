import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { JsonFormatterForm } from '@/features/developer/json-formatter-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('json-formatter')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What does the JSON formatter do?',
    answer: 'It takes raw or messy JSON and reformats it with proper indentation and line breaks, making it easy to read. It can also minify JSON by removing all unnecessary whitespace.',
  },
  {
    question: 'How does validation work?',
    answer: 'The tool uses JavaScript\'s built-in JSON.parse() to check your input. If the JSON is malformed, it shows the exact error message indicating what went wrong and where.',
  },
  {
    question: 'Is there a size limit?',
    answer: 'The tool runs entirely in your browser, so it can handle large JSON files up to several megabytes. Extremely large files may cause temporary slowness.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function JsonFormatterPage() {
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
        { slug: 'regex-tester', title: 'Regex Tester', description: 'Test & debug regular expressions' },
        { slug: 'base64-encoder', title: 'Base64 Encoder', description: 'Encode & decode Base64 strings' },
        { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate unique identifiers (UUID v4)' },
        { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text' },
      ]}
    >
      <JsonFormatterForm />
    </ToolPageShell>
    </>
  );
}
