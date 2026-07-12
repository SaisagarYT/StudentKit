import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { SignatureResizerForm } from '@/features/image-processing/signature-resizer-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('signature-resizer')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function SignatureResizerPage() {
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
          Many competitive exam forms and job applications require signature images
          in specific pixel dimensions. This tool resizes your signature to exact
          dimensions with a white background, ready for upload. Common requirements
          like UPSC, SSC, and Bank PO presets are included.
        </p>
      }
      faq={[
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
      ]}
      relatedTools={[
        { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimension' },
        { slug: 'image-compressor', title: 'Image Compressor', description: 'Compress images in-browser' },
      ]}
    >
      <SignatureResizerForm />
    </ToolPageShell>
  );
}
