'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { isBookmarked, addBookmark, removeBookmark } from '@/lib/user-progress';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  type: 'tool' | 'roadmap' | 'project';
  slug: string;
  title: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function BookmarkButton({ type, slug, title, className, size = 'md' }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(type, slug));
  }, [type, slug]);

  function toggle() {
    if (saved) {
      removeBookmark(type, slug);
      setSaved(false);
    } else {
      addBookmark({ type, slug, title });
      setSaved(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      className={cn(
        padding,
        'rounded-lg transition-all duration-200',
        saved
          ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-dark)] hover:bg-[var(--accent-primary)]/20'
          : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]',
        animate && 'scale-125',
        className
      )}
      title={saved ? 'Remove bookmark' : 'Bookmark'}
      aria-label={saved ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
    >
      <Bookmark
        className={cn(iconSize, saved && 'fill-current')}
      />
    </button>
  );
}
