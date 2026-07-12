import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { CompressorForm } from '@/features/image-processing/compressor-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('image-compressor')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function ImageCompressorPage() {
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
          This tool compresses images directly in your browser using the Canvas API.
          No files are uploaded to any server — processing happens entirely on your
          device. Adjust the quality slider to balance file size and image quality.
        </p>
      }
      faq={[
        {
          question: 'Is my image uploaded to a server?',
          answer:
            'No. All processing happens locally in your browser. Your images never leave your device.',
        },
        {
          question: 'What formats are supported?',
          answer:
            'JPEG, PNG, and WebP images are supported. JPEG images typically achieve the best compression ratios.',
        },
        {
          question: 'Why is my PNG not getting much smaller?',
          answer:
            'PNG is a lossless format. For significant size reduction, the image is converted to JPEG during compression. If you need to keep PNG format with transparency, the compression ratio will be limited.',
        },
      ]}
      relatedTools={[
        { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimension' },
        { slug: 'signature-resizer', title: 'Signature Resizer', description: 'Resize signatures for forms' },
      ]}
    >
      <CompressorForm />
    </ToolPageShell>
  );
}
