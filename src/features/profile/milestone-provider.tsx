'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import { PROGRESS_CHANGED_EVENT } from '@/lib/firebase/user-progress-sync';
import { getStreak } from '@/lib/user-progress';
import { checkNewMilestones, MilestoneToast, type MilestoneConfig, type MilestoneStats } from './milestone-toast';
import { AchievementShareModal, type AchievementData } from './achievement-share-modal';
import { useUserAuth } from '@/lib/firebase/user-auth';

const DSA_STORAGE_KEY = 'sk-dsa-progress';
const CS_STORAGE_KEY = 'sk-cs-progress';

function getStats(): MilestoneStats {
  const streak = getStreak();
  const dsaProgress: Record<string, boolean> = JSON.parse(localStorage.getItem(DSA_STORAGE_KEY) || '{}');
  const csProgress: Record<string, boolean> = JSON.parse(localStorage.getItem(CS_STORAGE_KEY) || '{}');

  let roadmapTopics = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('roadmap-progress-')) {
      const progress: Record<string, boolean> = JSON.parse(localStorage.getItem(key) || '{}');
      roadmapTopics += Object.values(progress).filter(Boolean).length;
    }
  }

  return {
    dsaSolved: Object.values(dsaProgress).filter(Boolean).length,
    csSolved: Object.values(csProgress).filter(Boolean).length,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    totalActiveDays: streak.totalActiveDays,
    roadmapTopics,
    badgesEarned: 0,
  };
}

export function MilestoneProvider() {
  const { user } = useUserAuth();
  const [activeMilestone, setActiveMilestone] = useState<MilestoneConfig | null>(null);
  const [shareAchievement, setShareAchievement] = useState<AchievementData | null>(null);
  const [stats, setStats] = useState<MilestoneStats | null>(null);

  useEffect(() => {
    function handleProgressChange() {
      const currentStats = getStats();
      setStats(currentStats);
      const milestone = checkNewMilestones(currentStats);
      if (milestone) {
        setActiveMilestone(milestone);
      }
    }

    window.addEventListener(PROGRESS_CHANGED_EVENT, handleProgressChange);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, handleProgressChange);
  }, []);

  const handleShare = useCallback((achievement: AchievementData) => {
    setShareAchievement(achievement);
    setActiveMilestone(null);
  }, []);

  const handleDismiss = useCallback(() => {
    setActiveMilestone(null);
  }, []);

  return (
    <>
      {activeMilestone && stats && (
        <MilestoneToast
          milestone={activeMilestone}
          stats={stats}
          onShare={handleShare}
          onDismiss={handleDismiss}
        />
      )}
      {shareAchievement && (
        <AchievementShareModal
          achievement={shareAchievement}
          userName={user?.displayName || ''}
          onClose={() => setShareAchievement(null)}
        />
      )}
    </>
  );
}
