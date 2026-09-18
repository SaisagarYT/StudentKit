'use client';

import { Monitor, Globe, GitBranch, Terminal, ArrowRight, CheckCircle2, type LucideIcon } from 'lucide-react';

const PREREQUISITES = [
  'Basic computer literacy and file management',
  'Code editor installed (VS Code recommended)',
  'Web browser with Developer Tools',
  'Basic familiarity with command-line / terminal',
];

interface ToolItem {
  label: string;
  icon: LucideIcon;
}

const TOOLS: ToolItem[] = [
  { label: 'VS Code (Editor)', icon: Monitor },
  { label: 'Chrome DevTools', icon: Globe },
  { label: 'Git & GitHub', icon: GitBranch },
  { label: 'Terminal / CLI', icon: Terminal },
];

export function RoadmapPrerequisites() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Prerequisites Card */}
      <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-dark)]" />
          <span>Prerequisites</span>
        </h3>
        <ul className="space-y-2 mb-4">
          {PREREQUISITES.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)] shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a
          href="/start"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-dark)] hover:underline"
        >
          <span>Need a starting guide? Begin here</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Recommended Tools Card */}
      <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--accent-dark)]" />
          <span>Recommended Tools</span>
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Essential developer setup recommended before starting this curriculum:
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
              >
                <Icon className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                <span>{tool.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

