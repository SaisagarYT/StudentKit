import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { GitignoreGeneratorForm } from '@/features/developer/gitignore-generator-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('gitignore-generator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What is a .gitignore file?',
    answer: 'A .gitignore file tells Git which files and directories to ignore in your repository. This prevents unnecessary files like dependencies, build outputs, and IDE configs from being tracked.',
  },
  {
    question: 'Can I combine multiple technologies?',
    answer: 'Yes — select all the technologies in your stack and the generator combines all relevant patterns into one .gitignore file, removing duplicates automatically.',
  },
  {
    question: 'Where do I put the .gitignore file?',
    answer: 'Place it in the root directory of your Git repository. Git will apply the ignore rules to all files in the repo and its subdirectories.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function GitignoreGeneratorPage() {
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
        { slug: 'project-structure-generator', title: 'Project Structure', description: 'Generate folder structures' },
      ]}
    >
      <GitignoreGeneratorForm />
    </ToolPageShell>
    </>
  );
}
