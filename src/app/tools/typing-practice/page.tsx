import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { TypingPracticeForm } from '@/features/career/typing-practice-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('typing-practice')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What is a good typing speed (WPM)?',
    answer: 'The average typing speed is around 40 WPM. A good speed for professionals is 65-75 WPM. Expert typists can reach 100+ WPM. For programmers, accuracy matters more than raw speed.',
  },
  {
    question: 'How is WPM calculated?',
    answer: 'WPM is calculated by dividing the total characters typed by 5 (a standard word length) and then dividing by the elapsed time in minutes. Net WPM subtracts errors from this calculation.',
  },
  {
    question: 'How can I improve my typing speed?',
    answer: 'Practice regularly with proper finger placement on the home row. Focus on accuracy first — speed will follow naturally. Use the programming mode to practice typing code-related words.',
  },
  {
    question: 'What is the difference between Raw WPM and Net WPM?',
    answer: 'Raw WPM counts all keystrokes regardless of errors. Net WPM (the main score) penalizes mistakes by subtracting incorrect characters, giving a more accurate measure of effective typing speed.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function TypingPracticePage() {
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
        { slug: 'readme-generator', title: 'README Generator', description: 'Generate professional GitHub READMEs' },
        { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format, validate & minify JSON' },
        { slug: 'regex-tester', title: 'Regex Tester', description: 'Test regular expressions live' },
        { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text' },
      ]}
    >
      <TypingPracticeForm />
    </ToolPageShell>
    </>
  );
}
