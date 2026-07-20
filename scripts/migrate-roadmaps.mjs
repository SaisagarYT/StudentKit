
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load .env.local
const envFile = readFileSync(resolve(root, '.env.local'), 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  env[key.trim()] = rest.join('=').trim();
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing Firebase config in .env.local');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hardcoded roadmap data — we'll dynamically import from the compiled output
// Since these are TypeScript, we need to read the raw data manually.
// Instead, we'll define the essential mapping here.

const ROADMAPS = [
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

// We need to read the TS source files and extract the data.
// Since we can't import TS directly, we'll use a regex approach to parse the exported objects.
// Actually, the cleanest approach: use tsx/ts-node to eval, or just hardcode the transformation.
// Best approach: read the compiled Next.js output or use eval with stripped types.

// Simplest reliable approach: use the Next.js build artifacts from .next/
// OR we import using dynamic import with tsx loader.
// For maximum compatibility, we'll use a different approach:
// Read the source, strip TypeScript syntax, and eval.

import { createRequire } from 'module';

async function loadRoadmap(slug) {
  const filePath = resolve(root, `src/config/roadmaps/${slug}.ts`);
  let source = readFileSync(filePath, 'utf-8');

  // Strip TypeScript-specific syntax
  source = source.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
  source = source.replace(/:\s*Roadmap/g, '');
  source = source.replace(/export\s+const\s+/g, 'const ');

  // Extract the variable name and object
  const varMatch = source.match(/const\s+(\w+)\s*=\s*/);
  if (!varMatch) throw new Error(`Cannot parse ${slug}`);

  // Eval the source to get the object
  const fn = new Function(`${source}\nreturn ${varMatch[1]};`);
  return fn();
}

async function checkExists(slug) {
  const q = query(collection(db, 'roadmaps'), where('slug', '==', slug));
  const snap = await getDocs(q);
  return !snap.empty;
}

async function migrateRoadmap(slug, order) {
  if (await checkExists(slug)) {
    console.log(`  ⏭️  "${slug}" already exists, skipping`);
    return;
  }

  const roadmap = await loadRoadmap(slug);

  // Transform from hardcoded format to CMS format
  const cmsData = {
    slug: roadmap.slug,
    title: roadmap.title,
    shortDescription: roadmap.description.slice(0, 200),
    description: roadmap.description,
    category: guessCategory(slug),
    difficulty: guessDifficulty(slug),
    estimatedDuration: roadmap.totalTime || '3-6 months',
    status: 'published',
    featured: order < 5,
    icon: roadmap.icon || 'Map',
    accent: roadmap.accent || '#C7FF3D',
    targetAudience: [],
    learningOutcomes: [],
    prerequisites: [],
    tags: roadmap.languages || [],
    order,
    variants: roadmap.variants || [],
    relationships: (roadmap.relatedRoadmaps || []).map(r => ({
      targetId: r.slug,
      type: mapRelationType(r.relation),
      description: r.description,
    })),
    sections: roadmap.stages.map((stage, idx) => ({
      id: stage.id,
      title: stage.title,
      description: stage.description,
      timeEstimate: stage.timeEstimate,
      color: stage.color,
      order: idx,
      topics: stage.topics.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        timeEstimate: t.timeEstimate,
        whatToLearn: t.whatToLearn,
        resources: t.resources,
        project: t.project,
        ...(t.variant ? { variant: t.variant } : {}),
      })),
      projectIds: [],
    })),
    seo: {},
    createdBy: 'migration',
    updatedBy: 'migration',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'roadmaps'), cmsData);
  console.log(`  ✅ "${roadmap.title}" → ${ref.id}`);
}

function guessCategory(slug) {
  if (['frontend-developer', 'backend-developer', 'full-stack-developer'].includes(slug)) return 'web-development';
  if (slug === 'mobile-developer') return 'mobile-development';
  if (slug === 'ai-engineer') return 'data-science';
  if (slug === 'devops-engineer') return 'devops';
  if (slug === 'cybersecurity') return 'cybersecurity';
  if (['placement-preparation', 'object-oriented-programming'].includes(slug)) return 'computer-science';
  return 'web-development';
}

function guessDifficulty(slug) {
  if (['frontend-developer', 'object-oriented-programming'].includes(slug)) return 'beginner';
  if (['backend-developer', 'mobile-developer', 'placement-preparation'].includes(slug)) return 'intermediate';
  return 'advanced';
}

function mapRelationType(relation) {
  const map = {
    'prerequisite': 'prerequisite',
    'builds-on': 'next_step',
    'shared-topics': 'related',
    'alternative': 'related',
  };
  return map[relation] || 'related';
}

async function main() {
  console.log('🚀 Migrating roadmaps to Firestore...\n');

  for (let i = 0; i < ROADMAPS.length; i++) {
    try {
      await migrateRoadmap(ROADMAPS[i], i);
    } catch (err) {
      console.error(`  ❌ Failed to migrate "${ROADMAPS[i]}":`, err.message);
    }
  }

  console.log('\n✨ Migration complete!');
  process.exit(0);
}

main();
