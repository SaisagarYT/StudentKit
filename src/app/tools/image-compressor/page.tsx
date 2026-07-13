import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { CompressorForm } from '@/features/image-processing/compressor-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('image-compressor')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
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
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function ImageCompressorPage() {
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
          This tool compresses images directly in your browser using the Canvas API.
          No files are uploaded to any server — processing happens entirely on your
          device. Adjust the quality slider to balance file size and image quality.
        </p>
      }
      faq={faq}
      relatedTools={[
        { slug: 'image-color-picker', title: 'Image Color Picker', description: 'Extract colors from any image' },
        { slug: 'color-palette-generator', title: 'Color Palette Generator', description: 'Generate harmonious color palettes' },
        { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to any dimension' },
        { slug: 'signature-resizer', title: 'Signature Resizer', description: 'Resize signatures for forms & documents' },
      ]}
    >
      <CompressorForm />
    </ToolPageShell>
    </>
  );
}
