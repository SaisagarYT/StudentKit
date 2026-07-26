'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Share2, X } from 'lucide-react';
import { type AchievementData } from './achievement-share-modal';

const MILESTONES_SEEN_KEY = 'sk-milestones-seen';

export interface MilestoneConfig {
  id: string;
  title: string;
  description: string;
  check: (stats: MilestoneStats) => boolean;
  stat: (stats: MilestoneStats) => string;
  statLabel: string;
  color: string;
}

export interface MilestoneStats {
  dsaSolved: number;
  csSolved: number;
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  roadmapTopics: number;
  badgesEarned: number;
}

export const MILESTONES: MilestoneConfig[] = [
  { id: 'dsa-10', title: 'Getting Serious', description: 'Solved 10 DSA problems', check: (s) => s.dsaSolved >= 10, stat: (s) => String(s.dsaSolved), statLabel: 'problems solved', color: '#C7FF3D' },
  { id: 'dsa-25', title: 'Quarter Century', description: 'Solved 25 DSA problems', check: (s) => s.dsaSolved >= 25, stat: (s) => String(s.dsaSolved), statLabel: 'problems solved', color: '#C7FF3D' },
  { id: 'dsa-50', title: 'Half Century', description: 'Solved 50 DSA problems', check: (s) => s.dsaSolved >= 50, stat: (s) => String(s.dsaSolved), statLabel: 'problems solved', color: '#FFD700' },
  { id: 'dsa-100', title: 'Centurion', description: 'Solved 100 DSA problems', check: (s) => s.dsaSolved >= 100, stat: (s) => String(s.dsaSolved), statLabel: 'problems solved', color: '#FFD700' },
  { id: 'streak-3', title: 'Consistent', description: 'Maintained a 3-day streak', check: (s) => s.longestStreak >= 3, stat: (s) => `${s.longestStreak}`, statLabel: 'day streak', color: '#FF6B35' },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintained a 7-day streak', check: (s) => s.longestStreak >= 7, stat: (s) => `${s.longestStreak}`, statLabel: 'day streak', color: '#FF6B35' },
  { id: 'streak-14', title: 'Fortnight Focus', description: 'Maintained a 14-day streak', check: (s) => s.longestStreak >= 14, stat: (s) => `${s.longestStreak}`, statLabel: 'day streak', color: '#FF6B35' },
  { id: 'streak-30', title: 'Monthly Master', description: '30-day streak achieved', check: (s) => s.longestStreak >= 30, stat: (s) => `${s.longestStreak}`, statLabel: 'day streak', color: '#FF4500' },
  { id: 'active-7', title: 'First Week', description: '7 total active days', check: (s) => s.totalActiveDays >= 7, stat: (s) => String(s.totalActiveDays), statLabel: 'active days', color: '#8B5CF6' },
  { id: 'active-30', title: 'Monthly Learner', description: '30 total active days', check: (s) => s.totalActiveDays >= 30, stat: (s) => String(s.totalActiveDays), statLabel: 'active days', color: '#8B5CF6' },
  { id: 'cs-5', title: 'CS Curious', description: 'Completed 5 CS topics', check: (s) => s.csSolved >= 5, stat: (s) => String(s.csSolved), statLabel: 'topics completed', color: '#06B6D4' },
  { id: 'cs-15', title: 'CS Scholar', description: 'Completed 15 CS topics', check: (s) => s.csSolved >= 15, stat: (s) => String(s.csSolved), statLabel: 'topics completed', color: '#06B6D4' },
  { id: 'roadmap-10', title: 'Path Walker', description: 'Completed 10 roadmap topics', check: (s) => s.roadmapTopics >= 10, stat: (s) => String(s.roadmapTopics), statLabel: 'roadmap topics', color: '#10B981' },
  { id: 'roadmap-25', title: 'Pathfinder', description: 'Completed 25 roadmap topics', check: (s) => s.roadmapTopics >= 25, stat: (s) => String(s.roadmapTopics), statLabel: 'roadmap topics', color: '#10B981' },
];

function getSeenMilestones(): Set<string> {
  try {
    const raw = localStorage.getItem(MILESTONES_SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markMilestoneSeen(id: string) {
  const seen = getSeenMilestones();
  seen.add(id);
  localStorage.setItem(MILESTONES_SEEN_KEY, JSON.stringify([...seen]));
}

export function checkNewMilestones(stats: MilestoneStats): MilestoneConfig | null {
  const seen = getSeenMilestones();
  for (const m of MILESTONES) {
    if (!seen.has(m.id) && m.check(stats)) {
      return m;
    }
  }
  return null;
}

interface MilestoneToastProps {
  milestone: MilestoneConfig;
  stats: MilestoneStats;
  onShare: (achievement: AchievementData) => void;
  onDismiss: () => void;
}

export function MilestoneToast({ milestone, stats, onShare, onDismiss }: MilestoneToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    markMilestoneSeen(milestone.id);
  }, [milestone.id]);

  const handleShare = useCallback(() => {
    onShare({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      stat: milestone.stat(stats),
      statLabel: milestone.statLabel,
      icon: <Trophy className="w-6 h-6" style={{ color: milestone.color }} />,
      color: milestone.color,
    });
  }, [milestone, stats, onShare]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xl max-w-sm">
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
          style={{ background: `${milestone.color}20` }}
        >
          <Trophy className="w-5 h-5" style={{ color: milestone.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[var(--text-primary)]">{milestone.title}</p>
          <p className="text-[11px] text-[var(--text-subtle)]">{milestone.description}</p>
        </div>

        <button
          onClick={handleShare}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-[var(--accent-dark)] text-[var(--accent-primary)] text-[10px] font-semibold hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-3 h-3" />
          Share
        </button>

        <button
          onClick={onDismiss}
          className="shrink-0 w-6 h-6 rounded-sm flex items-center justify-center text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
