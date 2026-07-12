export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const mainNavItems: NavItem[] = [
  { label: 'Tools', href: '/tools', description: 'Browse all tools' },
  { label: 'College', href: '/categories/college', description: 'Academic calculators' },
  { label: 'Exams', href: '/categories/exams', description: 'Exam utilities' },
  { label: 'Career', href: '/categories/career', description: 'Professional tools' },
  { label: 'Documents', href: '/categories/documents', description: 'Document utilities' },
  { label: 'Guides', href: '/guides', description: 'How-to guides' },
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
    title: 'Resources',
    links: [
      { label: 'All Tools', href: '/tools' },
      { label: 'Guides', href: '/guides' },
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
