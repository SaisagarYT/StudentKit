import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { SGPAForm } from '@/features/sgpa/sgpa-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('sgpa-calculator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What grade points should I enter?',
    answer:
      'Enter the grade points awarded for each subject. On a 10-point scale, this is typically 10 for O/A+, 9 for A, 8 for B+, etc. Check your university\'s grading scheme.',
  },
  {
    question: 'What are credits?',
    answer:
      'Credits represent the weightage or hours assigned to each subject. Core subjects typically have 3-4 credits, while labs may have 1-2.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function SGPACalculatorPage() {
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
          SGPA (Semester Grade Point Average) is the weighted average of grade
          points across all subjects in a single semester. It accounts for the
          number of credits each subject carries, giving heavier subjects more
          weight in the final calculation.
        </p>
      }
      formula={
        <div className="space-y-2">
          <p>SGPA = Σ(Grade Points × Credits) / Σ(Credits)</p>
          <p className="text-[var(--text-subtle)]">
            Sum over all subjects in the semester
          </p>
        </div>
      }
      faq={faq}
      relatedTools={[
        { slug: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate cumulative GPA across all semesters' },
        { slug: 'cgpa-to-percentage', title: 'CGPA to Percentage', description: 'Convert CGPA to percentage' },
        { slug: 'marks-percentage-calculator', title: 'Marks Calculator', description: 'Calculate percentage from marks' },
        { slug: 'attendance-calculator', title: 'Attendance Calculator', description: 'Track & manage your attendance' },
      ]}
    >
      <SGPAForm />
    </ToolPageShell>
    </>
  );
}
