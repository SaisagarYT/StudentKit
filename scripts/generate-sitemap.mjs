import { writeFileSync } from 'fs';

const BASE_URL = 'https://studentkit.app';

const tools = [
  'attendance-calculator',
  'cgpa-calculator',
  'sgpa-calculator',
  'cgpa-to-percentage',
  'marks-percentage-calculator',
  'age-calculator',
  'ctc-to-inhand-calculator',
  'salary-calculator',
  'image-compressor',
  'image-resizer',
  'signature-resizer',
  'readme-generator',
  'gitignore-generator',
  'project-structure-generator',
  'color-palette-generator',
  'image-color-picker',
  'regex-tester',
  'json-formatter',
  'base64-encoder',
  'lorem-ipsum-generator',
  'uuid-generator',
];

const categories = ['college', 'exams', 'career', 'documents', 'developer'];

const roadmapSlugs = [
  'frontend-developer',
  'backend-developer',
  'full-stack-developer',
  'placement-preparation',
];

const staticPages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/roadmaps', priority: '0.8', changefreq: 'weekly' },
  { path: '/projects', priority: '0.8', changefreq: 'weekly' },
  { path: '/guides', priority: '0.7', changefreq: 'weekly' },
  { path: '/categories', priority: '0.7', changefreq: 'monthly' },
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
  ...categories.map((slug) => ({
    loc: `${BASE_URL}/categories/${slug}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  ...tools.map((slug) => ({
    loc: `${BASE_URL}/tools/${slug}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.8',
  })),
  ...roadmapSlugs.map((slug) => ({
    loc: `${BASE_URL}/roadmaps/${slug}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.8',
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
