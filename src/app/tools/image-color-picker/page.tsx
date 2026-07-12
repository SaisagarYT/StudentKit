import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { ImageColorPickerForm } from '@/features/developer/image-color-picker-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('image-color-picker')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'How does the color extraction work?',
    answer: 'The tool analyzes your image pixels directly in your browser using the Canvas API. It samples colors across the image, groups similar colors together, and shows you the most dominant ones — no server processing needed.',
  },
  {
    question: 'What color formats are available?',
    answer: 'Each picked color is shown in HEX (#FF6432), RGB (rgb(255, 100, 50)), HSL (hsl(15, 100%, 60%)), and OKLCH (oklch(0.65 0.2 30)) — the modern CSS color format with perceptually uniform lightness.',
  },
  {
    question: 'Is my image uploaded anywhere?',
    answer: 'No. All processing happens entirely in your browser using the HTML5 Canvas API. Your images never leave your device.',
  },
  {
    question: 'How do I pick a specific color from the image?',
    answer: 'After uploading, hover over the image to see a live preview of the color under your cursor. Click anywhere on the image to select that color and see all its format values.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function ImageColorPickerPage() {
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
        { slug: 'color-palette-generator', title: 'Color Palette Generator', description: 'Generate harmonious palettes' },
        { slug: 'image-compressor', title: 'Image Compressor', description: 'Compress images in-browser' },
      ]}
    >
      <ImageColorPickerForm />
    </ToolPageShell>
    </>
  );
}
