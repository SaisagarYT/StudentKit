'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import {
  Star,
  GitFork,
  ExternalLink,
  Search,
  Flame,
  Zap,
  Trophy,
  Code2,
  Filter,
  Clock,
  Eye,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
type SortBy = 'stars' | 'forks' | 'updated';

const DIFFICULTY_CONFIG = {
  all: { label: 'All Levels', icon: Filter, color: 'text-[var(--text-primary)]', bg: 'bg-[var(--accent-primary)]' },
  beginner: { label: 'Beginner', icon: Flame, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' },
  intermediate: { label: 'Intermediate', icon: Zap, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' },
  advanced: { label: 'Advanced', icon: Trophy, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' },
};

const CATEGORIES: { id: string; label: string; query: string; difficulty: Difficulty }[] = [
  { id: 'beginner-web', label: 'HTML/CSS/JS Projects', query: 'beginner+web+project', difficulty: 'beginner' },
  { id: 'beginner-python', label: 'Python Starter Projects', query: 'beginner+python+project', difficulty: 'beginner' },
  { id: 'todo-apps', label: 'Todo Apps', query: 'todo+app+project', difficulty: 'beginner' },
  { id: 'react-projects', label: 'React Projects', query: 'react+project+starter', difficulty: 'intermediate' },
  { id: 'fullstack', label: 'Full Stack Apps', query: 'fullstack+project+typescript', difficulty: 'intermediate' },
  { id: 'node-api', label: 'Node.js APIs', query: 'nodejs+api+project', difficulty: 'intermediate' },
  { id: 'nextjs', label: 'Next.js Projects', query: 'nextjs+project+app', difficulty: 'intermediate' },
  { id: 'flutter', label: 'Flutter Apps', query: 'flutter+app+project', difficulty: 'intermediate' },
  { id: 'django', label: 'Django Projects', query: 'django+project+web', difficulty: 'intermediate' },
  { id: 'ecommerce', label: 'E-Commerce', query: 'ecommerce+store+project', difficulty: 'intermediate' },
  { id: 'chat-apps', label: 'Chat Applications', query: 'chat+realtime+project', difficulty: 'intermediate' },
  { id: 'ml-ai', label: 'AI / ML Projects', query: 'machine-learning+project+python', difficulty: 'advanced' },
  { id: 'system-design', label: 'System Design', query: 'system-design+project', difficulty: 'advanced' },
  { id: 'microservices', label: 'Microservices', query: 'microservices+docker+project', difficulty: 'advanced' },
  { id: 'blockchain', label: 'Blockchain / Web3', query: 'blockchain+web3+project', difficulty: 'advanced' },
  { id: 'devops', label: 'DevOps / CI-CD', query: 'devops+cicd+project', difficulty: 'advanced' },
];

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

function classifyDifficulty(repo: GitHubRepo): Difficulty {
  const topics = repo.topics.join(' ').toLowerCase();
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const all = `${topics} ${name} ${desc}`;

  if (all.includes('beginner') || all.includes('starter') || all.includes('simple') || all.includes('basic') || all.includes('learn') || all.includes('tutorial'))
    return 'beginner';
  if (all.includes('advanced') || all.includes('microservice') || all.includes('system-design') || all.includes('distributed') || all.includes('blockchain') || repo.stargazers_count > 5000)
    return 'advanced';
  return 'intermediate';
}

function ProjectCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const difficulty = classifyDifficulty(repo);
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const DiffIcon = diffConfig.icon;

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: (index % 12) * 0.04, ease: 'power3.out' }
    );
  }, [index]);

  return (
    <a
      ref={cardRef}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 opacity-0 overflow-hidden"
    >
      <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-2xl', diffConfig.bg)} />

      <div className="flex items-start gap-3 mb-3">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-8 h-8 rounded-full border border-[var(--border-soft)]"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-dark)] transition-colors">
            {repo.name}
          </h3>
          <p className="text-[11px] text-[var(--text-subtle)] truncate">
            {repo.owner.login}
          </p>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 flex-1 mb-4">
        {repo.description || 'No description provided.'}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-dark)]"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] text-[var(--text-subtle)]">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-soft)]">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b8b8b' }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-subtle)]">
            <Star className="w-3 h-3" />
            {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-subtle)]">
            <GitFork className="w-3 h-3" />
            {repo.forks_count.toLocaleString()}
          </span>
        </div>
        <span className={cn('flex items-center gap-1 text-[10px] font-semibold', diffConfig.color)}>
          <DiffIcon className="w-3 h-3" />
          {DIFFICULTY_CONFIG[difficulty].label}
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-[var(--border-soft)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-[var(--border-soft)]" />
          <div className="h-3 w-1/3 rounded bg-[var(--border-soft)]" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-[var(--border-soft)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--border-soft)]" />
      </div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 w-14 rounded-md bg-[var(--border-soft)]" />
        <div className="h-5 w-16 rounded-md bg-[var(--border-soft)]" />
        <div className="h-5 w-12 rounded-md bg-[var(--border-soft)]" />
      </div>
      <div className="pt-3 border-t border-[var(--border-soft)]">
        <div className="h-3 w-1/2 rounded bg-[var(--border-soft)]" />
      </div>
    </div>
  );
}

