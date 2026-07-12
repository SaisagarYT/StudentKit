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
