'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { syncProgressOnLogin } from '@/lib/firebase/user-progress-sync';
import { Logo, LogoSymbol } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  initialMode?: 'login' | 'signup';
}

export function LoginForm({ initialMode = 'login' }: LoginFormProps) {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useUserAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  async function handleGoogle() {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      setTimeout(async () => {
        const auth = getFirebaseAuth();
        if (auth.currentUser) {
          await syncProgressOnLogin(auth.currentUser.uid);
        }
        router.push('/profile');
      }, 500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your email address to receive a reset link.');
        return;
      }
      setLoading(true);
      try {
        const auth = getFirebaseAuth();
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('Password reset link sent! Please check your inbox.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send reset email';
        if (msg.includes('user-not-found')) {
          setError('No account found with this email.');
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please provide your name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      setTimeout(async () => {
        const auth = getFirebaseAuth();
        if (auth.currentUser) {
          await syncProgressOnLogin(auth.currentUser.uid);
        }
        router.push('/profile');
      }, 500);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Authentication failed';
      if (
        msg.includes('user-not-found') ||
        msg.includes('wrong-password') ||
        msg.includes('invalid-credential')
      ) {
        setError('Invalid email or password.');
      } else if (msg.includes('email-already-in-use')) {
        setError('An account with this email already exists. Try signing in.');
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] h-[100dvh] flex flex-col justify-between p-4 sm:p-5 overflow-y-auto sm:overflow-hidden select-none">
      {/* Precision Technical Architectural Grid Pattern (Subtle, no heavy glow) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, #000 35%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top Header: Brand & Theme Toggle */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between shrink-0 h-9">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="w-full max-w-[390px] mx-auto my-auto shrink-0 py-2">
        <div className="rounded-xl border border-[var(--border-default)] dark:border-[#262626] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_8px_20px_rgba(0,0,0,0.3)] transition-all">
          {/* Card Anchor: Logo Mark */}
          <div className="flex justify-center mb-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center p-1.5">
              <LogoSymbol className="w-5 h-5 rounded-md" />
            </div>
          </div>

          {/* Segmented Control / Pill Switcher */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-soft)] mb-3.5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMessage('');
                }}
                className={cn(
                  'py-1 text-xs font-semibold rounded-md transition-all cursor-pointer text-center',
                  mode === 'login'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-soft)]'
                    : 'text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setSuccessMessage('');
                }}
                className={cn(
                  'py-1 text-xs font-semibold rounded-md transition-all cursor-pointer text-center',
                  mode === 'signup'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-soft)]'
                    : 'text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
                )}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-3.5">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'forgot' && 'Reset your password'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
              {mode === 'login' && 'Sign in to sync your progress, bookmarks, and streak.'}
              {mode === 'signup' && 'Join thousands of students mastering tech and engineering.'}
              {mode === 'forgot' && 'Enter your email address to receive a recovery link.'}
            </p>
          </div>

          {/* Alert / Feedback message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 p-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="flex items-start gap-2 p-2 mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {mode !== 'forgot' && (
            <>
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-primary)] transition-all duration-150 disabled:opacity-50 hover:border-[var(--border-strong)] active:scale-[0.99] cursor-pointer shadow-xs"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Clean Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-soft)]" />
                </div>
                <span className="relative bg-[var(--bg-surface)] px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)]">
                  or with email
                </span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-2.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-subtle)] pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus-visible:outline-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-subtle)] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus-visible:outline-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)] transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-subtle)] pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-9 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus-visible:outline-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-dark)] focus:border-[var(--accent-dark)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors rounded-sm cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </button>
          </form>

          {/* Switcher Footer */}
          {mode === 'forgot' && (
            <div className="mt-3 pt-2.5 border-t border-[var(--border-soft)] text-center text-xs text-[var(--text-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMessage('');
                }}
                className="font-semibold text-[var(--text-primary)] hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer: Guest Alternative & Legal */}
      <footer className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-[11px] text-[var(--text-subtle)]">
        <p>
          Want to explore without signing in?{' '}
          <Link href="/" className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline">
            Continue as Guest
          </Link>
        </p>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