export function GitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('all');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('stars');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const PER_PAGE = 100;

  const fetchRepos = useCallback(async (query?: string, pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const searchTerm = query || 'project+student+portfolio';
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}+stars:>10&sort=${sortBy}&order=desc&per_page=${PER_PAGE}&page=${pageNum}`
      );
      if (!res.ok) throw new Error('GitHub API error');
      const data = await res.json();
      const items: GitHubRepo[] = data.items || [];

      if (append) {
        setRepos((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newItems = items.filter((r) => !existingIds.has(r.id));
          return [...prev, ...newItems];
        });
      } else {
        setRepos(items);
      }

      setTotalCount(data.total_count || 0);
      setCurrentQuery(searchTerm);
      setPage(pageNum);
    } catch {
      if (!append) setRepos([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sortBy]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    const maxPage = Math.ceil(Math.min(totalCount, 1000) / PER_PAGE);
    if (page >= maxPage) return;
    fetchRepos(currentQuery, page + 1, true);
  }, [loadingMore, loading, totalCount, page, currentQuery, fetchRepos]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && repos.length > 0) {
          loadMore();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, repos.length, loadMore]);

  useEffect(() => {
    if (!headerRef.current || !statsRef.current) return;
    gsap.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
    );
    gsap.fromTo(
      statsRef.current.children,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, stagger: 0.08, duration: 0.4, delay: 0.3, ease: 'back.out(1.4)' }
    );
  }, []);

  const handleCategoryClick = (cat: typeof CATEGORIES[number]) => {
    setActiveCategory(cat.id);
    setActiveDifficulty(cat.difficulty);
    fetchRepos(cat.query);
  };

  const handleDifficultyFilter = (d: Difficulty) => {
    setActiveDifficulty(d);
    setActiveCategory('');
    if (d === 'all') {
      fetchRepos();
    } else {
      fetchRepos(`${d}+project+programming`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveCategory('');
      setActiveDifficulty('all');
      fetchRepos(`${searchQuery.trim()}+project`);
    }
  };

  const filteredRepos = repos.filter((repo) => {
    if (activeDifficulty === 'all') return true;
    return classifyDifficulty(repo) === activeDifficulty;
  });

  const hasMore = page < Math.ceil(Math.min(totalCount, 1000) / PER_PAGE);

  const stats = {
    total: totalCount,
    loaded: filteredRepos.length,
    stars: filteredRepos.reduce((s, r) => s + r.stargazers_count, 0),
    beginner: filteredRepos.filter((r) => classifyDifficulty(r) === 'beginner').length,
    intermediate: filteredRepos.filter((r) => classifyDifficulty(r) === 'intermediate').length,
    advanced: filteredRepos.filter((r) => classifyDifficulty(r) === 'advanced').length,
  };

  return (
    <div className="w-full">
      {/* Hero Header */}
      <div ref={headerRef} className="mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent-primary)]">
          Build
        </span>
        <h1 className="mt-3 text-h1 font-bold tracking-tight">
          Open Source{' '}
          <span className="font-serif italic font-normal">Projects</span>
        </h1>
        <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Discover real-world open source projects from GitHub — filtered by difficulty,
          categorized by tech stack, and ready for you to learn from and contribute to.
          Scroll down to keep loading more.
        </p>
      </div>

      {/* Stats Bar */}
      <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Available</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">{stats.total.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Total Stars</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">{stats.stars.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Beginner</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">{stats.beginner}</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider">Advanced</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">{stats.advanced}</span>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects (e.g. todo app, chat, e-commerce, weather, blog)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] transition-all"
          />
        </form>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider whitespace-nowrap">Sort:</span>
          {([
            { key: 'stars' as SortBy, label: 'Stars', icon: Star },
            { key: 'forks' as SortBy, label: 'Forks', icon: GitFork },
            { key: 'updated' as SortBy, label: 'Recent', icon: Clock },
          ]).map(({ key, label, icon: SortIcon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setSortBy(key); fetchRepos(activeCategory ? CATEGORIES.find(c => c.id === activeCategory)?.query : undefined); }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all',
                sortBy === key
                  ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
              )}
            >
              <SortIcon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.all][]).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleDifficultyFilter(key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 border',
                activeDifficulty === key
                  ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] border-[var(--accent-dark)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--accent-primary)]/60'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Category Quick Picks */}
      <div className="mb-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-3">
          Quick Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[11px] font-medium transition-all border',
                activeCategory === cat.id
                  ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] border-[var(--accent-dark)]'
                  : 'text-[var(--text-secondary)] border-[var(--border-soft)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && filteredRepos.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[var(--text-subtle)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{filteredRepos.length}</span> of{' '}
            <span className="font-semibold text-[var(--text-primary)]">{totalCount.toLocaleString()}</span> projects
          </p>
          {hasMore && (
            <span className="text-[10px] text-[var(--text-subtle)] flex items-center gap-1">
              <ChevronDown className="w-3 h-3 animate-bounce" />
              Scroll for more
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-16">
          <Eye className="w-12 h-12 mx-auto text-[var(--text-subtle)] mb-4" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">No projects found</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo, i) => (
              <ProjectCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={`loading-${i}`} />
              ))}
            </div>
          )}

          {/* Load More button (fallback for users who don't scroll) */}
          {hasMore && !loadingMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={loadMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:shadow-md transition-all"
              >
                <ChevronDown className="w-4 h-4" />
                Load More Projects
              </button>
            </div>
          )}

          {!hasMore && repos.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-xs text-[var(--text-subtle)]">
                You&apos;ve reached the end — try a different search to discover more!
              </p>
            </div>
          )}
        </>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-[11px] text-[var(--text-subtle)]">
          Powered by GitHub API — {totalCount.toLocaleString()} repositories matched your query
        </p>
      </div>
    </div>
  );
}
