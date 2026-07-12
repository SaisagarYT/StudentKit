import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { SGPAForm } from '@/features/sgpa/sgpa-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('sgpa-calculator')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function SGPACalculatorPage() {
  return (
    <ToolPageShell
      title={tool.title}
      description={tool.description}
      category={tool.category}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Tools', href: '/tools' },
        { label: tool.title },
      ]}
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
      faq={[
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
      ]}
      relatedTools={[
        { slug: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate cumulative GPA' },
        { slug: 'cgpa-to-percentage', title: 'CGPA to Percentage', description: 'Convert CGPA to percentage' },
      ]}
    >
      <SGPAForm />
    </ToolPageShell>
  );
}
