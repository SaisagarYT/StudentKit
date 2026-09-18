'use client';

import { Hammer, Layers, CheckCircle2, Code2, Rocket, ShieldAlert } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface ProjectsHeaderProps {
  total: number;
  beginnerCount: number;
  intermediateCount: number;
  advancedCount: number;
  expertCount: number;
}

export function ProjectsHeader({
  total,
  beginnerCount,
  intermediateCount,
  advancedCount,
  expertCount,
}: ProjectsHeaderProps) {
  return (
    <div className="mb-10">
      {/* Target Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-5">
        <Hammer className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Build & Learn • Portfolio Hub
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
        Project <span className="font-serif italic font-normal">Architectures</span>
      </h1>
      <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
        Curated engineering projects with production architecture specifications, step-by-step milestones, and real-world tech stacks.
      </p>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
        <div className="p-3.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[var(--text-subtle)]">
            <Layers className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Total</span>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
            <AnimatedCounter value={total} />
          </span>
        </div>

        <div className="p-3.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[var(--text-subtle)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Beginner</span>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
            <AnimatedCounter value={beginnerCount} />
          </span>
        </div>

        <div className="p-3.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[var(--text-subtle)]">
            <Code2 className="w-3.5 h-3.5 text-[var(--color-warning)]" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Intermediate</span>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
            <AnimatedCounter value={intermediateCount} />
          </span>
        </div>

        <div className="p-3.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[var(--text-subtle)]">
            <Rocket className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Advanced</span>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
            <AnimatedCounter value={advancedCount} />
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1 text-[var(--text-subtle)]">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-error)]" />
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Expert</span>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
            <AnimatedCounter value={expertCount} />
          </span>
        </div>
      </div>
    </div>
  );
}

