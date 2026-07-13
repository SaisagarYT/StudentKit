import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { ProjectStructureForm } from '@/features/developer/project-structure-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('project-structure-generator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'Why does project structure matter?',
    answer: 'A well-organized folder structure makes your code easier to navigate, maintain, and scale. It also helps new contributors understand where things belong.',
  },
  {
    question: 'Should I follow these structures exactly?',
    answer: 'These are recommended starting points based on community best practices. Adapt them to your specific project needs — the goal is consistency, not rigid compliance.',
  },
  {
    question: 'What are the mkdir commands for?',
    answer: 'The "Copy as mkdir commands" button gives you shell commands you can paste into your terminal to instantly create the entire folder structure for a new project.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function ProjectStructureGeneratorPage() {
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
        { slug: 'readme-generator', title: 'README Generator', description: 'Generate professional README files' },
        { slug: 'gitignore-generator', title: '.gitignore Generator', description: 'Generate .gitignore for any stack' },
        { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format, validate & minify JSON' },
      ]}
    >
      <ProjectStructureForm />
    </ToolPageShell>
    </>
  );
}
