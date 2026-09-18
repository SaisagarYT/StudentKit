'use client';

import { useState } from 'react';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, type Firestore } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase/client';
import { useAuth } from '@/lib/firebase/auth';
import { roadmaps as hardcodedRoadmaps } from '@/config/roadmaps';
import { curatedProjects as hardcodedProjects } from '@/config/projects';
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, Database, Map, FolderOpen } from 'lucide-react';

interface SyncResult {
  type: 'roadmap' | 'project';
  slug: string;
  title: string;
  status: 'synced' | 'exists' | 'error';
  message: string;
}

interface PlatformSyncProps {
  onSyncComplete?: () => void;
}

function guessCategory(slug: string) {
  if (['frontend-developer', 'backend-developer', 'full-stack-developer'].includes(slug)) return 'web-development';
  if (slug === 'mobile-developer') return 'mobile-development';
  if (slug === 'ai-engineer') return 'data-science';
  if (slug === 'devops-engineer') return 'devops';
  if (slug === 'cybersecurity') return 'cybersecurity';
  return 'computer-science';
}

function guessDifficulty(slug: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (['frontend-developer', 'object-oriented-programming'].includes(slug)) return 'beginner';
  if (['backend-developer', 'mobile-developer', 'placement-preparation'].includes(slug)) return 'intermediate';
  return 'advanced';
}

