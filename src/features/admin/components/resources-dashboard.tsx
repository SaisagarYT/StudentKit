'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Trash2, Eye, Globe, FileText, Pencil,
  BookOpen, Code, Brain, Briefcase, Layers, TrendingUp,
  EyeOff, Filter, MoreVertical, ArrowUpRight
} from 'lucide-react';
import { resourceRepository } from '@/lib/cms/repository';
import { useAuth } from '@/lib/firebase/auth';
import type { ResourceListItem } from '@/lib/cms/types';

const categoryIcons: Record<string, React.ElementType> = {
  dsa: Code,
  concepts: Brain,
  guides: BookOpen,
  career: Briefcase,
  'system-design': Layers,
};

const categoryColors: Record<string, string> = {
  dsa: '#8b5cf6',
  concepts: '#3b82f6',
  guides: '#22c55e',
  career: '#f59e0b',
  'system-design': '#ec4899',
};

const statusConfig = {
  draft: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', label: 'Draft' },
  published: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', label: 'Published' },
  archived: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', label: 'Archived' },
};

const difficultyColors: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
  expert: '#a855f7',
};

export function ResourcesDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  useEffect(() => {
    resourceRepository.list().then(items => {
      setResources(items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePublish = async (id: string) => {
    if (!user) return;
    await resourceRepository.publish(id, user.uid);
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'published' as const } : r));
    setActionMenuId(null);
  };

  const handleUnpublish = async (id: string) => {
    if (!user) return;
    await resourceRepository.unpublish(id, user.uid);
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'draft' as const } : r));
    setActionMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource permanently?')) return;
    await resourceRepository.remove(id);
    setResources(prev => prev.filter(r => r.id !== id));
    setActionMenuId(null);
  };

  const filtered = resources.filter(r => {
    const matchesSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = resources.filter(r => r.status === 'published').length;
  const draftCount = resources.filter(r => r.status === 'draft').length;
  const categoryCounts = resources.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Resources</h1>
          <p className="text-xs text-[var(--text-primary)] opacity-50 mt-1">
            Manage tutorials, editorials, and learning content
          </p>
        </div>
        <Link
          href="/admin/resources/dsa"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Problem
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-4 h-4 text-[var(--text-subtle)]" />
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{resources.length}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Total Resources</p>
        </div>
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{publishedCount}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Published</p>
        </div>
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Pencil className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{draftCount}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Drafts</p>
        </div>
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Code className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{categoryCounts['dsa'] || 0}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">DSA Editorials</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="dsa">DSA</option>
              <option value="concepts">Concepts</option>
              <option value="guides">Guides</option>
              <option value="career">Career</option>
              <option value="system-design">System Design</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-subtle)] pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-subtle)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Resource List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-xs text-[var(--text-subtle)]">Loading resources...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-[var(--text-primary)] opacity-60">
            {resources.length === 0 ? 'No resources yet' : 'No matches found'}
          </p>
          <p className="text-xs text-[var(--text-subtle)] mt-1">
            {resources.length === 0 ? 'Use the seed button or create your first resource.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(resource => {
            const CatIcon = categoryIcons[resource.category] || FileText;
            const catColor = categoryColors[resource.category] || '#6b7280';
            const status = statusConfig[resource.status as keyof typeof statusConfig] || statusConfig.draft;
            const diffColor = difficultyColors[resource.difficulty] || '#6b7280';

            return (
              <div
                key={resource.id}
                className="group relative flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)] hover:border-[rgba(255,255,255,0.12)] transition-all"
              >
                {/* Category Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${catColor}15` }}
                >
                  <CatIcon className="w-4 h-4" style={{ color: catColor }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {resource.title}
                    </h3>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] capitalize" style={{ color: catColor }}>
                      {resource.category.replace('-', ' ')}
                    </span>
                    <span className="text-[10px]" style={{ color: diffColor }}>
                      {resource.difficulty}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)]">
                      {resource.readTime} min read
                    </span>
                    {resource.tags.length > 0 && (
                      <span className="text-[10px] text-[var(--text-subtle)] hidden sm:inline truncate max-w-[180px]">
                        {resource.tags.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/admin/resources/edit?id=${resource.id}`}
                    className="p-2 rounded-lg text-[var(--text-subtle)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/resources/view?slug=${resource.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-[var(--text-subtle)] hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    title="Preview"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* More menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === resource.id ? null : resource.id)}
                      className="p-2 rounded-lg text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {actionMenuId === resource.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActionMenuId(null)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[var(--bg-surface)] shadow-xl shadow-black/30 py-1.5">
                          {resource.status === 'draft' ? (
                            <button
                              onClick={() => handlePublish(resource.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5" /> Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnpublish(resource.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-amber-400 hover:bg-amber-400/10 transition-colors"
                            >
                              <EyeOff className="w-3.5 h-3.5" /> Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer count */}
      {filtered.length > 0 && (
        <p className="text-[10px] text-[var(--text-subtle)] mt-4 text-right">
          Showing {filtered.length} of {resources.length} resources
        </p>
      )}
    </div>
  );
}
