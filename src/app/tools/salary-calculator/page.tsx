import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { SalaryForm } from '@/features/salary/salary-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('salary-calculator')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function SalaryCalculatorPage() {
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
          The salary calculator converts between different pay periods — annual,
          monthly, weekly, daily, and hourly. Useful when comparing job offers
          that quote different periods, or understanding what your time is worth.
        </p>
      }
      formula={
        <div className="space-y-2">
          <p>Monthly = Annual / 12</p>
          <p>Weekly = Annual / 52</p>
          <p>Daily = Annual / 260 (5 working days × 52 weeks)</p>
          <p>Hourly = Annual / 2,080 (8 hours × 260 days)</p>
        </div>
      }
      faq={[
        {
          question: 'Does this include taxes?',
          answer:
            'No, this is a simple period conversion. For tax estimation, use the CTC to In-Hand Calculator.',
        },
        {
          question: 'Why 260 working days?',
          answer:
            'Standard calculation assumes 5 working days per week × 52 weeks = 260 working days per year.',
        },
      ]}
      relatedTools={[
        { slug: 'ctc-to-inhand-calculator', title: 'CTC to In-Hand', description: 'Estimate take-home salary' },
      ]}
    >
      <SalaryForm />
    </ToolPageShell>
  );
}
