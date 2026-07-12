import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { tools } from '@/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    { path: '', priority: 1 },
    { path: '/tools', priority: 0.9 },
    { path: '/categories', priority: 0.7 },
    { path: '/about', priority: 0.5 },
    { path: '/contact', priority: 0.4 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
    { path: '/disclaimer', priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
  }));

  return [...staticPages, ...toolPages];
}
