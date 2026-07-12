import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { AgeForm } from '@/features/age/age-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('age-calculator')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function AgeCalculatorPage() {
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
          The age calculator determines your exact age in years, months, and days.
          It also shows total days lived, total weeks, and how many days until your
          next birthday. Useful for exam eligibility checks, form applications, and
          age verification requirements.
        </p>
      }
      formula={
        <p>Age = Target Date − Date of Birth (accounting for varying month lengths and leap years)</p>
      }
      faq={[
        {
          question: 'How is age calculated for exam eligibility?',
          answer:
            'Most competitive exams calculate age as of a specific cutoff date. Set the "Calculate Age As Of" field to that cutoff date to check your eligibility.',
        },
        {
          question: 'Does this account for leap years?',
          answer:
            'Yes. The calculation uses actual calendar dates and correctly handles leap years and varying month lengths.',
        },
      ]}
      relatedTools={[
        { slug: 'attendance-calculator', title: 'Attendance Calculator', description: 'Track your attendance' },
        { slug: 'marks-percentage-calculator', title: 'Marks Percentage', description: 'Calculate percentage from marks' },
      ]}
    >
      <AgeForm />
    </ToolPageShell>
  );
}
