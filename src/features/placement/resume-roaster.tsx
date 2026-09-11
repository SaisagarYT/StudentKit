'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Share2,
  ArrowRight,
  RefreshCw,
  Zap,
  TrendingUp,
  Award,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logXpEvent } from '@/lib/xp';

interface RoastResult {
  score: number;
  verdict: string;
  verdictColor: string;
  roastQuote: string;
  flags: {
    label: string;
    type: 'error' | 'warning' | 'success';
    message: string;
  }[];
  starRewrites: {
    title: string;
    bullet: string;
    metricsHighlighted: string;
  }[];
  recommendedProject: {
    title: string;
    slug: string;
    reason: string;
  };
}

const PRESETS = [
  {
    label: 'Basic To-Do App',
    emoji: '📝',
    text: 'Built a responsive To-Do List web application using React and CSS where users can add, delete, and mark tasks as completed.',
  },
  {
    label: 'Weather App',
    emoji: '🌦️',
    text: 'Developed a weather forecasting app using JavaScript and OpenWeatherMap API with nice UI to display temperature.',
  },
  {
    label: 'Generic E-Commerce',
    emoji: '🛒',
    text: 'Created full stack e-commerce website with Node.js and MongoDB. Implemented user authentication and shopping cart.',
  },
  {
    label: 'Basic Portfolio',
    emoji: '🎨',
    text: 'Designed personal portfolio website using HTML, CSS, and Bootstrap to showcase my college projects and resume.',
  },
  {
    label: 'Production-Grade System',
    emoji: '⚡',
    text: 'Architected an in-memory distributed token-bucket rate limiter in TypeScript handling 10,000+ RPS with Redis atomic operations, reducing abusive client traffic by 99.4% with sub-2ms overhead.',
  },
];

const WEAK_VERBS = [
  'worked on', 'helped with', 'responsible for', 'assisted', 'created', 'made', 'built', 'developed', 'used', 'designed', 'wrote'
];

const STRONG_VERBS = [
  'architected', 'engineered', 'orchestrated', 'benchmarked', 'optimized', 'scaled', 'implemented', 'refactored', 'streamlined', 'automated', 'deployed', 'containerized'
];

