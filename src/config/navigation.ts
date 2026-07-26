export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavGroup {
  label: string;
  description: string;
  icon: string;
  href: string;
  children: NavItem[];
}

export const mainNavItems: NavGroup[] = [
  {
    label: 'Learn',
    description: 'Structured paths to master any skill',
    icon: 'GraduationCap',
    href: '/roadmaps',
    children: [
      { label: 'Learning Paths', href: '/roadmaps', description: 'Step-by-step roadmaps for every career goal', icon: 'Route' },
      { label: 'Resources', href: '/resources', description: 'Curated tutorials and guides', icon: 'BookOpen' },
      { label: 'Challenges', href: '/challenges', description: 'Weekly coding sprints', icon: 'Zap' },
    ],
  },
  {
    label: 'Build',
    description: 'Learn by creating real projects',
    icon: 'Hammer',
    href: '/projects',
    children: [
      { label: 'Guided Projects', href: '/projects', description: 'Step-by-step projects with milestones', icon: 'FolderKanban' },
      { label: 'Open Source', href: '/open-source', description: 'Curated GitHub repos to study and contribute', icon: 'GitFork' },
    ],
  },
  {
    label: 'Prepare',
    description: 'Get job-ready with structured prep',
    icon: 'Target',
    href: '/placement',
    children: [
      { label: 'DSA Sheet', href: '/placement/dsa', description: '250+ problems organized by pattern', icon: 'Binary' },
      { label: 'CS Fundamentals', href: '/placement/cs-fundamentals', description: 'OS, DBMS, Networks & more', icon: 'Cpu' },
      { label: 'Interview Prep', href: '/placement/interview', description: 'Company-wise questions & tips', icon: 'MessageSquare' },
    ],
  },
];

export const secondaryNavItems: NavItem[] = [
  { label: 'Tools', href: '/tools', description: 'Calculators & utilities', icon: 'Wrench' },
  { label: 'Leaderboard', href: '/leaderboard', description: 'Top learners ranked', icon: 'Trophy' },
];

export const footerNavSections = [
  {
    title: 'Learn',
    links: [
      { label: 'Learning Paths', href: '/roadmaps' },
      { label: 'Resources', href: '/resources' },
      { label: 'Challenges', href: '/challenges' },
    ],
  },
  {
    title: 'Build',
    links: [
      { label: 'Guided Projects', href: '/projects' },
      { label: 'Open Source', href: '/open-source' },
    ],
  },
  {
    title: 'Prepare',
    links: [
      { label: 'DSA Sheet', href: '/placement/dsa' },
      { label: 'CS Fundamentals', href: '/placement/cs-fundamentals' },
      { label: 'Interview Prep', href: '/placement/interview' },
      { label: 'Leaderboard', href: '/leaderboard' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'College Tools', href: '/categories/college' },
      { label: 'Exam Tools', href: '/categories/exams' },
      { label: 'Career Tools', href: '/categories/career' },
      { label: 'Developer Tools', href: '/categories/developer' },
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
