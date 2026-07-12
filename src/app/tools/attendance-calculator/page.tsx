import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { AttendanceForm } from '@/features/attendance/attendance-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('attendance-calculator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What attendance percentage do most colleges require?',
    answer:
      'Most Indian universities require a minimum of 75% attendance. Some colleges may require 80% or higher for exam eligibility. Check your institution\'s specific requirements.',
  },
  {
    question: 'Can this calculator predict future attendance?',
    answer:
      'Yes — it shows how many upcoming classes you can miss or need to attend to stay at or reach your target percentage.',
  },
  {
    question: 'Is my data stored anywhere?',
    answer:
      'No. All calculations happen directly in your browser. Nothing is sent to a server or stored.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function AttendanceCalculatorPage() {
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
          The attendance calculator helps you track your class attendance and
          plan ahead. Enter your total number of classes held, the number you
          attended, and your target percentage. It calculates whether you&apos;re
          above or below your target and tells you exactly how many classes you
          can miss or need to attend next.
        </p>
      }
      formula={
        <div className="space-y-2">
          <p>Attendance % = (Classes Attended / Total Classes) × 100</p>
          <p>Classes you can miss = (Attended × 100 − Target × Total) / Target</p>
          <p>Classes needed = (Target × Total − Attended × 100) / (100 − Target)</p>
        </div>
      }
      howToUse={
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Enter the total number of classes held so far.</li>
          <li>Enter how many classes you have attended.</li>
          <li>Set your target attendance percentage (default is 75%).</li>
          <li>Click &ldquo;Calculate&rdquo; to see your results.</li>
        </ol>
      }
      faq={faq}
      relatedTools={[
        { slug: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate cumulative GPA' },
        { slug: 'sgpa-calculator', title: 'SGPA Calculator', description: 'Calculate semester GPA' },
        { slug: 'marks-percentage-calculator', title: 'Marks Percentage', description: 'Calculate percentage from marks' },
      ]}
    >
      <AttendanceForm />
    </ToolPageShell>
    </>
  );
}
