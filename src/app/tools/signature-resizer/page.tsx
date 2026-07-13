import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { SignatureResizerForm } from '@/features/image-processing/signature-resizer-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('signature-resizer')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What size do most exam forms require?',
    answer:
      'Most government exam forms (UPSC, SSC, Bank PO) require 140×60 pixels in JPEG format under 20-50KB. Some may vary — always check the official notification.',
  },
  {
    question: 'Does this add a white background?',
    answer:
      'Yes. The tool fills the canvas with white and places your signature centered within the specified dimensions.',
  },
  {
    question: 'What format is the output?',
    answer:
      'Output is JPEG format at 90% quality, which meets the requirements of most application forms.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function SignatureResizerPage() {
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
          Many competitive exam forms and job applications require signature images
          in specific pixel dimensions. This tool resizes your signature to exact
          dimensions with a white background, ready for upload. Common requirements
          like UPSC, SSC, and Bank PO presets are included.
        </p>
      }
      faq={faq}
      relatedTools={[
        { slug: 'image-color-picker', title: 'Image Color Picker', description: 'Extract colors from any image' },
        { slug: 'color-palette-generator', title: 'Color Palette Generator', description: 'Generate harmonious color palettes' },
        { slug: 'image-compressor', title: 'Image Compressor', description: 'Compress images without losing quality' },
        { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimension' },
      ]}
    >
      <SignatureResizerForm />
    </ToolPageShell>
    </>
  );
}
