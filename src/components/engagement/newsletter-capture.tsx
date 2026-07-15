'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';

const DISMISSED_KEY = 'sk-newsletter-dismissed';

export function NewsletterCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  });

  if (dismissed || status === 'success') {
    if (status === 'success') {
      return (
        <section className="container-main section-spacing">
          <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--accent-primary)]/20 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-[var(--accent-dark)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">You're subscribed!</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">We'll notify you when new roadmaps and tools drop.</p>
          </div>
        </section>
      );
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setStatus('loading');

    try {
      if (isFirebaseConfigured) {
        const ref = doc(getFirebaseDb(), 'subscribers', email.toLowerCase().trim());
        await setDoc(ref, {
          email: email.toLowerCase().trim(),
          subscribedAt: serverTimestamp(),
          source: 'website-footer',
        }, { merge: true });
      }
      setStatus('success');
      localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <section className="container-main py-16">
      <div className="relative overflow-hidden max-w-3xl mx-auto rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-8 sm:p-10">
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-5">
            <Mail className="w-6 h-6 text-[var(--accent-dark)]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Stay ahead of the curve
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Get notified when we add new roadmaps, tools, and projects. No spam — just curated content for students.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {status === 'error' && (
            <p className="mt-3 text-xs text-red-500">Something went wrong. Please try again.</p>
          )}

          <p className="mt-4 text-[10px] text-[var(--text-subtle)]">
            Free forever. Unsubscribe anytime.
          </p>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-college)]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </section>
  );
}
