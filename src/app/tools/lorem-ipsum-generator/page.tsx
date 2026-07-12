import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { LoremIpsumForm } from '@/features/developer/lorem-ipsum-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('lorem-ipsum-generator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What is Lorem Ipsum?',
    answer: 'Lorem Ipsum is standard placeholder text used in design and development to fill layouts before real content is available. It helps visualize how text will look without being distracted by meaningful content.',
  },
  {
    question: 'Is the generated text random?',
    answer: 'The text is pseudo-random — it uses standard Latin-like words from the traditional Lorem Ipsum corpus, mixed in different combinations each time you generate.',
  },
  {
    question: 'Can I control the length?',
    answer: 'Yes — choose between paragraphs, sentences, or words mode, then specify how many you need (1 to 50). The output adjusts accordingly.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function LoremIpsumGeneratorPage() {
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
        { slug: 'readme-generator', title: 'README Generator', description: 'Generate professional READMEs' },
        { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate unique UUIDs' },
      ]}
    >
      <LoremIpsumForm />
    </ToolPageShell>
    </>
  );
}
