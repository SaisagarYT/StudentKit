import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { MarksPercentageForm } from '@/features/percentage/marks-percentage-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('marks-percentage-calculator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'Can I calculate percentage for multiple subjects?',
    answer:
      'Enter the sum of marks obtained across all subjects and the sum of total marks to get your overall percentage.',
  },
  {
    question: 'What is a good percentage?',
    answer:
      'This depends on context. Generally, above 75% is considered first division, above 60% is second division, and above 50% is a pass in most Indian universities.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function MarksPercentageCalculatorPage() {
  return (
    <>
    <ToolStructuredData tool={tool} breadcrumbs={breadcrumbs} faq={faq} />
    <ToolPageShell
      title={tool.title}
      description={tool.description}
      category={tool.category}
      breadcrumbs={breadcrumbs}
      explanation={
        <p>
          The marks percentage calculator converts your obtained marks into a
          percentage of the total marks. This is useful for understanding your
          performance in exams, assignments, or overall academic results.
        </p>
      }
      formula={
        <p>Percentage = (Marks Obtained / Total Marks) × 100</p>
      }
      faq={faq}
      relatedTools={[
        { slug: 'cgpa-to-percentage', title: 'CGPA to Percentage', description: 'Convert CGPA to percentage' },
        { slug: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate cumulative GPA' },
      ]}
    >
      <MarksPercentageForm />
    </ToolPageShell>
    </>
  );
}
