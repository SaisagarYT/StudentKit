'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, X, Map, FolderOpen, Wrench, Trash2 } from 'lucide-react';
import { getBookmarks, removeBookmark, type Bookmark as BookmarkType } from '@/lib/user-progress';

const TYPE_ICONS = {
  tool: Wrench,
  roadmap: Map,
  project: FolderOpen,
};

const TYPE_HREFS = {
  tool: (slug: string) => `/tools/${slug}`,
  roadmap: (slug: string) => `/roadmaps/view?slug=${slug}`,
  project: (slug: string) => `/projects/view?slug=${slug}`,
};

export function BookmarksPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks());
    }
  }, [isOpen]);

  function handleRemove(type: string, slug: string) {
    const updated = removeBookmark(type, slug);
    setBookmarks(updated);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[var(--bg-surface)] border-l border-[var(--border-soft)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-soft)]">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-[var(--accent-dark)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Bookmarks</h2>
            {bookmarks.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] rounded-full">
                {bookmarks.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-10 h-10 mx-auto text-[var(--text-subtle)] mb-3 opacity-40" />
              <p className="text-sm font-medium text-[var(--text-primary)]">No bookmarks yet</p>
              <p className="text-xs text-[var(--text-subtle)] mt-1">
                Save tools, roadmaps, and projects for quick access
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.map((item) => {
                const Icon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] || Wrench;
                const href = TYPE_HREFS[item.type as keyof typeof TYPE_HREFS]?.(item.slug) || '#';
                return (
                  <div
                    key={`${item.type}-${item.slug}`}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--border-soft)] hover:border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate hover:text-[var(--accent-dark)] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-subtle)] capitalize">{item.type}</p>
                    </Link>
                    <button
                      onClick={() => handleRemove(item.type, item.slug)}
                      className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[var(--text-subtle)] hover:text-red-500 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
