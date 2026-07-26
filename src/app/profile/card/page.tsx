import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { PublicProfileCard } from '@/features/profile/public-profile-card';

export const metadata: Metadata = {
  title: `Dev Card | ${siteConfig.name}`,
  description: 'Your shareable developer learning card. Show off your DSA progress, streaks, and XP.',
};

export default function ProfileCardPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PublicProfileCard />
    </Suspense>
  );
}
