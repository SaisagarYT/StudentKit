import { Suspense } from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = {
  title: `Sign In | ${siteConfig.name}`,
  description: 'Sign in to sync your progress across devices.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
