import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { CGPAForm } from '@/features/cgpa/cgpa-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('cgpa-calculator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What is the difference between SGPA and CGPA?',
    answer:
      'SGPA is your Grade Point Average for a single semester. CGPA is the cumulative average across all semesters, weighted by credits.',
  },
  {
    question: 'Is CGPA calculated on a 10-point or 4-point scale?',
    answer:
      'This calculator works with any scale. Most Indian universities use a 10-point scale, while many international institutions use a 4-point scale. Enter your SGPAs in whatever scale your university uses.',
  },
  {
    question: 'How do credits affect my CGPA?',
    answer:
      'Semesters with more credits have more weight in your CGPA calculation. A high SGPA in a credit-heavy semester impacts your overall CGPA more than one in a lighter semester.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function CGPACalculatorPage() {
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
          CGPA (Cumulative Grade Point Average) is the weighted average of your
          SGPA across all semesters. Each semester&apos;s GPA is weighted by the
          number of credits in that semester, giving a more accurate overall
          picture of your academic performance.
        </p>
      }
      formula={
        <div className="space-y-2">
          <p>CGPA = Σ(SGPA × Credits) / Σ(Credits)</p>
          <p className="text-[var(--text-subtle)]">
            Where the sum is taken over all semesters
          </p>
        </div>
      }
      faq={faq}
      relatedTools={[
        { slug: 'sgpa-calculator', title: 'SGPA Calculator', description: 'Calculate your semester GPA' },
        { slug: 'cgpa-to-percentage', title: 'CGPA to Percentage', description: 'Convert CGPA to percentage' },
        { slug: 'marks-percentage-calculator', title: 'Marks Calculator', description: 'Calculate percentage from marks' },
        { slug: 'attendance-calculator', title: 'Attendance Calculator', description: 'Track & manage your attendance' },
      ]}
    >
      <CGPAForm />
    </ToolPageShell>
    </>
  );
}
