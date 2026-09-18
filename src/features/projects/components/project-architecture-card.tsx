'use client';

import { useState } from 'react';
import { Layers, Copy, Check } from 'lucide-react';

interface ProjectArchitectureCardProps {
  architecture: string;
}

export function ProjectArchitectureCard({ architecture }: ProjectArchitectureCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(architecture);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write fail
    }
  };

  return (
    <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              System Architecture & Data Flow
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              High-level component topology and asynchronous message boundaries
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors cursor-pointer shrink-0"
          aria-label="Copy architecture diagram"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Spec</span>
            </>
          )}
        </button>
      </div>

      {/* Monospace Architecture Box */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/70 p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-[var(--text-primary)] leading-relaxed whitespace-pre font-normal">
          {architecture}
        </pre>
      </div>
    </div>
  );
}

