'use client';

import { useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase/client';
import { useAuth } from '@/lib/firebase/auth';
import { Trash2, AlertTriangle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const COLLECTIONS_TO_PURGE = [
  'roadmaps',
  'projects',
  'resources',
  'dsa-problems',
  'leaderboard',
  'analytics',
  'subscribers',
  'users',
  'notes',
  'comments'
];

export function WipeDatabaseButton() {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  if (!user) return null;

  async function handleWipe() {
    const confirm1 = window.confirm(
      '⚠️ DANGER: This will permanently delete ALL documents from Firestore (roadmaps, projects, resources, dsa-problems, leaderboard, analytics).\n\nYour admin credentials in the "admins" collection will be strictly preserved.\n\nAre you sure you want to proceed?'
    );
    if (!confirm1) return;

    setRunning(true);
    setDone(false);
    setLog(['Starting database purge... (Preserving "admins")']);

    const db = getFirebaseDb();
    let totalDeleted = 0;

    for (const colName of COLLECTIONS_TO_PURGE) {
      try {
        setLog((prev) => [...prev, `Scanning collection "${colName}"...`]);
        const snap = await getDocs(collection(db, colName));
        let count = 0;
        let failCount = 0;

        for (const docSnapshot of snap.docs) {
          try {
            // If the document is in roadmaps or projects, Firestore security rules may forbid deleting 'published' docs.
            // Converting to 'draft' first allows deletion to succeed.
            if (colName === 'roadmaps' || colName === 'projects') {
              try {
                await updateDoc(doc(db, colName, docSnapshot.id), { status: 'draft' });
              } catch {
                // If update fails, proceed to deleteDoc anyway
              }
            }
            await deleteDoc(doc(db, colName, docSnapshot.id));
            count++;
            totalDeleted++;
          } catch (docErr: any) {
            failCount++;
            setLog((prev) => [...prev, `    ⚠️ Could not delete ${colName}/${docSnapshot.id}: ${docErr.message}`]);
          }
        }

        if (count > 0) {
          setLog((prev) => [...prev, `  ✅ Deleted ${count} document(s) from "${colName}".`]);
        } else if (failCount === 0) {
          setLog((prev) => [...prev, `  ℹ️ "${colName}" was already empty.`]);
        }
        if (failCount > 0) {
          setLog((prev) => [
            ...prev,
            `  ⚠️ ${failCount} doc(s) in "${colName}" blocked by Firestore rules. If deleting "${colName}", delete the collection directly in the Firebase Console Data tab.`
          ]);
        }
      } catch (err: any) {
        setLog((prev) => [
          ...prev,
          `  ❌ Cannot access "${colName}": ${err.message}. To wipe "${colName}", delete the collection directly in the Firebase Console Data tab.`
        ]);
      }
    }

    setLog((prev) => [
      ...prev,
      `\n🎉 Purge complete! Deleted ${totalDeleted} total documents across all collections.`,
      `🔒 "admins" collection was left untouched.`
    ]);
    setRunning(false);
    setDone(true);
  }

  return (
    <div className="p-5 rounded-sm border border-red-500/20 bg-red-500/5 mt-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">
              Danger Zone: Purge Database
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Wipe all content (roadmaps, projects, resources, DSA problems, and leaderboard) from Firestore.
            <strong className="text-[var(--text-primary)]"> Admin user permissions in the &quot;admins&quot; collection are preserved.</strong>
          </p>
        </div>

        <button
          onClick={handleWipe}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-50 shrink-0"
        >
          {running ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Purging Firestore...
            </>
          ) : done ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Database Wiped
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              Wipe Database (Except Admins)
            </>
          )}
        </button>
      </div>

      {log.length > 0 && (
        <div className="mt-4 p-3 rounded-sm bg-[var(--bg-base)] border border-[var(--border-soft)] max-h-48 overflow-y-auto font-mono text-[11px] text-[var(--text-secondary)] space-y-1">
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

