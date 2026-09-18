'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Code, Flame, Calendar, Share2, Check, Copy, TrendingUp
} from 'lucide-react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import { getStreak, type StreakData } from '@/lib/user-progress';

const DSA_STORAGE_KEY = 'sk-dsa-progress';
const CS_STORAGE_KEY = 'sk-cs-progress';

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface CardStats {
  dsaSolved: number;
  csSolved: number;
  streak: StreakData;
  xp: number;
  level: string;
  totalActiveDays: number;
}

function getLevel(dsaSolved: number): string {
  if (dsaSolved >= 100) return 'Master';
  if (dsaSolved >= 50) return 'Expert';
  if (dsaSolved >= 25) return 'Intermediate';
  if (dsaSolved >= 5) return 'Beginner';
  return 'Newbie';
}

const STAT_CARDS = [
  { key: 'dsaSolved',      label: 'Problems',    icon: Code,       suffix: '' },
  { key: 'streak.longest', label: 'Best Streak', icon: Flame,      suffix: 'd' },
  { key: 'totalActiveDays',label: 'Active Days', icon: Calendar,   suffix: '' },
  { key: 'xp',             label: 'Total XP',    icon: TrendingUp, suffix: '' },
];

export function PublicProfileCard() {
  const { user } = useUserAuth();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<CardStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const streak = getStreak();
    const dsaProgress: Record<string, boolean> = JSON.parse(localStorage.getItem(DSA_STORAGE_KEY) || '{}');
    const csProgress: Record<string, boolean> = JSON.parse(localStorage.getItem(CS_STORAGE_KEY) || '{}');
    const dsaSolved = Object.values(dsaProgress).filter(Boolean).length;
    const csSolved = Object.values(csProgress).filter(Boolean).length;

    let roadmapTopics = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('roadmap-progress-')) {
        const progress: Record<string, boolean> = JSON.parse(localStorage.getItem(key) || '{}');
        roadmapTopics += Object.values(progress).filter(Boolean).length;
      }
    }

    const xp = dsaSolved * 10 + csSolved * 5 + streak.totalActiveDays * 3 + roadmapTopics * 8;
    setStats({ dsaSolved, csSolved, streak, xp, level: getLevel(dsaSolved), totalActiveDays: streak.totalActiveDays });
  }, []);

  const shareText = useCallback(() => {
    if (!stats || !user) return '';
    return `Check out my learning stats on StudentKit!\n\n${stats.dsaSolved} DSA problems solved\n${stats.streak.longest} day best streak\n${stats.xp} XP (${stats.level})\n\nTrack your progress at studentkit.app`;
  }, [stats, user]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareText]);

  if (!mounted || !stats) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.displayName || 'Learner';

  // Resolve stat values
  const statValues: Record<string, number> = {
    dsaSolved: stats.dsaSolved,
    'streak.longest': stats.streak.longest,
    totalActiveDays: stats.totalActiveDays,
    xp: stats.xp,
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container-main max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8"
        >
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">Your Dev Card</h1>
          <p className="text-sm text-[var(--text-subtle)]">Share your learning progress with the world</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-sm border border-[var(--border-soft)] overflow-hidden shadow-[var(--shadow-lg)] mb-6"
        >
          {/* Accent top bar */}
          <div className="h-1 bg-[var(--accent-dark)]" />

          <div className="p-6 bg-[var(--bg-surface)]">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-6">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-sm object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-14 h-14 rounded-sm bg-[var(--accent-dark)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[var(--text-inverse)]">
                    {displayName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{displayName}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-[var(--accent-dark)] text-[var(--text-inverse)]">
                    {stats.level}
                  </span>
                  <span className="text-xs text-[var(--text-subtle)]">{stats.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {STAT_CARDS.map(({ key, label, icon: Icon, suffix }) => (
                <div key={key} className="p-3 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                    <span className="text-[10px] text-[var(--text-subtle)] uppercase font-medium">{label}</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                    {statValues[key].toLocaleString()}
                    {suffix && <span className="text-sm text-[var(--text-subtle)]">{suffix}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-soft)]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-[var(--accent-dark)] flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[var(--text-inverse)]">SK</span>
                </div>
                <span className="text-[11px] font-medium text-[var(--text-subtle)]">studentkit.app</span>
              </div>
              <span className="text-[10px] text-[var(--text-subtle)]">
                {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Share actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5"
        >
          <p className="text-xs font-bold text-[var(--text-subtle)] uppercase tracking-wider mb-3">Share your card</p>
          <div className="grid grid-cols-3 gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {/* Twitter blue works in both modes — it's a brand color, not arbitrary */}
              <TwitterIcon className="w-5 h-5 text-[#1DA1F2]" />
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">X / Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://studentkit.app')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {/* LinkedIn blue is a brand color */}
              <LinkedInIcon className="w-5 h-5 text-[#0A66C2]" />
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">LinkedIn</span>
            </a>
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {copied
                ? <Check className="w-5 h-5 text-[var(--color-success)]" />
                : <Copy className="w-5 h-5 text-[var(--text-secondary)]" />
              }
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={() => {
                navigator.share({
                  title: `${displayName}'s Dev Card — StudentKit`,
                  text: shareText(),
                  url: 'https://studentkit.app/leaderboard',
                }).catch(() => {});
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
              Share via device
            </button>
          )}
        </motion.div>

        {/* Not signed in */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="mt-6 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-center"
          >
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              Sign in to personalize your card with your name and photo.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
            >
              Sign in
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
