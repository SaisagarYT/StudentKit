'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { projectService, type ProjectListItem, type ContentStatus } from '@/lib/cms';
import Link from 'next/link';
import { Plus, Search, FolderOpen, Loader2, Eye, EyeOff, Archive, Trash2, MoreVertical, CheckSquare } from 'lucide-react';
import { JsonImport } from './json-import';

const STATUS_STYLE: Record<ContentStatus, string> = {
  published: 'bg-green-500/10 text-green-500',
  draft: 'bg-yellow-500/10 text-yellow-500',
  archived: 'bg-zinc-500/10 text-zinc-400',
};

export function ProjectsList() {
  const { user } = useAuth();
  const [items, setItems] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | ''>('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  async function load() {
    try {
      const filters = statusFilter ? { status: statusFilter } : undefined;
      setItems(await projectService.list(filters));
    } catch {
      // Firestore not configured
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  async function handlePublish(id: string) {
    if (!user) return;
    setActionLoading(id);
    try {
      await projectService.publish(id, user.uid);
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
      await projectService.unpublish(id, user.uid);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
    setActionLoading(null);
    setActionMenu(null);
  }

  async function handleArchive(id: string) {
    if (!user) return;
    if (!confirm('Archive this project?')) return;
    setActionLoading(id);
    try {
      await projectService.archive(id, user.uid);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
    setActionLoading(null);
    setActionMenu(null);
  }

  async function handleDelete(id: string) {
    if (!user) return;
    if (!confirm('Permanently delete this project? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await projectService.remove(id);
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
    if (!confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} ${selected.size} project(s)?`)) return;
    setBulkLoading(true);
    for (const id of selected) {
      try {
        if (action === 'publish') await projectService.publish(id, user.uid);
        else if (action === 'unpublish') await projectService.unpublish(id, user.uid);
        else if (action === 'archive') await projectService.archive(id, user.uid);
        else if (action === 'delete') await projectService.remove(id);
      } catch { /* continue with others */ }
    }
    setSelected(new Set());
    setBulkLoading(false);
    await load();
  }

  const filtered = search ? items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) : items;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage curated learning projects</p>
        </div>
        <div className="flex items-center gap-2">
          <JsonImport />
          <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContentStatus | '')} className="px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-secondary)]">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20">
          <CheckSquare className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{selected.size} selected</span>
          <div className="flex-1" />
          <button onClick={() => bulkAction('publish')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20 disabled:opacity-50 transition-colors">
            Publish
          </button>
          <button onClick={() => bulkAction('unpublish')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 disabled:opacity-50 transition-colors">
            Unpublish
          </button>
          <button onClick={() => bulkAction('archive')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-500/10 text-zinc-600 hover:bg-zinc-500/20 disabled:opacity-50 transition-colors">
            Archive
          </button>
          <button onClick={() => bulkAction('delete')} disabled={bulkLoading} className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 disabled:opacity-50 transition-colors">
            Delete
          </button>
          {bulkLoading && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-subtle)]" />}
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 text-center py-16 border border-dashed border-[var(--border-default)] rounded-xl">
          <FolderOpen className="w-10 h-10 mx-auto text-[var(--text-subtle)] mb-3" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{search ? 'No matching projects' : 'No projects yet'}</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{search ? 'Try a different search.' : 'Create your first project to get started.'}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2">
              <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--accent-primary)]" />
              <span className="text-xs text-[var(--text-subtle)]">Select all</span>
            </div>
          )}
          {filtered.map((item) => (
            <div key={item.id} className={`relative flex items-center gap-4 p-4 rounded-xl border bg-[var(--bg-surface)] transition-colors ${selected.has(item.id) ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/[0.02]' : 'border-[var(--border-soft)] hover:border-[var(--border-default)]'}`}>
              <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--accent-primary)] shrink-0" />
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 bg-purple-500/10 text-purple-500">
                {item.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_STYLE[item.status]}`}>{item.status}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--text-subtle)]">{item.difficulty}</span>
                  {item.technologies.length > 0 && (
                    <span className="text-xs text-[var(--text-subtle)]">· {item.technologies.slice(0, 3).join(', ')}</span>
                  )}
                </div>
              </div>
              {item.featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium">Featured</span>}

              {/* Actions */}
              <div className="relative">
                <button
                  onClick={() => setActionMenu(actionMenu === item.id ? null : item.id)}
                  className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors"
                >
                  {actionLoading === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                </button>

                {actionMenu === item.id && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl shadow-lg z-50 overflow-hidden">
                    <Link href={`/admin/projects/edit?id=${item.id}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors" onClick={() => setActionMenu(null)}>
                      <FolderOpen className="w-4 h-4 text-[var(--text-subtle)]" /> Edit
                    </Link>
                    {item.status === 'draft' && (
                      <button onClick={() => handlePublish(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <Eye className="w-4 h-4 text-green-500" /> Publish
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button onClick={() => handleUnpublish(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <EyeOff className="w-4 h-4 text-yellow-500" /> Unpublish
                      </button>
                    )}
                    {item.status !== 'archived' && (
                      <button onClick={() => handleArchive(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
                        <Archive className="w-4 h-4 text-[var(--text-subtle)]" /> Archive
                      </button>
                    )}
                    {item.status !== 'published' && (
                      <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
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
