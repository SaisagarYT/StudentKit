'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Monitor,
  Server,
  Layers,
  Brain,
  Smartphone,
  Cloud,
  Shield,
  GraduationCap,
  Sparkles,
  Check,
} from 'lucide-react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { syncProgressOnLogin } from '@/lib/firebase/user-progress-sync';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'sk-onboarding';

interface OnboardingData {
  goal: string;
  level: string;
  startedAt: string;
}

const goals = [
  {
    id: 'frontend-developer',
    label: 'Frontend Developer',
    description: 'Build beautiful, interactive web interfaces',
    icon: Monitor,
    color: '#3B82F6',
  },
  {
    id: 'backend-developer',
    label: 'Backend Developer',
    description: 'Design APIs, databases, and server systems',
    icon: Server,
    color: '#10B981',
  },
  {
    id: 'full-stack-developer',
    label: 'Full-Stack Developer',
    description: 'Master both frontend and backend',
    icon: Layers,
    color: '#8B5CF6',
  },
  {
    id: 'ai-engineer',
    label: 'AI / ML Engineer',
    description: 'Build intelligent systems and models',
    icon: Brain,
    color: '#F59E0B',
  },
  {
    id: 'mobile-developer',
    label: 'Mobile Developer',
    description: 'Create apps for iOS and Android',
    icon: Smartphone,
    color: '#EC4899',
  },
  {
    id: 'devops-engineer',
    label: 'DevOps Engineer',
    description: 'Automate infrastructure and deployment',
    icon: Cloud,
    color: '#06B6D4',
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    description: 'Protect systems and find vulnerabilities',
    icon: Shield,
    color: '#EF4444',
  },
  {
    id: 'placement-preparation',
    label: 'Placement Prep',
    description: 'Get ready for campus interviews and jobs',
    icon: GraduationCap,
    color: '#F97316',
  },
];

const levels = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: "I'm just starting out or know very little",
    detail: 'Start from the fundamentals',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'I know basics and have built small projects',
    detail: 'Skip the intro, dive deeper',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'I have experience and want to specialize',
    detail: 'Focus on advanced topics & interview prep',
  },
];

export function StartFlow() {
  const router = useRouter();
  const { user, signInWithGoogle } = useUserAuth();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: OnboardingData = JSON.parse(stored);
        if (data.goal && data.level) {
          router.replace(`/roadmaps/view?slug=${data.goal}`);
        }
      } catch {}
    }
  }, [router]);

  function saveAndProceed() {
    const data: OnboardingData = {
      goal: selectedGoal,
      level: selectedLevel,
      startedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setShowAuth(true);
  }

  function skipAuthAndGo() {
    router.push(`/roadmaps/view?slug=${selectedGoal}`);
  }

  async function handleGoogleSignIn() {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      setTimeout(async () => {
        const auth = (await import('@/lib/firebase/client')).getFirebaseAuth();
        if (auth.currentUser) {
          await syncProgressOnLogin(auth.currentUser.uid);
        }
        router.push(`/roadmaps/view?slug=${selectedGoal}`);
      }, 500);
    } catch {
      setAuthLoading(false);
    }
  }

  if (showAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-[var(--accent-dark)]/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[var(--accent-dark)]" />
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Your journey is ready!
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            Sign in to save your progress across devices and never lose your streak.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)] disabled:opacity-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Save progress with Google
            </button>

            <button
              onClick={skipAuthAndGo}
              className="w-full px-4 py-3.5 rounded-sm text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Skip for now — start learning
              <ArrowRight className="inline-block ml-1.5 w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-6 text-xs text-[var(--text-subtle)]">
            You can always sign in later from your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-sm transition-all duration-300',
                i === step ? 'w-8 bg-[var(--accent-dark)]' : 'w-3 bg-[var(--border-soft)]',
                i < step && 'w-3 bg-[var(--accent-dark)]'
              )}
            />
          ))}
        </div>

        {/* Step 1: Choose Goal */}
        {step === 0 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                What do you want to become?
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                Choose your goal and we&apos;ll create a personalized learning path for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      'relative flex items-start gap-4 p-4 rounded-sm border text-left transition-all duration-200',
                      isSelected
                        ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)]/5 shadow-sm'
                        : 'border-[var(--border-soft)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                    )}
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-sm shrink-0"
                      style={{ backgroundColor: `${goal.color}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: goal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {goal.label}
                      </p>
                      <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-sm bg-[var(--accent-dark)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[var(--text-inverse)]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!selectedGoal}
                className="flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-center mt-6 text-xs text-[var(--text-subtle)]">
              <Link href="/roadmaps" className="hover:text-[var(--text-secondary)] transition-colors underline underline-offset-2">
                Or browse all learning paths
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Choose Level */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                What&apos;s your experience level?
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                We&apos;ll tailor your starting point so you don&apos;t waste time on what you already know.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {levels.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedLevel(level.id)}
                    className={cn(
                      'relative flex items-center gap-4 w-full p-5 rounded-sm border text-left transition-all duration-200',
                      isSelected
                        ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)]/5 shadow-sm'
                        : 'border-[var(--border-soft)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {level.label}
                      </p>
                      <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                        {level.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded-sm shrink-0 border border-[var(--border-soft)]">
                      {level.detail}
                    </span>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-sm bg-[var(--accent-dark)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[var(--text-inverse)]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex items-center gap-1.5 px-5 py-3 rounded-sm text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={saveAndProceed}
                disabled={!selectedLevel}
                className="flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                Start My Journey
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
