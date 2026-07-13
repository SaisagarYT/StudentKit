import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { RegexTesterForm } from '@/features/developer/regex-tester-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('regex-tester')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What regex syntax does this tester support?',
    answer: 'This tester uses JavaScript regex syntax (ECMAScript). It supports all standard flags including global (g), case-insensitive (i), multiline (m), and dotAll (s).',
  },
  {
    question: 'What are capture groups?',
    answer: 'Capture groups are parts of your pattern wrapped in parentheses (). They let you extract specific portions of a match. The results panel shows each numbered group.',
  },
  {
    question: 'Can I use this for find and replace?',
    answer: 'Yes — toggle the Replace mode to enter a replacement string. You can use $1, $2 etc. to reference capture groups in your replacement.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function RegexTesterPage() {
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
        { slug: 'base64-encoder', title: 'Base64 Encoder', description: 'Encode & decode Base64 strings' },
        { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate unique identifiers (UUID v4)' },
        { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text' },
      ]}
    >
      <RegexTesterForm />
    </ToolPageShell>
    </>
  );
}
