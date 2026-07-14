'use client';

import { useState } from 'react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase/client';
import { useAuth } from '@/lib/firebase/auth';
import { roadmaps as hardcodedRoadmaps } from '@/config/roadmaps';
import { Loader2, Upload, CheckCircle2, XCircle } from 'lucide-react';

function guessCategory(slug: string) {
  if (['frontend-developer', 'backend-developer', 'full-stack-developer'].includes(slug)) return 'web-development';
  if (slug === 'mobile-developer') return 'mobile-development';
  if (slug === 'ai-engineer') return 'data-science';
  if (slug === 'devops-engineer') return 'devops';
  if (slug === 'cybersecurity') return 'cybersecurity';
  return 'computer-science';
}

function guessDifficulty(slug: string) {
  if (['frontend-developer', 'object-oriented-programming'].includes(slug)) return 'beginner';
  if (['backend-developer', 'mobile-developer', 'placement-preparation'].includes(slug)) return 'intermediate';
  return 'advanced';
}

export function MigrateRoadmaps() {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ slug: string; status: 'ok' | 'skip' | 'fail'; msg: string }[]>([]);

  async function handleMigrate() {
    if (!user) return;
    setRunning(true);
    setResults([]);
    const db = getFirebaseDb();
    const newResults: typeof results = [];

    for (let i = 0; i < hardcodedRoadmaps.length; i++) {
      const roadmap = hardcodedRoadmaps[i];
      try {
        // Check if already exists
        const q = query(collection(db, 'roadmaps'), where('slug', '==', roadmap.slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          newResults.push({ slug: roadmap.slug, status: 'skip', msg: 'Already exists' });
          setResults([...newResults]);
          continue;
        }

        const cmsData = {
          slug: roadmap.slug,
          title: roadmap.title,
          shortDescription: roadmap.description.slice(0, 200),
          description: roadmap.description,
          category: guessCategory(roadmap.slug),
          difficulty: guessDifficulty(roadmap.slug),
          estimatedDuration: roadmap.totalTime || '3-6 months',
          status: 'published',
          featured: i < 5,
          icon: roadmap.icon || 'Map',
          accent: roadmap.accent || '#C7FF3D',
          targetAudience: [],
          learningOutcomes: [],
          prerequisites: [],
          tags: roadmap.languages || [],
          order: i,
          variants: roadmap.variants || [],
          relationships: (roadmap.relatedRoadmaps || []).map((r) => ({
            targetId: r.slug,
            type: r.relation === 'builds-on' ? 'next_step' : 'related',
            description: r.description,
          })),
          sections: roadmap.stages.map((stage, idx) => ({
            id: stage.id,
            title: stage.title,
            description: stage.description,
            timeEstimate: stage.timeEstimate,
            color: stage.color,
            order: idx,
            topics: stage.topics.map((t) => ({
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
          createdBy: user.uid,
          updatedBy: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          publishedAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'roadmaps'), cmsData);
        newResults.push({ slug: roadmap.slug, status: 'ok', msg: 'Migrated' });
      } catch (e: unknown) {
        newResults.push({ slug: roadmap.slug, status: 'fail', msg: e instanceof Error ? e.message : 'Unknown error' });
      }
      setResults([...newResults]);
    }

    setRunning(false);
  }

  const doneCount = results.filter((r) => r.status === 'ok').length;
  const skipCount = results.filter((r) => r.status === 'skip').length;

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Migrate Hardcoded Roadmaps</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Import the {hardcodedRoadmaps.length} existing roadmaps into Firestore CMS
          </p>
        </div>
        <button
          onClick={handleMigrate}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {running ? 'Migrating...' : 'Run Migration'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {results.map((r) => (
            <div key={r.slug} className="flex items-center gap-2 text-xs">
              {r.status === 'ok' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
              {r.status === 'skip' && <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
              {r.status === 'fail' && <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              <span className="font-medium text-[var(--text-primary)]">{r.slug}</span>
              <span className="text-[var(--text-subtle)]">— {r.msg}</span>
            </div>
          ))}
          {!running && (
            <p className="mt-3 text-xs text-[var(--text-subtle)]">
              Done: {doneCount} migrated, {skipCount} skipped
            </p>
          )}
        </div>
      )}
    </div>
  );
}
