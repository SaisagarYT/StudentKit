import { Metadata } from 'next';
import { ToolPageShell } from '@/components/layout/tool-page-shell';
import { ToolStructuredData } from '@/components/seo/tool-structured-data';
import { ColorPaletteForm } from '@/features/developer/color-palette-form';
import { generateToolMetadata } from '@/lib/seo';
import { getToolBySlug } from '@/config/tools';

const tool = getToolBySlug('color-palette-generator')!;

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: tool.title },
];

const faq = [
  {
    question: 'What are color harmony rules?',
    answer: 'Color harmony rules are based on color theory — they use the position of colors on the color wheel to create visually pleasing combinations. Complementary colors are opposite each other, analogous colors are next to each other, and triadic colors form a triangle.',
  },
  {
    question: 'What color formats are supported?',
    answer: 'The generator outputs colors in HEX (#FF6432), RGB (rgb(255, 100, 50)), and HSL (hsl(15, 100%, 60%)) formats. You can also export as CSS custom properties or Tailwind config values.',
  },
  {
    question: 'How do I use the generated palette in my project?',
    answer: 'Click "Copy as CSS Variables" to get ready-to-paste custom properties for your stylesheet, or use "Copy as Tailwind" for your Tailwind config. You can also click individual swatches to copy single color values.',
  },
];

export const metadata: Metadata = generateToolMetadata(tool);

export default function ColorPaletteGeneratorPage() {
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
        { slug: 'image-color-picker', title: 'Image Color Picker', description: 'Extract colors from images' },
        { slug: 'readme-generator', title: 'README Generator', description: 'Generate professional READMEs' },
      ]}
    >
      <ColorPaletteForm />
    </ToolPageShell>
    </>
  );
}
