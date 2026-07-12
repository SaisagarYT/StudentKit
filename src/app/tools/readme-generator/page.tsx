import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { ReadmeGeneratorForm } from '@/features/developer/readme-generator-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('readme-generator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What sections does the generated README include?',
    answer: 'The generator creates a README with project title, description, tech stack badges, installation instructions, usage guide, features list, environment variables table, contributing guidelines, and license information.',
  },
  {
    question: 'Can I customize which sections appear?',
    answer: 'Yes — only sections where you provide content are included in the output. Leave any field empty and it won\'t appear in your README.',
  },
  {
    question: 'Is the generated README saved anywhere?',
    answer: 'No. Everything runs in your browser. Use the Copy or Download button to save your README before leaving the page.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function ReadmeGeneratorPage() {
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
        { slug: 'gitignore-generator', title: '.gitignore Generator', description: 'Generate .gitignore files' },
        { slug: 'project-structure-generator', title: 'Project Structure', description: 'Generate folder structures' },
      ]}
    >
      <ReadmeGeneratorForm />
    </ToolPageShell>
    </>
  );
}
