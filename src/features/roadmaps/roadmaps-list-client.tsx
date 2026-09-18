'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Map,
  Code,
  Server,
  Smartphone,
  Brain,
  Shield,
  Cloud,
  Database,
  Clock,
  BookOpen,
  Blocks,
  Loader2,
  Search,
  X,
  SearchX,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StreakBanner } from '@/components/engagement/streak-banner';
import { RoadmapProgressCard } from '@/components/engagement/roadmap-progress-card';
import { fetchAllRoadmaps, type RoadmapListEntry } from '@/lib/firebase/roadmaps';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { roadmaps as staticRoadmaps } from '@/config/roadmaps';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Server,
  Database,
  Brain,
  Smartphone,
  Cloud,
  Shield,
  Map,
  Blocks,
};

function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Map;
}

interface TrackCategory {
  id: string;
  label: string;
  matchSlugs?: string[];
}

const TRACK_CATEGORIES: TrackCategory[] = [
  { id: 'all', label: 'All Tracks' },
  { id: 'frontend', label: 'Frontend', matchSlugs: ['frontend', 'react', 'javascript', 'vue', 'angular'] },
  { id: 'backend', label: 'Backend', matchSlugs: ['backend', 'nodejs', 'python', 'java', 'go', 'sql'] },
  { id: 'devops', label: 'DevOps & Cloud', matchSlugs: ['devops', 'cloud', 'aws', 'docker', 'kubernetes'] },
  { id: 'ai', label: 'AI & Data', matchSlugs: ['ai', 'ml', 'data-science', 'python', 'deep-learning'] },
  { id: 'mobile', label: 'Mobile & Systems', matchSlugs: ['android', 'ios', 'flutter', 'react-native', 'system-design', 'cybersecurity'] },
];

export function RoadmapsListClient() {
  const [roadmaps, setRoadmaps] = useState<RoadmapListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        if (isFirebaseConfigured) {
          const data = await fetchAllRoadmaps();
          if (data.length > 0) {
            setRoadmaps(data);
            return;
          }
        }
      } catch {
        // Fall through to static fallback
      }

      // Fallback: use static config data
      const fallback: RoadmapListEntry[] = staticRoadmaps.map((r) => ({
        slug: r.slug,
        title: r.title,
        description: r.description,
        icon: r.icon || 'Map',
        accent: r.accent || 'var(--accent-primary)',
        totalTime: r.totalTime,
        totalTopics: r.stages.reduce((sum, s) => sum + s.topics.length, 0),
        stageCount: r.stages.length,
      }));
      setRoadmaps(fallback);
    }

    load().finally(() => setLoading(false));
  }, []);

  const filteredRoadmaps = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roadmaps.filter((r) => {
      // Category filter
      if (selectedTrack !== 'all') {
        const cat = TRACK_CATEGORIES.find((c) => c.id === selectedTrack);
        if (cat?.matchSlugs) {
          const matches = cat.matchSlugs.some(
            (slugPart) => r.slug.toLowerCase().includes(slugPart) || r.title.toLowerCase().includes(slugPart)
          );
          if (!matches) return false;
        }
      }

      // Search query
      if (!query) return true;
      return (
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.slug.toLowerCase().includes(query)
      );
    });
  }, [roadmaps, search, selectedTrack]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8"
        >
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            Career & Technology Curriculums
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
            Interactive <span className="font-serif italic font-normal text-[var(--accent-dark)]">Roadmaps</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Step-by-step developer curriculums covering essential technologies, milestone projects, and progress tracking. Know exactly what to learn next without tutorial paralysis.
          </p>
        </motion.div>

        {/* Streak Banner */}
        <div className="mb-8">
          <StreakBanner />
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-3 mb-8">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-subtle)]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search career paths (e.g., Frontend, Python, DevOps, Cloud)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-dark)] transition-colors shadow-sm"
            />
            {search && (
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-2">
                <span className="text-[11px] font-mono text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                  {filteredRoadmaps.length} found
                </span>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Track Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TRACK_CATEGORIES.map((cat) => {
              const isSelected = selectedTrack === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedTrack(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] shadow-xs'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Roadmap Cards Grid */}
        {filteredRoadmaps.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredRoadmaps.map((roadmap) => {
              const Icon = getIcon(roadmap.icon);

              return (
                <Link
                  key={roadmap.slug}
                  href={`/roadmaps/view?slug=${roadmap.slug}`}
                  className="group flex flex-col justify-between p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all duration-200"
                >
                  <div>
                    {/* Icon & Stage Count Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--accent-dark)] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-medium text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-sm">
                        {roadmap.stageCount} stages
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                      {roadmap.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                      {roadmap.description}
                    </p>
                  </div>

                  <div>
                    <div className="mt-4 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-subtle)]">
                          <Clock className="w-3 h-3" />
                          <span>{roadmap.totalTime}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-subtle)]">
                          <BookOpen className="w-3 h-3" />
                          <span>{roadmap.totalTopics} topics</span>
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-dark)] group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Progress Card */}
                    <RoadmapProgressCard slug={roadmap.slug} totalTopics={roadmap.totalTopics} />
                  </div>
                </Link>
              );
            })}
          </motion.div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[var(--border-soft)] rounded-md bg-[var(--bg-surface)]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-subtle)] mb-3">
              <SearchX className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              No roadmaps match &ldquo;{search}&rdquo;
            </h3>
            <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Try adjusting your search terms or switch category filters to view all available learning paths.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedTrack('all');
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--border-soft)] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Bottom Recommendation CTA */}
        <div className="mt-16 p-8 md:p-12 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)] text-center shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Looking for something specific?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
            Complement your roadmap journey with our suite of student tools, full-stack open-source projects, and technical interview sheet.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-md hover:bg-[var(--accent-dark)]/90 transition-colors shadow-xs"
            >
              Explore Projects
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)] rounded-md hover:bg-[var(--border-soft)] transition-colors"
            >
              Developer Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
