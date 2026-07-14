'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { AdminSidebar } from './admin-sidebar';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, configError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !configError && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, configError, router]);

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-6">
        <div className="max-w-md w-full rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-8 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Firebase Not Configured</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Add your Firebase credentials to <code className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-xs">.env.local</code> and restart the dev server.
          </p>
          <div className="text-left bg-[var(--bg-subtle)] rounded-lg p-4 text-xs font-mono text-[var(--text-secondary)] space-y-1">
            <p>NEXT_PUBLIC_FIREBASE_API_KEY=...</p>
            <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...</p>
            <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=...</p>
            <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...</p>
            <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...</p>
            <p>NEXT_PUBLIC_FIREBASE_APP_ID=...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <AdminSidebar />
      <main className="pl-60 min-h-screen flex justify-center">
        <div className="w-full max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
