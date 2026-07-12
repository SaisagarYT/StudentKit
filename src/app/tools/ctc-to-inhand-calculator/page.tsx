import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { CTCForm } from '@/features/salary/ctc-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('ctc-to-inhand-calculator')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function CTCToInHandPage() {
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
          CTC (Cost to Company) includes everything your employer spends on you —
          basic pay, HRA, PF contributions, insurance, and other benefits. Your
          in-hand salary is what you actually receive after deductions. This tool
          provides an estimate based on standard Indian salary structures.
        </p>
      }
      formula={
        <div className="space-y-2">
          <p>Basic Pay = CTC × 40%</p>
          <p>HRA = Basic × 50%</p>
          <p>Employer PF = min(Basic × 12%, ₹21,600)</p>
          <p>In-Hand = CTC − Employer PF − Employee PF − Professional Tax − Income Tax</p>
        </div>
      }
      faq={[
        {
          question: 'Why is my in-hand salary lower than CTC?',
          answer:
            'CTC includes employer contributions to PF, insurance, and gratuity that you don\'t receive as cash monthly. After deducting these plus your tax and PF contribution, the remainder is your in-hand salary.',
        },
        {
          question: 'Is this calculation exact?',
          answer:
            'This is an estimate. Your actual in-hand salary depends on your company\'s specific salary structure, tax regime choice, HRA exemptions, and investment declarations.',
        },
        {
          question: 'What tax regime does this use?',
          answer:
            'This calculator uses the New Tax Regime (FY 2024-25) with standard deduction of ₹75,000 for the income tax estimation.',
        },
      ]}
      relatedTools={[
        { slug: 'salary-calculator', title: 'Salary Calculator', description: 'Calculate salary components' },
        { slug: 'marks-percentage-calculator', title: 'Marks Percentage', description: 'Calculate percentage from marks' },
      ]}
    >
      <CTCForm />
    </ToolPageShell>
  );
}
