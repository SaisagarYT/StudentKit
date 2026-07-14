import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { GitHubProjects } from '@/features/projects/github-projects';

export const metadata: Metadata = {
  title: `Open Source Projects | ${siteConfig.name}`,
  description: 'Discover real-world open source projects from GitHub — filtered by difficulty, categorized by tech stack. Find beginner to advanced projects to learn from and contribute to.',
  openGraph: {
    images: [{ url: '/og/projects.png', width: 1200, height: 630 }],
  },
};

export default function ProjectsPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main">
        <GitHubProjects />
      </div>
    </div>
  );
}
