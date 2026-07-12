import { Category } from '@/types/tool';

export const categories: Category[] = [
  {
    slug: 'college',
    title: 'College',
    description: 'Tools for attendance, grades and academic calculations.',
    icon: 'GraduationCap',
    accent: 'var(--accent-college)',
    accentBg: 'bg-[#D8CCFF]/20',
  },
  {
    slug: 'exams',
    title: 'Exams',
    description: 'Utilities for eligibility, scores and applications.',
    icon: 'FileText',
    accent: 'var(--accent-exams)',
    accentBg: 'bg-[#FFE066]/20',
  },
  {
    slug: 'career',
    title: 'Career',
    description: 'Salary, resume and professional tools.',
    icon: 'Briefcase',
    accent: 'var(--accent-career)',
    accentBg: 'bg-[#FFB36B]/20',
  },
  {
    slug: 'documents',
    title: 'Documents',
    description: 'Resize, compress and prepare application documents.',
    icon: 'FileImage',
    accent: 'var(--accent-documents)',
    accentBg: 'bg-[#A8F0E6]/20',
  },
  {
    slug: 'developer',
    title: 'Developer',
    description: 'README generators, gitignore builders, and project scaffolding tools.',
    icon: 'Code',
    accent: 'var(--accent-primary)',
    accentBg: 'bg-[#C7FF3D]/20',
  },
];
