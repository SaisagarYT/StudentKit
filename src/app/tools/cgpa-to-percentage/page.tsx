import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { CGPAToPercentageForm } from '@/features/percentage/cgpa-to-percentage-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('cgpa-to-percentage')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'Which formula should I use?',
    answer:
      'Use the formula specified by your university. If unsure, the generic formula (CGPA × 9.5) is widely accepted for approximate conversions.',
  },
  {
    question: 'Is the conversion exact?',
    answer:
      'These are approximate conversions. For official purposes like job applications or higher education, check if the institution requires a specific conversion method.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function CGPAToPercentagePage() {
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
          Different universities use different formulas to convert CGPA to
          percentage. The most common generic formula multiplies CGPA by 9.5, but
          many institutions have their own specific conversion methods. Select the
          formula that matches your university for the most accurate result.
        </p>
      }
      formula={
        <div className="space-y-2">
          <p>Generic: Percentage = CGPA × 9.5</p>
          <p>Mumbai Uni: Percentage = 7.1 × CGPA + 11</p>
          <p>VTU: Percentage = (CGPA - 0.75) × 10</p>
          <p>CBCS/UGC: Percentage = CGPA × 10 - 7.5</p>
        </div>
      }
      faq={faq}
      relatedTools={[
        { slug: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate cumulative GPA' },
        { slug: 'marks-percentage-calculator', title: 'Marks Percentage', description: 'Calculate percentage from marks' },
      ]}
    >
      <CGPAToPercentageForm />
    </ToolPageShell>
    </>
  );
}
