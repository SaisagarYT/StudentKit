import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { DailyChallengeClient } from '@/features/challenges/daily-challenge-client';

export const metadata: Metadata = {
  title: `Daily Challenge | ${siteConfig.name}`,
  description: 'Solve one DSA problem every day. Time yourself, use progressive hints, and build a solving streak.',
};

export default function ChallengesPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DailyChallengeClient />
    </Suspense>
  );
}