function analyzeBullet(text: string): RoastResult {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) {
    return {
      score: 0,
      verdict: 'No Input',
      verdictColor: 'text-[var(--text-subtle)]',
      roastQuote: 'Paste a project or experience bullet from your resume to begin.',
      flags: [],
      starRewrites: [],
      recommendedProject: {
        title: 'In-Memory Rate Limiter',
        slug: 'in-memory-rate-limiter',
        reason: 'Master distributed systems and high-throughput concurrency.'
      }
    };
  }

  // 1. Cliché Check
  const isTodo = lower.includes('to-do') || lower.includes('todo') || lower.includes('task list');
  const isWeather = lower.includes('weather') || lower.includes('forecast');
  const isCalculator = lower.includes('calculator') || lower.includes('calc');
  const isClone = lower.includes('clone') || lower.includes('netflix') || lower.includes('spotify') || lower.includes('amazon clone');
  const isCliche = isTodo || isWeather || isCalculator || isClone;

  // 2. Metrics & Numbers Check
  const hasNumbers = /\d+([%kKmMbBmsxX]|(\.\d+))?/.test(trimmed) && (trimmed.match(/\d+/g) || []).length > 0;
  const hasLatency = lower.includes('ms') || lower.includes('latency') || lower.includes('fps') || lower.includes('seconds') || lower.includes('throughput') || lower.includes('rps') || lower.includes('qps');
  const hasPercent = lower.includes('%') || lower.includes('percent');
  const hasMetrics = hasNumbers || hasLatency || hasPercent;

  // 3. Verb Strength Check
  const startsWithWeakVerb = WEAK_VERBS.some(v => lower.startsWith(v) || lower.startsWith('i ' + v));
  const hasStrongVerb = STRONG_VERBS.some(v => lower.includes(v));

  // 4. Length Check
  const wordCount = trimmed.split(/\s+/).length;
  const isTooShort = wordCount < 10;
  const isTooLong = wordCount > 55;

  // 5. Tech Stack Depth
  const hasModernStack = lower.includes('redis') || lower.includes('docker') || lower.includes('postgres') || lower.includes('websocket') || lower.includes('concurrency') || lower.includes('kafka') || lower.includes('ci/cd') || lower.includes('oauth') || lower.includes('jwt') || lower.includes('indexeddb');

  // Compute Score (0 - 100)
  let score = 50;

  if (isCliche) score -= 25;
  if (!hasMetrics) score -= 20;
  if (hasMetrics) score += 15;
  if (hasLatency || hasPercent) score += 10;
  if (startsWithWeakVerb) score -= 15;
  if (hasStrongVerb) score += 15;
  if (hasModernStack) score += 15;
  if (isTooShort) score -= 15;
  if (isTooLong) score -= 10;

  score = Math.max(8, Math.min(98, score));

  // Flags
  const flags: RoastResult['flags'] = [];

  if (isCliche) {
    flags.push({
      label: 'Tutorial Cliché Detected',
      type: 'error',
      message: 'This project scream "I copied a 30-minute 2019 YouTube video". Recruiters review 500 of these every week.',
    });
  } else {
    flags.push({
      label: 'Unique Concept',
      type: 'success',
      message: 'Avoided the standard junior tutorial project clichés.',
    });
  }

  if (!hasMetrics) {
    flags.push({
      label: 'Zero Quantifiable Impact (No Numbers)',
      type: 'error',
      message: 'Recruiters and ATS algorithms score resume bullets on the X-Y-Z formula: Accomplished [X], measured by [Y], by doing [Z]. Add percentages, latency reduction, user counts, or throughput.',
    });
  } else {
    flags.push({
      label: 'Includes Quantifiable Metrics',
      type: 'success',
      message: 'Excellent use of numbers and benchmarks to establish tangible engineering value.',
    });
  }

  if (startsWithWeakVerb) {
    flags.push({
      label: 'Passive Action Verb',
      type: 'warning',
      message: `Avoid opening with "${trimmed.split(' ')[0]}". Start with punchy power verbs like "Architected", "Engineered", "Orchestrated", or "Optimized".`,
    });
  } else if (hasStrongVerb) {
    flags.push({
      label: 'Strong Technical Power Verb',
      type: 'success',
      message: 'Demonstrates engineering leadership and decisive execution.',
    });
  }

  if (!hasModernStack && !isCliche) {
    flags.push({
      label: 'Vague Architecture Specifics',
      type: 'warning',
      message: 'Specify the architectural nuance: Did you use optimistic UI updates? WebSockets? Indexing? Connection pooling? Background workers?',
    });
  }

  // Roast Quote & Verdict
  let verdict = 'Needs Total Surgery';
  let verdictColor = 'text-red-500';
  let roastQuote = '';

  if (score < 40) {
    verdict = 'Instant Recruiter Trash Bin 💀';
    verdictColor = 'text-red-500';
    if (isTodo) {
      roastQuote = 'A To-Do app on a 2026 CS resume is like applying to be an executive chef by proving you can boil water without burning down the kitchen. It tells the team you know React syntax, but know nothing about distributed state or real engineering.';
    } else if (isWeather) {
      roastQuote = 'You made an API call to OpenWeatherMap and mapped JSON into 3 div tags. That is an introductory tutorial, not an engineering achievement. Where is client-side caching? Where are fallback offline strategies?';
    } else {
      roastQuote = 'This bullet is completely passive. It describes what the software did rather than what YOU engineered, what bottlenecks you solved, or why anyone should care.';
    }
  } else if (score < 75) {
    verdict = 'Average / Easily Overlooked 😐';
    verdictColor = 'text-amber-500';
    roastQuote = 'Decent start, but it sounds like 85% of all college applicants. A recruiter skimming for 6 seconds will forget this immediately because there are no benchmarked metrics or architectural highlights.';
  } else {
    verdict = 'FAANG / Tier-1 Ready 🔥';
    verdictColor = 'text-emerald-500';
    roastQuote = 'Now this is an engineering bullet! High-velocity verbs, crisp quantifiable impact, clear architectural constraints, and quantifiable metrics. This gets past ATS screens and hooks hiring managers.';
  }

  // Generate STAR rewrites based on the input
  let starRewrites: RoastResult['starRewrites'] = [];
  let recProject = {
    title: 'In-Memory Rate Limiter',
    slug: 'in-memory-rate-limiter',
    reason: 'Showcase distributed algorithms, concurrency handling, and sub-millisecond benchmarking.'
  };

  if (isTodo) {
    recProject = {
      title: 'Kanban Task Board Engine',
      slug: 'kanban-task-board',
      reason: 'Replaces basic to-dos with enterprise drag-and-drop, optimistic reconciliation, and collision handling.'
    };
    starRewrites = [
      {
        title: 'Optimistic UI & State Architecture',
        bullet: 'Architected an asynchronous Kanban state engine with optimistic mutations and offline-first IndexedDB persistence, achieving <16ms frame render times and zero data loss across 1,000+ mock operations.',
        metricsHighlighted: '<16ms frame budget, 1,000+ ops persistence'
      },
      {
        title: 'Concurrent Conflict Resolution',
        bullet: 'Engineered a client-side CRDT synchronization layer for distributed task updates, resolving concurrent edits with sub-10ms reconciliation latency and 100% test coverage with Vitest.',
        metricsHighlighted: 'Sub-10ms reconciliation, 100% test coverage'
      }
    ];
  } else if (isWeather) {
    recProject = {
      title: 'In-Memory Rate Limiter & Cache',
      slug: 'in-memory-rate-limiter',
      reason: 'Turn external API consumers into resilient caching proxies with token-bucket rate limits.'
    };
    starRewrites = [
      {
        title: 'Resilient Proxy & Caching Layer',
        bullet: 'Engineered a multi-tier weather telemetry proxy with sliding-window Redis caching and exponential backoff retry logic, reducing external API payload costs by 84% and cutting P99 latency from 450ms to 18ms.',
        metricsHighlighted: '84% API cost reduction, 450ms → 18ms P99 latency'
      }
    ];
  } else if (isClone || lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('store')) {
    recProject = {
      title: 'Fullstack E-Commerce Store',
      slug: 'fullstack-ecommerce-store',
      reason: 'Implement Stripe webhook idempotency, ACID inventory transactions, and cart virtualization.'
    };
    starRewrites = [
      {
        title: 'Idempotent Payments & Stock Isolation',
        bullet: 'Engineered transactional checkout flow utilizing Stripe Webhooks with Redis idempotency keys and PostgreSQL row-level locking, preventing phantom inventory orders during concurrent flash-sale load testing at 2,500 RPS.',
        metricsHighlighted: 'Zero double-spend bugs, 2,500 RPS benchmark'
      }
    ];
  } else {
    starRewrites = [
      {
        title: 'High-Impact STAR Formula Rewrite',
        bullet: `Architected and benchmarked a high-throughput backend service using modern distributed design patterns, improving end-to-end request latency by 62% and sustaining 4,000+ concurrent requests under load.`,
        metricsHighlighted: '62% latency improvement, 4,000+ concurrent requests'
      },
      {
        title: 'Infrastructure & Reliability Focus',
        bullet: `Containerized and automated CI/CD deployment pipelines with automated regression suites, cutting production deployment lead time by 75% while maintaining 99.9% test reliability.`,
        metricsHighlighted: '75% deployment cycle reduction, 99.9% uptime'
      }
    ];
  }

  return {
    score,
    verdict,
    verdictColor,
    roastQuote,
    flags,
    starRewrites,
    recommendedProject: recProject
  };
}

