import { Tool } from '@/types/tool';

export const tools: Tool[] = [
  {
    slug: 'attendance-calculator',
    title: 'Attendance Calculator',
    shortDescription: 'Track attendance & plan absences',
    description:
      'Calculate your current attendance percentage and find out how many classes you can miss or need to attend to reach your target.',
    category: 'college',
    icon: 'CalendarCheck',
    keywords: ['attendance', 'classes', 'absent', 'present', 'percentage', 'college'],
    featured: true,
    cardSize: 'large',
  },
  {
    slug: 'cgpa-calculator',
    title: 'CGPA Calculator',
    shortDescription: 'Calculate cumulative GPA',
    description:
      'Calculate your Cumulative Grade Point Average across multiple semesters with credit-weighted computation.',
    category: 'college',
    icon: 'Award',
    keywords: ['cgpa', 'gpa', 'grade', 'semester', 'credits', 'cumulative'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'sgpa-calculator',
    title: 'SGPA Calculator',
    shortDescription: 'Calculate semester GPA',
    description:
      'Calculate your Semester Grade Point Average with subject-wise grade points and credit hours.',
    category: 'college',
    icon: 'BookOpen',
    keywords: ['sgpa', 'semester', 'gpa', 'grade points', 'credits'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'cgpa-to-percentage',
    title: 'CGPA to Percentage',
    shortDescription: 'Convert CGPA to percentage',
    description:
      'Convert your CGPA to equivalent percentage using standard conversion formulas.',
    category: 'college',
    icon: 'Percent',
    keywords: ['cgpa', 'percentage', 'convert', 'formula'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'marks-percentage-calculator',
    title: 'Marks Percentage Calculator',
    shortDescription: 'Calculate percentage from marks',
    description:
      'Calculate your percentage from marks obtained and total marks with a clear breakdown.',
    category: 'college',
    icon: 'Calculator',
    keywords: ['marks', 'percentage', 'total', 'obtained', 'score'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    shortDescription: 'Calculate exact age',
    description:
      'Calculate your exact age in years, months and days from your date of birth to any target date.',
    category: 'exams',
    icon: 'Clock',
    keywords: ['age', 'date of birth', 'years', 'months', 'days', 'eligibility'],
    featured: true,
    cardSize: 'small',
  },
  {
    slug: 'ctc-to-inhand-calculator',
    title: 'CTC to In-Hand Salary',
    shortDescription: 'Estimate take-home salary',
    description:
      'Estimate your monthly in-hand salary from your annual CTC with a breakdown of standard deductions.',
    category: 'career',
    icon: 'IndianRupee',
    keywords: ['ctc', 'salary', 'in-hand', 'take home', 'deductions', 'fresher'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'salary-calculator',
    title: 'Salary Calculator',
    shortDescription: 'Calculate salary components',
    description:
      'Break down your salary into components including basic pay, HRA, and deductions.',
    category: 'career',
    icon: 'Wallet',
    keywords: ['salary', 'basic', 'hra', 'deductions', 'components'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    shortDescription: 'Compress images in-browser',
    description:
      'Compress images directly in your browser without uploading. Reduce file size while maintaining quality.',
    category: 'documents',
    icon: 'ImageDown',
    keywords: ['image', 'compress', 'reduce', 'size', 'jpeg', 'png', 'quality'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    shortDescription: 'Resize images to any dimension',
    description:
      'Resize images to exact dimensions with aspect ratio control. All processing happens in your browser.',
    category: 'documents',
    icon: 'Maximize2',
    keywords: ['image', 'resize', 'dimensions', 'width', 'height', 'aspect ratio'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'signature-resizer',
    title: 'Signature Resizer',
    shortDescription: 'Resize signatures for forms',
    description:
      'Resize your signature image to exact dimensions required by exam forms and applications.',
    category: 'documents',
    icon: 'PenTool',
    keywords: ['signature', 'resize', 'exam', 'form', 'application', 'dimensions'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'readme-generator',
    title: 'README Generator',
    shortDescription: 'Generate professional READMEs',
    description:
      'Create a professional GitHub README.md with sections for installation, usage, features, and more — with live preview and one-click copy.',
    category: 'developer',
    icon: 'FileText',
    keywords: ['readme', 'markdown', 'github', 'documentation', 'project', 'generator'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'gitignore-generator',
    title: '.gitignore Generator',
    shortDescription: 'Generate .gitignore files',
    description:
      'Select your tech stack and generate a comprehensive .gitignore file instantly. Supports Node.js, Python, Java, Flutter, and more.',
    category: 'developer',
    icon: 'GitBranch',
    keywords: ['gitignore', 'git', 'ignore', 'node', 'python', 'react', 'generator'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'project-structure-generator',
    title: 'Project Structure Generator',
    shortDescription: 'Generate folder structures',
    description:
      'Generate recommended project folder structures for different frameworks and architectures. Copy as text or create commands.',
    category: 'developer',
    icon: 'FolderTree',
    keywords: ['project', 'structure', 'folder', 'architecture', 'scaffold', 'boilerplate'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'color-palette-generator',
    title: 'Color Palette Generator',
    shortDescription: 'Generate harmonious color palettes',
    description:
      'Pick a base color from the color wheel and generate harmonious palettes using complementary, analogous, triadic, and other color theory rules. Export in HEX, RGB, and HSL.',
    category: 'developer',
    icon: 'Palette',
    keywords: ['color', 'palette', 'wheel', 'complementary', 'analogous', 'triadic', 'hex', 'rgb', 'hsl', 'design'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'image-color-picker',
    title: 'Image Color Picker',
    shortDescription: 'Extract colors from images',
    description:
      'Upload an image to automatically detect dominant colors, or use the pointer to pick any specific pixel. Get color values in HEX, RGB, HSL, and OKLCH formats.',
    category: 'developer',
    icon: 'Pipette',
    keywords: ['color', 'picker', 'image', 'eyedropper', 'extract', 'hex', 'rgb', 'hsl', 'oklch', 'palette'],
    featured: true,
    cardSize: 'medium',
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    shortDescription: 'Test regular expressions live',
    description:
      'Test and debug regular expressions with real-time matching, capture groups, and common pattern library. Supports JavaScript regex syntax.',
    category: 'developer',
    icon: 'Regex',
    keywords: ['regex', 'regular expression', 'pattern', 'match', 'test', 'javascript', 'replace'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    shortDescription: 'Format & validate JSON',
    description:
      'Paste JSON to instantly format, validate, minify, or convert to other formats. Highlights errors with line numbers.',
    category: 'developer',
    icon: 'Braces',
    keywords: ['json', 'format', 'validate', 'minify', 'beautify', 'parse', 'lint'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'base64-encoder',
    title: 'Base64 Encoder/Decoder',
    shortDescription: 'Encode & decode Base64',
    description:
      'Encode text or files to Base64 and decode Base64 strings back to text. Supports UTF-8 and file encoding.',
    category: 'developer',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text', 'convert', 'data uri'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    shortDescription: 'Generate placeholder text',
    description:
      'Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Copy formatted or plain text instantly.',
    category: 'developer',
    icon: 'Type',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', 'filler', 'content'],
    featured: false,
    cardSize: 'small',
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    shortDescription: 'Generate unique UUIDs',
    description:
      'Generate UUID v4 identifiers instantly. Create single or bulk UUIDs with one-click copy for your projects.',
    category: 'developer',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'unique', 'identifier', 'generate', 'v4', 'random'],
    featured: false,
    cardSize: 'small',
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured);
}

export function searchTools(query: string): Tool[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return tools;

  return tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(lower) ||
      tool.shortDescription.toLowerCase().includes(lower) ||
      tool.keywords.some((k) => k.includes(lower))
  );
}
