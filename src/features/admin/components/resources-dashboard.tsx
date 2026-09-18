'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Trash2, Globe, FileText, Pencil,
  Brain, TrendingUp,
  EyeOff, MoreVertical, ArrowUpRight, FolderGit2,
  CheckCircle2, HelpCircle
} from 'lucide-react';
import { resourceRepository } from '@/lib/cms/repository';
import { useAuth } from '@/lib/firebase/auth';
import type { ResourceListItem, ResourceDomainType } from '@/lib/cms/types';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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

const subjectLabels: Record<string, { label: string; color: string; bg: string }> = {
  'operating-systems': { label: 'Operating Systems', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  'dbms': { label: 'DBMS', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
  'computer-networks': { label: 'Computer Networks', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  'oops': { label: 'OOP Concepts', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  'system-design': { label: 'System Design', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
};

const trackLabels: Record<string, { label: string; color: string; bg: string }> = {
  'full-stack': { label: 'Full Stack', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  'backend': { label: 'Backend Engineering', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
  'frontend': { label: 'Frontend & UI', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  'ai-ml': { label: 'AI & ML Systems', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  'mobile': { label: 'Mobile Apps', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  'devops': { label: 'DevOps & Cloud', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
};

export function ResourcesDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | ResourceDomainType>('all');
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

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        r.title.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)) ||
        (r.techStack && r.techStack.some(ts => ts.toLowerCase().includes(q))) ||
        (r.subject && r.subject.toLowerCase().includes(q)) ||
        (r.projectTrack && r.projectTrack.toLowerCase().includes(q));

      const matchesDomain = domainFilter === 'all' || r.resourceType === domainFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [resources, search, domainFilter, statusFilter]);

  const csCount = resources.filter(r => r.resourceType === 'cs-fundamentals').length;
  const projectCount = resources.filter(r => r.resourceType === 'project-guide').length;
  const publishedCount = resources.filter(r => r.status === 'published').length;
  const draftCount = resources.filter(r => r.status === 'draft').length;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Resources Studio</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] font-semibold uppercase">
              Industry Standard
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Author and publish CS Fundamentals Deep-Dives and Practical Engineering Project Blueprints
          </p>
        </div>

        {/* Dedicated Two Action Creation Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/resources/new?type=cs-fundamentals"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-xs border border-[var(--border-soft)]"
          >
            <Brain className="w-3.5 h-3.5" />
            + New CS Fundamentals
          </Link>
          <Link
            href="/admin/resources/new?type=project-guide"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-semibold bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors border border-[var(--border-soft)] shadow-xs"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            + New Project Guide
          </Link>
        </div>
      </div>

      {/* Stats Cockpit */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase">Placement</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{csCount}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">CS Fundamentals</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">Engineering</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{projectCount}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Project Guides</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{publishedCount}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Live Published</p>
        </div>

        <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-2">
            <Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase">WIP</span>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{draftCount}</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">Drafts</p>
        </div>
      </div>

      {/* Domain Mode Switcher Tabs */}
      <div className="flex border-b border-[var(--border-soft)] mb-5">
        <button
          type="button"
          onClick={() => setDomainFilter('all')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            domainFilter === 'all'
              ? 'border-[var(--accent-dark)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
          }`}
        >
          All Resources ({resources.length})
        </button>
        <button
          type="button"
          onClick={() => setDomainFilter('cs-fundamentals')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            domainFilter === 'cs-fundamentals'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          CS Fundamentals ({csCount})
        </button>
        <button
          type="button"
          onClick={() => setDomainFilter('project-guide')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            domainFilter === 'project-guide'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          Project Guides ({projectCount})
        </button>
      </div>

      {/* Search & Status Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Search by title, tags, tech stack, or subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--accent-dark)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-36">
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resource Cards Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-xs text-[var(--text-subtle)] font-mono">Loading resources...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-8">
          <FileText className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {resources.length === 0 ? 'No resources created yet' : 'No matches found'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {resources.length === 0
              ? 'Click "+ New CS Fundamentals" or "+ New Project Guide" above to start authoring.'
              : 'Try adjusting your search query or domain filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(resource => {
            const isCs = resource.resourceType === 'cs-fundamentals';
            const status = statusConfig[resource.status as keyof typeof statusConfig] || statusConfig.draft;
            const diffColor = difficultyColors[resource.difficulty] || '#6b7280';
            const subjectInfo = resource.subject ? subjectLabels[resource.subject] : null;
            const trackInfo = resource.projectTrack ? trackLabels[resource.projectTrack] : null;

            return (
              <div
                key={resource.id}
                className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-dark)]/40 transition-all shadow-xs"
              >
                {/* Domain Icon */}
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border ${
                    isCs
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isCs ? <Brain className="w-5 h-5" /> : <FolderGit2 className="w-5 h-5" />}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors truncate">
                      {resource.title}
                    </h3>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm shrink-0"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.label}
                    </span>
                    {resource.featured && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-sm bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Domain Badges & Metadata */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {/* CS Fundamentals Subject Pill */}
                    {isCs && subjectInfo && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                        style={{ color: subjectInfo.color, background: subjectInfo.bg }}
                      >
                        {subjectInfo.label}
                      </span>
                    )}

                    {/* Project Guide Track Pill */}
                    {!isCs && trackInfo && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                        style={{ color: trackInfo.color, background: trackInfo.bg }}
                      >
                        {trackInfo.label}
                      </span>
                    )}

                    {/* Difficulty Pill */}
                    <span
                      className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded-sm"
                      style={{ color: diffColor, background: `${diffColor}15` }}
                    >
                      {resource.difficulty}
                    </span>

                    {/* Read Time */}
                    <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                      {resource.readTime}m read
                    </span>

                    {/* CS: Interview Questions Counter */}
                    {isCs && (resource.interviewQuestionCount ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded-sm border border-amber-500/20">
                        <HelpCircle className="w-3 h-3" />
                        {resource.interviewQuestionCount} Q&As
                      </span>
                    )}

                    {/* Project: Milestones Counter */}
                    {!isCs && (resource.milestoneCount ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-sm border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {resource.milestoneCount} Milestones
                      </span>
                    )}

                    {/* Tech stack or tags */}
                    {!isCs && resource.techStack && resource.techStack.length > 0 && (
                      <span className="text-[10px] font-mono text-[var(--text-subtle)] hidden md:inline truncate max-w-[200px]">
                        Stack: {resource.techStack.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/admin/resources/edit?id=${resource.id}`}
                    className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-[var(--accent-dark)] hover:bg-[var(--accent-dark)]/10 transition-colors"
                    title="Edit Studio"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/resources/view?slug=${resource.slug}`}
                    target="_blank"
                    className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Student Preview"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  {/* More Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActionMenuId(actionMenuId === resource.id ? null : resource.id)}
                      className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {actionMenuId === resource.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActionMenuId(null)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xl shadow-black/40 py-1.5">
                          {resource.status === 'draft' ? (
                            <button
                              type="button"
                              onClick={() => handlePublish(resource.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                            >
                              <Globe className="w-3.5 h-3.5" /> Publish Live
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnpublish(resource.id)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                            >
                              <EyeOff className="w-3.5 h-3.5" /> Unpublish to Draft
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(resource.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
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

      {/* Footer info */}
      {filtered.length > 0 && (
        <p className="text-[10px] text-[var(--text-subtle)] font-mono mt-4 text-right">
          Showing {filtered.length} of {resources.length} resources
        </p>
      )}
    </div>
  );
}
