'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bookmark, StickyNote, Search, Trash2, Map, FolderOpen, Wrench,
  Plus, X, Filter, Clock
} from 'lucide-react';
import { getBookmarks, removeBookmark, type Bookmark as BookmarkType } from '@/lib/user-progress';

const NOTES_KEY = 'sk-notes';

export interface NoteItem {
  id: string;
  bookmarkKey: string;
  text: string;
  createdAt: string;
}

function getNotes(): NoteItem[] {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNotes(notes: NoteItem[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

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

const TYPE_COLORS = {
  tool: 'bg-blue-500/10 text-blue-600',
  roadmap: 'bg-emerald-500/10 text-emerald-600',
  project: 'bg-purple-500/10 text-purple-600',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function NotesPageClient() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(getBookmarks());
    setNotes(getNotes());
  }, []);

  const handleRemoveBookmark = useCallback((type: string, slug: string) => {
    const updated = removeBookmark(type, slug);
    setBookmarks(updated);
    const key = `${type}:${slug}`;
    setNotes(prev => {
      const filtered = prev.filter(n => n.bookmarkKey !== key);
      saveNotes(filtered);
      return filtered;
    });
  }, []);

  const handleSaveNote = useCallback((bookmarkKey: string) => {
    if (!noteText.trim()) {
      setEditingNote(null);
      return;
    }
    setNotes(prev => {
      const existing = prev.findIndex(n => n.bookmarkKey === bookmarkKey);
      let updated: NoteItem[];
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = { ...updated[existing], text: noteText.trim(), createdAt: new Date().toISOString() };
      } else {
        updated = [...prev, {
          id: `note-${Date.now()}`,
          bookmarkKey,
          text: noteText.trim(),
          createdAt: new Date().toISOString(),
        }];
      }
      saveNotes(updated);
      return updated;
    });
    setEditingNote(null);
    setNoteText('');
  }, [noteText]);

  const handleDeleteNote = useCallback((bookmarkKey: string) => {
    setNotes(prev => {
      const filtered = prev.filter(n => n.bookmarkKey !== bookmarkKey);
      saveNotes(filtered);
      return filtered;
    });
  }, []);

  const filteredBookmarks = bookmarks.filter(b => {
    if (filterType !== 'all' && b.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.type.toLowerCase().includes(q);
    }
    return true;
  });

  const getNote = (type: string, slug: string) => notes.find(n => n.bookmarkKey === `${type}:${slug}`);

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container-main max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-sm bg-[var(--accent-primary)] flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-[var(--accent-dark)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notes & Bookmarks</h1>
              <p className="text-sm text-[var(--text-subtle)]">
                {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''} · {notes.length} note{notes.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
            {['all', 'tool', 'roadmap', 'project'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  filterType === type
                    ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)]'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks list */}
        {filteredBookmarks.length === 0 ? (
          <div className="py-16 text-center rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
            <Bookmark className="w-10 h-10 mx-auto text-[var(--text-subtle)] opacity-30 mb-3" />
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              {bookmarks.length === 0 ? 'No bookmarks yet' : 'No results'}
            </p>
            <p className="text-xs text-[var(--text-subtle)]">
              {bookmarks.length === 0
                ? 'Bookmark tools, roadmaps, and projects to save them here'
                : 'Try a different search or filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookmarks.map((item) => {
              const Icon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS] || Wrench;
              const href = TYPE_HREFS[item.type as keyof typeof TYPE_HREFS]?.(item.slug) || '#';
              const colorClass = TYPE_COLORS[item.type as keyof typeof TYPE_COLORS] || 'bg-gray-500/10 text-gray-600';
              const note = getNote(item.type, item.slug);
              const bookmarkKey = `${item.type}:${item.slug}`;
              const isEditing = editingNote === bookmarkKey;

              return (
                <div
                  key={bookmarkKey}
                  className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden transition-all hover:border-[var(--border-default)]"
                >
                  {/* Bookmark header row */}
                  <div className="flex items-center gap-3 p-4">
                    <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <Link href={href} className="flex-1 min-w-0 group">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-dark)] transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium text-[var(--text-subtle)] capitalize">{item.type}</span>
                        {item.addedAt && (
                          <>
                            <span className="text-[var(--text-subtle)]">·</span>
                            <span className="text-[10px] text-[var(--text-subtle)] flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />{formatDate(item.addedAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveNote(bookmarkKey);
                          } else {
                            setEditingNote(bookmarkKey);
                            setNoteText(note?.text || '');
                          }
                        }}
                        className={`p-2 rounded-sm transition-colors ${
                          isEditing
                            ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)]'
                            : note
                              ? 'text-yellow-500 hover:bg-yellow-50'
                              : 'text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)]'
                        }`}
                        title={isEditing ? 'Save note' : note ? 'Edit note' : 'Add note'}
                      >
                        {isEditing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleRemoveBookmark(item.type, item.slug)}
                        className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note display */}
                  {note && !isEditing && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="flex items-start gap-2 p-3 rounded-sm bg-yellow-50/50 border border-yellow-200/50">
                        <StickyNote className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[var(--text-secondary)] whitespace-pre-line">{note.text}</p>
                          <p className="text-[9px] text-[var(--text-subtle)] mt-1">{formatDate(note.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(bookmarkKey)}
                          className="shrink-0 p-1 rounded-sm text-[var(--text-subtle)] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Note editor */}
                  {isEditing && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a personal note..."
                          className="w-full p-3 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-background)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)] resize-none transition-colors"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveNote(bookmarkKey)}
                            className="px-3 py-1.5 rounded-sm text-[11px] font-semibold bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
                          >
                            Save Note
                          </button>
                          <button
                            onClick={() => { setEditingNote(null); setNoteText(''); }}
                            className="px-3 py-1.5 rounded-sm text-[11px] font-medium text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
