import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
configDotenv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dataDir = resolve(root, 'src/data/cms');

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let db;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({ credential: cert(serviceAccount), projectId });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({ projectId });
  } else {
    throw new Error('No credentials configured');
  }
  db = getFirestore();
} catch (e) {
  console.log('Firebase Admin not configured — generating empty manifests');
  console.log('Set FIREBASE_SERVICE_ACCOUNT env var for full build-time SEO.');
  generateEmptyManifests();
  process.exit(0);
}

async function fetchPublishedRoadmaps() {
  const snap = await db.collection('roadmaps')
    .where('status', '==', 'published')
    .orderBy('order', 'asc')
    .get();

    console.log(snap);

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      estimatedDuration: data.estimatedDuration,
      icon: data.icon,
      accent: data.accent,
      featured: data.featured,
      tags: data.tags || [],
      variants: data.variants || [],
      sections: (data.sections || []).map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        timeEstimate: s.timeEstimate,
        color: s.color,
        order: s.order,
        topics: (s.topics || []).map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          timeEstimate: t.timeEstimate,
          whatToLearn: t.whatToLearn || [],
          resources: t.resources || [],
          project: t.project || { title: '', description: '' },
          ...(t.variant ? { variant: t.variant } : {}),
        })),
      })),
    };
  });
}

async function fetchPublishedProjects() {
  const snap = await db.collection('projects')
    .where('status', '==', 'published')
    .orderBy('order', 'asc')
    .get();
  console.log(snap);
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      estimatedDuration: data.estimatedDuration,
      projectType: data.projectType,
      technologies: data.technologies || [],
      features: data.features || [],
      milestones: data.milestones || [],
      architecture: data.architecture || '',
      folderStructure: data.folderStructure || '',
      featured: data.featured,
      tags: data.tags || [],
    };
  });
}

function generateEmptyManifests() {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(resolve(dataDir, 'roadmaps.json'), JSON.stringify([], null, 2));
  writeFileSync(resolve(dataDir, 'projects.json'), JSON.stringify([], null, 2));
  writeFileSync(resolve(dataDir, 'manifest.json'), JSON.stringify({ roadmapSlugs: [], projectSlugs: [], generatedAt: new Date().toISOString() }, null, 2));
  console.log('Empty CMS manifests generated');
}

async function main() {
  console.log('Fetching CMS content for static build...\n');

  mkdirSync(dataDir, { recursive: true });

  try {
    const [roadmaps, projects] = await Promise.all([
      fetchPublishedRoadmaps(),
      fetchPublishedProjects(),
    ]);

    writeFileSync(resolve(dataDir, 'roadmaps.json'), JSON.stringify(roadmaps, null, 2));
    writeFileSync(resolve(dataDir, 'projects.json'), JSON.stringify(projects, null, 2));

    const manifest = {
      roadmapSlugs: roadmaps.map((r) => r.slug),
      projectSlugs: projects.map((p) => p.slug),
      generatedAt: new Date().toISOString(),
    };
    writeFileSync(resolve(dataDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // Update sitemap slugs
    updateSitemapSlugs(roadmaps.map((r) => r.slug), projects.map((p) => p.slug));

    console.log(`${roadmaps.length} roadmaps`);
    console.log(`${projects.length} projects`);
    console.log(`\nCMS content fetched!`);
  } catch (e) {
    console.error('Failed to fetch CMS content:', e.message);
    console.log('Generating empty manifests...');
    generateEmptyManifests();
  }

  process.exit(0);
}

function updateSitemapSlugs(roadmapSlugs, projectSlugs) {
  const sitemapPath = resolve(root, 'scripts/generate-sitemap.mjs');
  let content;
  try {
    content = readFileSync(sitemapPath, 'utf-8');
  } catch {
    return;
  }

  // Replace roadmapSlugs array
  content = content.replace(
    /const roadmapSlugs = \[[\s\S]*?\];/,
    `const roadmapSlugs = [\n${roadmapSlugs.map((s) => `  '${s}',`).join('\n')}\n];`
  );

  // Replace projectSlugs array
  content = content.replace(
    /const projectSlugs = \[[\s\S]*?\];/,
    `const projectSlugs = [\n${projectSlugs.map((s) => `  '${s}',`).join('\n')}\n];`
  );

  writeFileSync(sitemapPath, content);
}

main();
