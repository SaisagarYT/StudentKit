import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = {
  title: `Sign In | ${siteConfig.name}`,
  description: 'Sign in to sync your progress across devices.',
};

export default function LoginPage() {
  return <LoginForm />;
}
