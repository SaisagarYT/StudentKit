'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { projectService, type ProjectListItem, type ContentStatus } from '@/lib/cms';
import Link from 'next/link';
import { Plus, Search, FolderOpen, Loader2, Eye, EyeOff, Archive, Trash2, MoreVertical } from 'lucide-react';

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

  const filtered = search ? items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) : items;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage curated learning projects</p>
        </div>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
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
          {filtered.map((item) => (
            <div key={item.id} className="relative flex items-center gap-4 p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-colors">
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
