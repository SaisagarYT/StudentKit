import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { ProfileDashboard } from '@/features/profile/profile-dashboard';

export const metadata: Metadata = {
  title: `My Profile | ${siteConfig.name}`,
  description: 'Track your learning progress, streaks, solved problems, and achievements.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileDashboard />
    </Suspense>
  );
}
