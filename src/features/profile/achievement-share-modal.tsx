'use client';

import { useState, useCallback } from 'react';
import { X, Link2, Check, Share2 } from 'lucide-react';
import type { ReactElement } from 'react';

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

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  icon: ReactElement;
  color: string;
}

interface AchievementShareModalProps {
  achievement: AchievementData;
  userName: string;
  onClose: () => void;
}

function buildShareText(achievement: AchievementData, userName: string): string {
  const name = userName || 'I';
  return `${name} just earned the "${achievement.title}" badge on StudentKit! ${achievement.stat} ${achievement.statLabel}. Track your learning progress at studentkit.app`;
}

function buildTwitterUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://studentkit.app/leaderboard')}`;
}

function buildLinkedInUrl(achievement: AchievementData, userName: string): string {
  const title = `${userName || 'I'} earned "${achievement.title}" on StudentKit!`;
  const summary = `${achievement.stat} ${achievement.statLabel}. Tracking learning progress and building skills with StudentKit.`;
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://studentkit.app')}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
}

export function AchievementShareModal({ achievement, userName, onClose }: AchievementShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText(achievement, userName);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-sm flex items-center justify-center text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Preview */}
        <div className="p-6 pb-0">
          <div className="rounded-sm border border-[var(--border-soft)] overflow-hidden">
            {/* Card header band */}
            <div
              className="h-2"
              style={{ background: achievement.color }}
            />

            <div className="p-6 bg-[var(--bg-background)]">
              {/* Badge icon + title */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center shrink-0"
                  style={{ background: `${achievement.color}20` }}
                >
                  {achievement.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{achievement.title}</p>
                  <p className="text-xs text-[var(--text-subtle)]">{achievement.description}</p>
                </div>
              </div>

              {/* Stat */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-[var(--text-primary)]">{achievement.stat}</span>
                <span className="text-sm text-[var(--text-secondary)]">{achievement.statLabel}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-soft)]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-sm bg-[var(--accent-primary)] flex items-center justify-center">
                    <span className="text-[8px] font-bold text-[var(--accent-dark)]">SK</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                    {userName || 'Learner'} on StudentKit
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-subtle)]">studentkit.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share actions */}
        <div className="p-6">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Share your achievement
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <a
              href={buildTwitterUrl(shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <TwitterIcon className="w-5 h-5 text-[#1DA1F2]" />
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">Twitter</span>
            </a>

            <a
              href={buildLinkedInUrl(achievement, userName)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <LinkedInIcon className="w-5 h-5 text-[#0A66C2]" />
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">LinkedIn</span>
            </a>

            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Link2 className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>

          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={() => {
                navigator.share({
                  title: `${achievement.title} — StudentKit`,
                  text: shareText,
                  url: 'https://studentkit.app/leaderboard',
                }).catch(() => {});
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[var(--accent-dark)] text-[var(--accent-primary)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
              Share via device
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
