export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const mainNavItems: NavItem[] = [
  { label: 'Tools', href: '/tools', description: 'Calculators & utilities' },
  { label: 'Roadmaps', href: '/roadmaps', description: 'Career & tech paths' },
  { label: 'Projects', href: '/projects', description: 'Build something real' },
  { label: 'Open Source', href: '/open-source', description: 'Discover GitHub repos' },
  { label: 'Placement', href: '/placement', description: 'DSA, CS & interview prep' },
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
      { label: 'Projects', href: '/projects' },
      { label: 'Open Source', href: '/open-source' },
      { label: 'Placement', href: '/placement' },
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
