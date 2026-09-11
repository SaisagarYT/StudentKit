import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
configDotenv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Also try loading .env.local if present
const envLocalPath = resolve(root, '.env.local');
if (existsSync(envLocalPath)) {
  const envContent = readFileSync(envLocalPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studentkit-b8418';

let db;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({ credential: cert(serviceAccount), projectId });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({ projectId });
  } else {
    // Attempt standard initialization with projectId
    initializeApp({ projectId });
  }
  db = getFirestore();
} catch (e) {
  console.log('⚠️ Could not initialize Firebase Admin SDK:', e.message);
  console.log('To wipe your remote Firestore database:');
  console.log('1. Ensure FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS is set in .env.local');
  console.log('2. Run: node scripts/wipe-database.mjs');
  process.exit(0);
}

const COLLECTIONS_TO_WIPE = [
  'roadmaps',
  'projects',
  'resources',
  'dsa-problems',
  'leaderboard',
  'analytics',
  'notes',
  'comments',
];

async function deleteCollection(collectionPath, batchSize = 50) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((res, rej) => {
    deleteQueryBatch(query, res, rej);
  });
}

async function deleteQueryBatch(query, resolve, reject) {
  try {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      resolve();
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
      deleteQueryBatch(query, resolve, reject);
    });
  } catch (err) {
    reject(err);
  }
}

async function wipeAll() {
  console.log(`\n🧹 Starting database wipe for project: "${projectId}"...\n`);

  for (const col of COLLECTIONS_TO_WIPE) {
    try {
      process.stdout.write(`Deleting collection "${col}"... `);
      await deleteCollection(col);
      console.log('✅ Wiped');
    } catch (err) {
      console.log(`⚠️ Skipped or not found (${err.message})`);
    }
  }

  console.log('\n✨ Database wipe completed! All target collections are now empty.\n');
  process.exit(0);
}

wipeAll();

