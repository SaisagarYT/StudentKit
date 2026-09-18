'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Flame, Zap, Globe, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { StreakData } from '@/lib/user-progress';
import type { XpState } from '@/lib/xp';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface DashboardHeaderProps {
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  streak: StreakData;
  xpState: XpState;
}

export function DashboardHeader({ user, streak, xpState }: DashboardHeaderProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Learner';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-6 border-b border-[var(--border-soft)]"
    >
      {/* Left: User Avatar & Greeting */}
      <div className="flex items-center gap-4">
        {user?.photoURL ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-13 h-13 rounded-full object-cover ring-2 ring-[var(--accent-primary)]/40 shrink-0"
          />
        ) : (
          <div className="w-13 h-13 rounded-full bg-[var(--accent-dark)] text-[var(--text-inverse)] font-bold text-lg flex items-center justify-center ring-2 ring-[var(--border-strong)] shrink-0">
            {displayName[0].toUpperCase()}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
              {greeting}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {displayName}
          </h1>
        </div>
      </div>

      {/* Right: Gamification Badges & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Streak Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-sm">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Flame className="w-4 h-4 text-[var(--accent-dark)] fill-[var(--accent-dark)]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
                <AnimatedCounter value={streak.current} suffix="-day" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded-sm">
                streak
              </span>
            </div>
          </div>
        </div>

        {/* Level & XP Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-sm">
          <Zap className="w-4 h-4 text-[var(--accent-dark)] fill-current" />
          <div>
            <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
              <AnimatedCounter value={xpState.totalXp} suffix=" XP" />
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase ml-1.5 px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
              {xpState.level.title}
            </span>
          </div>
        </div>

        {/* Public Dev Card Link */}
        <Link
          href="/profile/card"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-md transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span>Dev Card</span>
        </Link>

        {/* Landing Page Link */}
        <Link
          href="/?view=landing"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-md transition-all shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          <span>Landing</span>
        </Link>
      </div>
    </motion.div>
  );
}

