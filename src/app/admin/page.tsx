'use client';

import { AdminShell } from '@/features/admin/components/admin-shell';
import { MigrateRoadmaps } from '@/features/admin/components/migrate-roadmaps';
import { AnalyticsWidget } from '@/features/admin/components/analytics-widget';
import { useAuth } from '@/lib/firebase/auth';
import { roadmapService, projectService } from '@/lib/cms';
import { useEffect, useState } from 'react';
import {
  Map,
  FolderOpen,
  Eye,
  FileText,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Clock,
  CheckCircle2,
  BarChart3,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardContent />
    </AdminShell>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    roadmaps: 0,
    publishedRoadmaps: 0,
    draftRoadmaps: 0,
    projects: 0,
    publishedProjects: 0,
    draftProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allRoadmaps, pubRoadmaps, draftRoadmaps, allProjects, pubProjects, draftProjects] =
          await Promise.all([
            roadmapService.list(),
            roadmapService.list({ status: 'published' }),
            roadmapService.list({ status: 'draft' }),
            projectService.list(),
            projectService.list({ status: 'published' }),
            projectService.list({ status: 'draft' }),
          ]);
        setStats({
          roadmaps: allRoadmaps.length,
          publishedRoadmaps: pubRoadmaps.length,
          draftRoadmaps: draftRoadmaps.length,
          projects: allProjects.length,
          publishedProjects: pubProjects.length,
          draftProjects: draftProjects.length,
        });
      } catch {
        // Firestore may not be configured yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const greeting = getGreeting();
  const totalPublished = stats.publishedRoadmaps + stats.publishedProjects;
  const totalDrafts = stats.draftRoadmaps + stats.draftProjects;
  const totalContent = stats.roadmaps + stats.projects;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--accent-dark)] p-8">
        <div className="relative z-10">
          <p className="text-[var(--accent-primary)] text-sm font-medium mb-1">{greeting}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
          </h1>
          <p className="mt-2 text-white/60 text-sm max-w-md">
            Manage your content, track performance, and keep your platform up to date.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-[var(--accent-primary)]/10 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-8 text-[var(--accent-primary)]/20">
          <Sparkles className="w-24 h-24" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart3}
          label="Total Content"
          value={totalContent}
          trend={`${totalPublished} live`}
          color="emerald"
          loading={loading}
        />
        <StatCard
          icon={Map}
          label="Roadmaps"
          value={stats.roadmaps}
          trend={`${stats.publishedRoadmaps} published`}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={FolderOpen}
          label="Projects"
          value={stats.projects}
          trend={`${stats.publishedProjects} published`}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={FileText}
          label="Drafts"
          value={totalDrafts}
          trend="pending review"
          color="amber"
          loading={loading}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick Actions</h2>
            <Zap className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionCard
              href="/admin/roadmaps"
              icon={Plus}
              title="New Roadmap"
              description="Create a guided learning path"
              accent="blue"
            />
            <ActionCard
              href="/admin/projects"
              icon={Plus}
              title="New Project"
              description="Add a curated project guide"
              accent="purple"
            />
            <ActionCard
              href="/admin/roadmaps"
              icon={Map}
              title="Manage Roadmaps"
              description={`${stats.roadmaps} total · ${stats.draftRoadmaps} drafts`}
              accent="emerald"
            />
            <ActionCard
              href="/admin/projects"
              icon={FolderOpen}
              title="Manage Projects"
              description={`${stats.projects} total · ${stats.draftProjects} drafts`}
              accent="amber"
            />
          </div>
        </div>

        {/* Platform Status */}
        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Platform Status</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-4">
            <StatusItem
              icon={Eye}
              label="Published Roadmaps"
              value={stats.publishedRoadmaps}
              loading={loading}
            />
            <StatusItem
              icon={CheckCircle2}
              label="Published Projects"
              value={stats.publishedProjects}
              loading={loading}
            />
            <StatusItem
              icon={Clock}
              label="Draft Items"
              value={totalDrafts}
              loading={loading}
            />
            <StatusItem
              icon={TrendingUp}
              label="Completion Rate"
              value={totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0}
              suffix="%"
              loading={loading}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-soft)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-subtle)]">
              <span>Content health</span>
              <span>{totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${totalContent > 0 ? (totalPublished / totalContent) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics + Migration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsWidget />
        <MigrateRoadmaps />
      </div>

      {/* Footer Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FooterCard
          href="/roadmaps"
          label="View Public Roadmaps"
          icon={ArrowUpRight}
        />
        <FooterCard
          href="/projects"
          label="View Public Projects"
          icon={ArrowUpRight}
        />
        <FooterCard
          href="/open-source"
          label="Open Source Hub"
          icon={ArrowUpRight}
        />
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const STAT_COLORS = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    trend: 'text-emerald-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: 'text-purple-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    trend: 'text-amber-600',
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  loading,
}: {
  icon: typeof Map;
  label: string;
  value: number;
  trend: string;
  color: keyof typeof STAT_COLORS;
  loading: boolean;
}) {
  const colors = STAT_COLORS[color];
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 hover:border-[var(--border-default)] hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-16 bg-[var(--bg-subtle)] rounded animate-pulse" />
        ) : (
          <span className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{value}</span>
        )}
        <p className="text-xs text-[var(--text-subtle)] mt-1 uppercase tracking-wider font-medium">{label}</p>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--border-soft)]">
        <span className={`text-xs font-medium ${colors.trend}`}>{trend}</span>
      </div>
    </div>
  );
}

const ACTION_ACCENTS = {
  blue: 'group-hover:bg-blue-50 group-hover:text-blue-600',
  purple: 'group-hover:bg-purple-50 group-hover:text-purple-600',
  emerald: 'group-hover:bg-emerald-50 group-hover:text-emerald-600',
  amber: 'group-hover:bg-amber-50 group-hover:text-amber-600',
};

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
  accent,
}: {
  href: string;
  icon: typeof Plus;
  title: string;
  description: string;
  accent: keyof typeof ACTION_ACCENTS;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border-soft)] hover:border-[var(--border-default)] hover:shadow-sm bg-[var(--bg-surface)] transition-all duration-200"
    >
      <div className={`p-2.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors duration-200 ${ACTION_ACCENTS[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)]">
          {title}
        </p>
        <p className="text-xs text-[var(--text-subtle)] mt-0.5 truncate">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

function StatusItem({
  icon: Icon,
  label,
  value,
  suffix = '',
  loading,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  suffix?: string;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[var(--text-subtle)]" />
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      </div>
      {loading ? (
        <div className="h-5 w-8 bg-[var(--bg-subtle)] rounded animate-pulse" />
      ) : (
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {value}{suffix}
        </span>
      )}
    </div>
  );
}

function FooterCard({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof ArrowUpRight;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all duration-200"
    >
      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
        {label}
      </span>
      <Icon className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--accent-primary)] transition-colors" />
    </Link>
  );
}
