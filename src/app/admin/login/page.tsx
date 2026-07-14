'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  if (user) {
    router.replace('/admin');
    return null;
  }

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/admin');
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">StudentKit Admin</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Sign in to manage content</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p className="mt-6 text-center text-[11px] text-[var(--text-subtle)]">
          Admin access only. Contact the site owner for access.
        </p>
      </div>
    </div>
  );
}
