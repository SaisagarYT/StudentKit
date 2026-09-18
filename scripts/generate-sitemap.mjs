import { writeFileSync } from 'fs';

const BASE_URL = 'https://studentkit.app';

const roadmapSlugs = [
  'frontend-developer',
  'backend-developer',
  'full-stack-developer',
  'ai-engineer',
  'mobile-developer',
  'devops-engineer',
  'cybersecurity',
  'placement-preparation',
  'object-oriented-programming',
];

const projectSlugs = [];

const staticPages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/roadmaps', priority: '0.9', changefreq: 'weekly' },
  { path: '/projects', priority: '0.8', changefreq: 'weekly' },
  { path: '/placement', priority: '0.8', changefreq: 'weekly' },
  { path: '/placement/dsa', priority: '0.8', changefreq: 'daily' },
  { path: '/placement/cs-fundamentals', priority: '0.7', changefreq: 'weekly' },
  { path: '/placement/interview', priority: '0.7', changefreq: 'weekly' },
  { path: '/open-source', priority: '0.7', changefreq: 'weekly' },
  { path: '/guides', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
];

const today = new Date().toISOString().split('T')[0];

const urls = [
  ...staticPages.map(({ path, priority, changefreq }) => ({
    loc: `${BASE_URL}${path}`,
    lastmod: today,
    changefreq,
    priority,
  })),
  ...roadmapSlugs.map((slug) => ({
    loc: `${BASE_URL}/roadmaps/view?slug=${slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  ...projectSlugs.map((slug) => ({
    loc: `${BASE_URL}/projects/view?slug=${slug}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated with ${urls.length} URLs`);
