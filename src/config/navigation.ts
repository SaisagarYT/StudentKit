export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const mainNavItems: NavItem[] = [
  { label: 'Tools', href: '/tools', description: 'Calculators & utilities' },
  { label: 'Roadmaps', href: '/roadmaps', description: 'Career & tech paths' },
  { label: 'Projects', href: '/projects', description: 'Build something real' },
  { label: 'Guides', href: '/guides', description: 'Step-by-step learning' },
];

export const footerNavSections = [
  {
    title: 'Tools',
    links: [
      { label: 'College Tools', href: '/categories/college' },
      { label: 'Exam Tools', href: '/categories/exams' },
      { label: 'Career Tools', href: '/categories/career' },
      { label: 'Document Tools', href: '/categories/documents' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Roadmaps', href: '/roadmaps' },
      { label: 'Guides', href: '/guides' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];
