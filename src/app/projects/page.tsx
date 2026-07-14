import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { PublicProjectsList } from '@/features/projects/public-projects-list';

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description:
    'Curated learning projects with guided milestones, architecture guidance, and roadmap connections. Build real-world applications step by step.',
  openGraph: {
    images: [{ url: '/og/projects.png', width: 1200, height: 630 }],
  },
};

export default function ProjectsPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main">
        <PublicProjectsList />
      </div>
    </div>
  );
}
