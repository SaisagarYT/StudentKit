'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { roadmapService, type RoadmapListItem, type ContentStatus } from '@/lib/cms';
import Link from 'next/link';
import { Plus, Search, Map, Loader2, Eye, EyeOff, Archive, Trash2, MoreVertical, CheckSquare } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const STATUS_STYLE: Record<ContentStatus, string> = {
  published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  draft: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  archived: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

export function RoadmapsList() {
  const { user } = useAuth();
  const [items, setItems] = useState<RoadmapListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | ''>('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const filters = statusFilter ? { status: statusFilter } : undefined;
      setItems(await roadmapService.list(filters));
    } catch {
      // Firestore not configured
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePublish(id: string) {
    if (!user) return;
    setActionLoading(id);
    try {
      await roadmapService.publish(id, user.uid);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
    setActionLoading(null);
    setActionMenu(null);
  }

  async function handleUnpublish(id: string) {
    if (!user) return;
    setActionLoading(id);
    try {
      await roadmapService.unpublish(id, user.uid);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
    setActionLoading(null);
    setActionMenu(null);
  }

  async function handleArchive(id: string) {
    if (!user) return;
    if (!confirm('Archive this roadmap?')) return;
    setActionLoading(id);
    try {
      await roadmapService.archive(id, user.uid);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
    setActionLoading(null);
    setActionMenu(null);
  }

  async function handleDelete(id: string) {
    if (!user) return;
    if (!confirm('Permanently delete this roadmap? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await roadmapService.remove(id);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
    setActionLoading(null);
    setActionMenu(null);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((i) => i.id)));
  }

  async function bulkAction(action: 'publish' | 'unpublish' | 'archive' | 'delete') {
    if (!user || selected.size === 0) return;
    const label = action === 'delete' ? 'permanently delete' : action;
    if (!confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} ${selected.size} roadmap(s)?`)) return;
    setBulkLoading(true);
    for (const id of selected) {
      try {
        if (action === 'publish') await roadmapService.publish(id, user.uid);
        else if (action === 'unpublish') await roadmapService.unpublish(id, user.uid);
        else if (action === 'archive') await roadmapService.archive(id, user.uid);
        else if (action === 'delete') await roadmapService.remove(id);
      } catch { /* continue with others */ }
    }
    setSelected(new Set());
    setBulkLoading(false);
    await load();
  }

  const filtered = search ? items.filter((r) => r.title.toLowerCase().includes(search.toLowerCase())) : items;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Roadmaps</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage learning roadmaps</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/roadmaps/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-xs">
            <Plus className="w-4 h-4" />
            Create Roadmap
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input type="text" placeholder="Search roadmaps..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-dark)]" />
        </div>
        <div className="w-40">
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as ContentStatus | '')}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
          <CheckSquare className="w-4 h-4 text-[var(--accent-dark)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{selected.size} selected</span>
          <div className="flex-1" />
          <button onClick={() => bulkAction('publish')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors">
            Publish
          </button>
          <button onClick={() => bulkAction('unpublish')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-sm bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 transition-colors">
            Unpublish
          </button>
          <button onClick={() => bulkAction('archive')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-sm bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/20 disabled:opacity-50 transition-colors">
            Archive
          </button>
          <button onClick={() => bulkAction('delete')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-sm bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors">
            Delete
          </button>
          {bulkLoading && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-subtle)]" />}
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 text-center py-16 border border-dashed border-[var(--border-default)] rounded-sm">
          <Map className="w-10 h-10 mx-auto text-[var(--text-subtle)] mb-3" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{search ? 'No matching roadmaps' : 'No roadmaps yet'}</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{search ? 'Try a different search.' : 'Create your first roadmap or run the migration script.'}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2">
              <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded-sm border-[var(--border-default)] accent-[var(--accent-dark)]" />
              <span className="text-xs text-[var(--text-subtle)]">Select all</span>
            </div>
          )}
          {filtered.map((item) => (
            <div key={item.id} className={`relative flex items-center gap-4 p-4 rounded-sm border bg-[var(--bg-surface)] transition-colors ${selected.has(item.id) ? 'border-[var(--accent-dark)]/40 bg-[var(--accent-dark)]/[0.02]' : 'border-[var(--border-soft)] hover:border-[var(--border-default)]'}`}>
              <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded-sm border-[var(--border-default)] accent-[var(--accent-dark)] shrink-0" />
              <div className="w-9 h-9 rounded-sm flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: `${item.accent}20`, color: item.accent }}>
                {item.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</span>
                  <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-medium ${STATUS_STYLE[item.status]}`}>{item.status}</span>
                </div>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">{item.sectionCount} sections · {item.topicCount} topics</p>
              </div>
              {item.featured && <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[var(--accent-dark)]/10 text-[var(--accent-dark)] font-medium">Featured</span>}

              {/* Actions */}
              <div className="relative">
                <button
                  onClick={() => setActionMenu(actionMenu === item.id ? null : item.id)}
                  className="p-2 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors"
                >
                  {actionLoading === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                </button>

                {actionMenu === item.id && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-sm shadow-lg z-50 overflow-hidden">
                    <Link href={`/admin/roadmaps/edit?id=${item.id}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors" onClick={() => setActionMenu(null)}>
                      <Map className="w-4 h-4 text-[var(--text-subtle)]" /> Edit
                    </Link>
                    <Link href={`/admin/roadmaps/preview?id=${item.id}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors" onClick={() => setActionMenu(null)}>
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Preview
                    </Link>
                    {item.status === 'draft' && (
                      <button onClick={() => handlePublish(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Publish
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button onClick={() => handleUnpublish(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Unpublish
                      </button>
                    )}
                    {item.status !== 'archived' && (
                      <button onClick={() => handleArchive(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <Archive className="w-4 h-4 text-[var(--text-subtle)]" /> Archive
                      </button>
                    )}
                    {item.status !== 'published' && (
                      <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
