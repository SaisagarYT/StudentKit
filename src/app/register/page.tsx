import { Metadata } from 'next';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your StudentKit account to sync your progress across devices.',
};

export default function RegisterPage() {
  return <LoginForm initialMode="signup" />;
}

