'use client';

import { Target, Quote, CheckCircle2 } from 'lucide-react';
import type { StarStep } from '@/config/placement/interview';

interface InterviewStarViewProps {
  steps: StarStep[];
}

export function InterviewStarView({ steps }: InterviewStarViewProps) {
  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-5 sm:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              The STAR Behavioral Framework
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              Used by hiring managers and bar-raisers at Amazon, Google, Meta, and top startups. Every behavioral response (&ldquo;Tell me about a time when...&rdquo;) should be structured using this 4-step sequence to clearly prove your individual impact.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => {
          const letter = step.step.charAt(0);

          return (
            <div
              key={step.step}
              className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all hover:border-[var(--border-default)]"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-md bg-[var(--accent-dark)] text-[var(--text-inverse)] font-mono font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {letter}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      {step.step}
                    </h3>
                    <span className="text-[11px] font-mono text-[var(--text-subtle)]">
                      Stage {idx + 1} of 4
                    </span>
                  </div>
                </div>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {/* Concrete Example Box */}
              <div className="p-3.5 rounded-md border-l-2 border-[var(--accent-dark)] bg-[var(--bg-subtle)]/70 mt-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-1">
                  <Quote className="w-3 h-3 text-[var(--accent-dark)]" />
                  <span>Practical Example</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">
                  &ldquo;{step.example}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Behavioral Strategy Pro-Tip Card */}
      <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)]/40 p-5">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
          <span>The 20 / 60 / 20 Rule for Behavioral Success</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-secondary)] mt-3">
          <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)]">
            <strong className="block text-[var(--text-primary)] font-semibold mb-1">
              20% Situation & Task
            </strong>
            Keep the context concise. Do not spend more than 30 seconds setting the scene.
          </div>
          <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)]">
            <strong className="block text-[var(--text-primary)] font-semibold mb-1">
              60% Action (Crucial)
            </strong>
            Focus strictly on what <em>you</em> did — use &ldquo;I&rdquo;, not &ldquo;we&rdquo;. Detail your technical and organizational choices.
          </div>
          <div className="p-3 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)]">
            <strong className="block text-[var(--text-primary)] font-semibold mb-1">
              20% Result & Metrics
            </strong>
            Always state measurable outcomes (e.g., latency -40%, 10k users, 99.9% uptime, saved \$5,000/mo).
          </div>
        </div>
      </div>
    </div>
  );
}
