import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { LeaderboardClient } from '@/features/leaderboard/leaderboard-client';

export const metadata: Metadata = {
  title: `Leaderboard | ${siteConfig.name}`,
  description: 'See top learners ranked by problems solved, streaks, and XP. Realtime updates.',
};

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LeaderboardClient />
    </Suspense>
  );
}