export function PlatformSync({ onSyncComplete }: PlatformSyncProps) {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [results, setResults] = useState<SyncResult[]>([]);
  const [overwriteExisting, setOverwriteExisting] = useState(false);

  async function syncRoadmaps(db: Firestore, uid: string): Promise<SyncResult[]> {
    const list: SyncResult[] = [];
    for (let i = 0; i < hardcodedRoadmaps.length; i++) {
      const rm = hardcodedRoadmaps[i];
      setProgressText(`Syncing roadmap (${i + 1}/${hardcodedRoadmaps.length}): ${rm.title}...`);
      try {
        const q = query(collection(db, 'roadmaps'), where('slug', '==', rm.slug));
        const snap = await getDocs(q);

        const data = {
          slug: rm.slug,
          title: rm.title,
          shortDescription: rm.description.slice(0, 200),
          description: rm.description,
          category: guessCategory(rm.slug),
          difficulty: guessDifficulty(rm.slug),
          estimatedDuration: rm.totalTime || '3-6 months',
          status: 'published',
          featured: i < 5,
          icon: rm.icon || 'Map',
          accent: rm.accent || '#C7FF3D',
          targetAudience: [],
          learningOutcomes: [],
          prerequisites: [],
          tags: rm.languages || [],
          order: i,
          variants: rm.variants || [],
          relationships: (rm.relatedRoadmaps || []).map((r) => ({
            targetId: r.slug,
            type: r.relation === 'builds-on' ? 'next_step' : 'related',
            description: r.description,
          })),
          sections: rm.stages.map((stage, idx) => ({
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
          updatedBy: uid,
          updatedAt: serverTimestamp(),
        };

        if (!snap.empty) {
          if (overwriteExisting) {
            await updateDoc(doc(db, 'roadmaps', snap.docs[0].id), data);
            list.push({ type: 'roadmap', slug: rm.slug, title: rm.title, status: 'synced', message: 'Updated existing record' });
          } else {
            list.push({ type: 'roadmap', slug: rm.slug, title: rm.title, status: 'exists', message: 'Already exists in Firestore' });
          }
        } else {
          await addDoc(collection(db, 'roadmaps'), {
            ...data,
            createdBy: uid,
            createdAt: serverTimestamp(),
            publishedAt: serverTimestamp(),
          });
          list.push({ type: 'roadmap', slug: rm.slug, title: rm.title, status: 'synced', message: 'Created in Firestore' });
        }
      } catch (err: unknown) {
        list.push({
          type: 'roadmap',
          slug: rm.slug,
          title: rm.title,
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to sync',
        });
      }
    }
    return list;
  }

  async function syncProjects(db: Firestore, uid: string): Promise<SyncResult[]> {
    const list: SyncResult[] = [];
    for (let i = 0; i < hardcodedProjects.length; i++) {
      const p = hardcodedProjects[i];
      setProgressText(`Syncing project (${i + 1}/${hardcodedProjects.length}): ${p.title}...`);
      try {
        const q = query(collection(db, 'projects'), where('slug', '==', p.slug));
        const snap = await getDocs(q);

        const data = {
          slug: p.slug,
          title: p.title,
          shortDescription: p.shortDescription || p.description.slice(0, 180),
          description: p.description,
          category: p.category,
          difficulty: p.difficulty,
          estimatedDuration: p.estimatedDuration,
          projectType: p.projectType,
          experienceLevel: p.difficulty === 'beginner' ? 'Beginner' : p.difficulty === 'expert' ? 'Advanced' : 'Intermediate',
          technologies: p.technologies || [],
          skills: p.skills || [],
          learningOutcomes: [],
          requirements: [],
          status: 'published',
          featured: p.featured || false,
          architecture: p.architecture || '',
          folderStructure: p.folderStructure || '',
          relatedRoadmapIds: p.relatedRoadmapIds || [],
          prerequisiteRoadmapIds: [],
          relatedProjectIds: [],
          features: p.features || [],
          milestones: (p.milestones || []).map((m, idx) => ({
            title: m.title,
            description: m.description,
            order: idx,
            tasks: m.tasks || [],
            objectives: [],
            estimatedDuration: '',
          })),
          phases: (p.phases || []).map((ph, idx) => ({
            id: ph.id || `phase-${idx + 1}`,
            phaseNumber: ph.phaseNumber || idx + 1,
            title: ph.title,
            summary: ph.summary || '',
            estimatedDuration: ph.estimatedDuration || '25 min read',
            content: ph.content || '',
            objectives: ph.objectives || [],
            checkpointTasks: ph.checkpointTasks || [],
            expectedOutput: ph.expectedOutput || '',
            githubBranchUrl: ph.githubBranchUrl || '',
          })),
          extensionIdeas: [],
          tags: p.technologies || [],
          seo: {},
          updatedBy: uid,
          updatedAt: serverTimestamp(),
        };

        if (!snap.empty) {
          if (overwriteExisting) {
            await updateDoc(doc(db, 'projects', snap.docs[0].id), data);
            list.push({ type: 'project', slug: p.slug, title: p.title, status: 'synced', message: 'Updated existing record with phases' });
          } else {
            list.push({ type: 'project', slug: p.slug, title: p.title, status: 'exists', message: 'Already exists in Firestore' });
          }
        } else {
          await addDoc(collection(db, 'projects'), {
            ...data,
            createdBy: uid,
            createdAt: serverTimestamp(),
            publishedAt: serverTimestamp(),
          });
          list.push({ type: 'project', slug: p.slug, title: p.title, status: 'synced', message: 'Created in Firestore' });
        }
      } catch (err: unknown) {
        list.push({
          type: 'project',
          slug: p.slug,
          title: p.title,
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to sync',
        });
      }
    }
    return list;
  }

  async function handleSync(scope: 'all' | 'roadmaps' | 'projects') {
    if (!user) return;
    setRunning(true);
    setResults([]);
    setProgressText('Connecting to Firestore...');

    try {
      const db = getFirebaseDb();
      let allResults: SyncResult[] = [];

      if (scope === 'all' || scope === 'roadmaps') {
        const rmResults = await syncRoadmaps(db, user.uid);
        allResults = [...allResults, ...rmResults];
        setResults([...allResults]);
      }

      if (scope === 'all' || scope === 'projects') {
        const pResults = await syncProjects(db, user.uid);
        allResults = [...allResults, ...pResults];
        setResults([...allResults]);
      }

      setProgressText('Sync complete!');
      onSyncComplete?.();
    } catch (e: unknown) {
      setProgressText(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setRunning(false);
    }
  }

  const syncedCount = results.filter((r) => r.status === 'synced').length;
  const existsCount = results.filter((r) => r.status === 'exists').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return (
    <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[var(--accent-dark)] flex items-center justify-center text-[var(--text-inverse)]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Platform Content Sync</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Seed or update Firestore from prebuilt configurations ({hardcodedRoadmaps.length} Roadmaps, {hardcodedProjects.length} Guided Projects)
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={overwriteExisting}
            onChange={(e) => setOverwriteExisting(e.target.checked)}
            className="rounded-sm border-[var(--border-strong)] text-[var(--accent-dark)] focus:ring-0"
          />
          <span>Update existing records</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <button
          type="button"
          onClick={() => handleSync('all')}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity disabled:opacity-50 shadow-xs"
        >
          {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Sync All Content
        </button>

        <button
          type="button"
          onClick={() => handleSync('roadmaps')}
          disabled={running}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors disabled:opacity-50"
        >
          <Map className="w-3.5 h-3.5 text-blue-500" />
          Sync Roadmaps ({hardcodedRoadmaps.length})
        </button>

        <button
          type="button"
          onClick={() => handleSync('projects')}
          disabled={running}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors disabled:opacity-50"
        >
          <FolderOpen className="w-3.5 h-3.5 text-purple-500" />
          Sync Projects ({hardcodedProjects.length})
        </button>
      </div>

      {/* Live Status Message */}
      {running && (
        <div className="p-3 mb-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-dark)]" />
          <span className="text-xs font-mono text-[var(--text-primary)]">{progressText}</span>
        </div>
      )}

      {/* Results Summary & Log */}
      {results.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[var(--border-soft)]">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {syncedCount} Synced
            </span>
            <span className="text-[var(--text-subtle)]">
              {existsCount} Already Existed
            </span>
            {errorCount > 0 && (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errorCount} Errors
              </span>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] p-2.5 space-y-1 font-mono text-[11px]">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1 px-2 rounded-xs hover:bg-[var(--bg-surface)]">
                <div className="flex items-center gap-2 truncate">
                  <span className="uppercase text-[9px] font-bold px-1 py-0.5 rounded-xs bg-[var(--border-soft)] text-[var(--text-subtle)]">
                    {r.type}
                  </span>
                  <span className="text-[var(--text-primary)] truncate">{r.title}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold shrink-0 ml-2 ${
                    r.status === 'synced'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : r.status === 'exists'
                      ? 'text-[var(--text-subtle)]'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {r.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