export function ResumeRoaster() {
  const [input, setInput] = useState(PRESETS[0].text);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  const analysis = useMemo(() => analyzeBullet(input), [input]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    logXpEvent('RESUME_ROASTER', 'Copied STAR resume bullet');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = () => {
    const shareText = `My project bullet scored ${analysis.score}/100 on the StudentKit ATS Resume Roaster: "${analysis.verdict}" 💀\n\nRoast yours at: https://studentkit.me/placement/resume-roaster`;
    if (navigator.share) {
      navigator.share({
        title: 'StudentKit ATS Project Roaster',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Career & Resume Studio Switcher */}
      <div className="flex items-center justify-between p-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] flex-wrap gap-2 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--accent-primary)] shadow-sm">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            AI Resume Roaster & ATS Scorer
          </span>
          <Link
            href="/resume-builder"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
            ATS Resume Builder →
          </Link>
        </div>
        <Link
          href="/resume-builder"
          className="text-xs text-[var(--accent-dark)] hover:underline font-medium px-3 hidden sm:inline"
        >
          Building a full resume? Open Builder →
        </Link>
      </div>

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
            <Flame className="w-3.5 h-3.5" />
            ATS Reality Check
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            STAR Framework Generator
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Audit & Roast Your Resume Project Bullets
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Recruiters spend an average of 6 seconds reviewing your resume. Bullets like <span className="font-mono text-xs bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded text-red-400">&quot;Created a To-Do app with React&quot;</span> get rejected on sight. Test your project descriptions below to see your ATS score, read a brutal critique, and get high-impact rewrites with quantified metrics.
        </p>

        {/* Quick Presets */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2.5">
            Or test common resume clichés:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setInput(preset.text)}
                className={cn(
                  'px-3 py-1.5 rounded-sm text-xs font-medium border transition-all flex items-center gap-1.5',
                  input === preset.text
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--text-primary)]'
                    : 'border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
                )}
              >
                <span>{preset.emoji}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="mt-6">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a resume bullet or project description here..."
              rows={4}
              className="w-full p-4 rounded-sm border border-[var(--border-default)] bg-[var(--bg-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all font-sans leading-relaxed"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                onClick={() => setInput('')}
                className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-soft)]"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-subtle)]">
            <span>{input.trim() ? input.trim().split(/\s+/).length : 0} words • {input.length} characters</span>
            <span>Recommended: 20-40 words per bullet</span>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Score & Roast */}
        <div className="lg:col-span-5 space-y-6">
          {/* Score Card */}
          <div className="p-6 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] text-center relative overflow-hidden">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
              ATS & Hiring Manager Score
            </div>

            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className={cn('text-6xl font-extrabold tracking-tight', analysis.verdictColor)}>
                {analysis.score}
              </span>
              <span className="text-xl text-[var(--text-subtle)] font-medium">/100</span>
            </div>

            <div className={cn('mt-2 text-base font-bold', analysis.verdictColor)}>
              {analysis.verdict}
            </div>

            {/* Score Bar */}
            <div className="mt-5 w-full bg-[var(--bg-subtle)] h-2.5 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-700 ease-out rounded-full',
                  analysis.score < 40 ? 'bg-red-500' : analysis.score < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                )}
                style={{ width: `${analysis.score}%` }}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 pt-5 border-t border-[var(--border-soft)] flex items-center justify-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-medium border border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                {shareFeedback ? 'Copied to Clipboard!' : 'Share Your Score'}
              </button>
            </div>
          </div>

          {/* The Roast */}
          <div className="p-6 rounded-sm border border-red-500/20 bg-red-500/5 relative">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">
                Senior Staff Interviewer Roast
              </h3>
            </div>
            <blockquote className="text-sm text-[var(--text-primary)] leading-relaxed italic border-l-2 border-red-500/40 pl-3.5 my-2">
              &ldquo;{analysis.roastQuote}&rdquo;
            </blockquote>
          </div>

          {/* Diagnostic Flags */}
          <div className="p-6 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Bullet Breakdown Checklist
            </h3>
            {analysis.flags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                {flag.type === 'error' && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                {flag.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                {flag.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{flag.label}</div>
                  <div className="text-[var(--text-secondary)] mt-0.5">{flag.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: High-Impact STAR Rewrites & Guided Upgrade */}
        <div className="lg:col-span-7 space-y-6">
          {/* STAR Rewrites */}
          <div className="p-6 md:p-8 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                  Google & Amazon Formula
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                  Optimized STAR Method Rewrites
                </h3>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 font-medium">
                X-Y-Z Standard
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
              Use Google&apos;s proven formula: <span className="font-semibold text-[var(--text-primary)]">&quot;Accomplished [X] as measured by [Y] by doing [Z]&quot;</span>. Click to copy either optimized bullet directly to your resume:
            </p>

            <div className="space-y-4">
              {analysis.starRewrites.map((rewrite, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Variant {idx + 1}: {rewrite.title}
                    </span>
                    <button
                      onClick={() => handleCopy(rewrite.bullet, idx)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] hover:underline"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Bullet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-[var(--text-primary)] font-mono leading-relaxed bg-[var(--bg-surface)] p-3 rounded-sm border border-[var(--border-soft)]">
                    &bull; {rewrite.bullet}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span><strong className="text-[var(--text-primary)]">Metrics Highlighted:</strong> {rewrite.metricsHighlighted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Upgrade Recommendation Banner */}
          <div className="p-6 rounded-sm border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                Recruiter Proof Project Upgrade
              </span>
            </div>

            <h4 className="text-base font-bold text-[var(--text-primary)]">
              Build a real system: {analysis.recommendedProject.title}
            </h4>
            <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
              {analysis.recommendedProject.reason} Get full architectural specifications, data flows, edge cases, and test suites.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href={`/projects/${analysis.recommendedProject.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:bg-[var(--accent-primary)] hover:text-black transition-all"
              >
                View Project Specification
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/projects"
                className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4"
              >
                Browse all 5 Guided Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

