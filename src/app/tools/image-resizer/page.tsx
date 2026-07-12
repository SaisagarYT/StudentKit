import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ResizerForm } from '@/features/image-processing/resizer-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('image-resizer')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function ImageResizerPage() {
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
          Resize any image to exact pixel dimensions. Lock the aspect ratio to
          prevent distortion, or unlock it for custom proportions. All processing
          is done in your browser — no uploads needed.
        </p>
      }
      faq={[
        {
          question: 'Will resizing reduce quality?',
          answer:
            'Upscaling (making an image larger) will reduce apparent quality since new pixels are interpolated. Downscaling generally maintains quality.',
        },
        {
          question: 'What does "lock aspect ratio" do?',
          answer:
            'When locked, changing width automatically adjusts height (and vice versa) to maintain the original proportions, preventing stretching or squishing.',
        },
      ]}
      relatedTools={[
        { slug: 'image-compressor', title: 'Image Compressor', description: 'Compress images in-browser' },
        { slug: 'signature-resizer', title: 'Signature Resizer', description: 'Resize signatures for forms' },
      ]}
    >
      <ResizerForm />
    </ToolPageShell>
  );
}
