'use client';

import { useState, useCallback } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';

interface ShareProgressProps {
  roadmapTitle: string;
  roadmapSlug: string;
  completedTopics: number;
  totalTopics: number;
}

export function ShareProgress({
  roadmapTitle,
  roadmapSlug,
  completedTopics,
  totalTopics,
}: ShareProgressProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const url = `https://studentkit.app/roadmaps/${roadmapSlug}`;

  const shareText = completedTopics === 0
    ? `Check out the ${roadmapTitle} Roadmap on StudentKit!`
    : percent === 100
      ? `I just completed the ${roadmapTitle} Roadmap on StudentKit! 🎉`
      : `I'm ${percent}% through the ${roadmapTitle} Roadmap on StudentKit! 🚀`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [shareText, url]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/50 hover:text-[var(--text-primary)] transition-all"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-52 p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-lg">
            <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              {completedTopics > 0 ? `Share your ${percent}% progress` : 'Share this roadmap'}
            </p>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              Post on X
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              Share on LinkedIn
            </a>
            <button
              type="button"
              onClick={() => {
                handleCopyLink();
                setShowMenu(false);
              }}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors w-full text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Link2 className="w-4 h-4 text-[var(--text-subtle)]" />
              )}
              {copied ? 'Copied!' : 'Copy link with progress'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
