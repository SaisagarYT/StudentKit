import { Category } from '@/types/tool';

export const categories: Category[] = [
  {
    slug: 'college',
    title: 'College',
    description: 'Tools for attendance, grades and academic calculations.',
    icon: 'GraduationCap',
    accent: 'var(--text-primary)',
    accentBg: 'bg-[var(--bg-subtle)]',
  },
  {
    slug: 'exams',
    title: 'Exams',
    description: 'Utilities for eligibility, scores and applications.',
    icon: 'FileText',
    accent: 'var(--text-primary)',
    accentBg: 'bg-[var(--bg-subtle)]',
  },
  {
    slug: 'career',
    title: 'Career',
    description: 'Salary, resume and professional tools.',
    icon: 'Briefcase',
    accent: 'var(--text-primary)',
    accentBg: 'bg-[var(--bg-subtle)]',
  },
  {
    slug: 'documents',
    title: 'Documents',
    description: 'Resize, compress and prepare application documents.',
    icon: 'FileImage',
    accent: 'var(--text-primary)',
    accentBg: 'bg-[var(--bg-subtle)]',
  },
  {
    slug: 'developer',
    title: 'Developer',
    description: 'README generators, gitignore builders, and project scaffolding tools.',
    icon: 'Code',
    accent: 'var(--accent-dark)',
    accentBg: 'bg-[var(--bg-subtle)]',
  },
];
