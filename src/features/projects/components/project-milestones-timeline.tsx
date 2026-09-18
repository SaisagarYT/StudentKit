'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, CheckCircle2, ListTodo, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { logXpEvent } from '@/lib/xp';
import { emitProgressChanged } from '@/lib/firebase/user-progress-sync';
import type { ProjectMilestone } from '@/config/projects';

interface ProjectMilestonesTimelineProps {
  projectSlug: string;
  milestones: ProjectMilestone[];
}

function getStorageKey(slug: string) {
  return `sk-project-progress-${slug}`;
}

function loadProgress(slug: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getStorageKey(slug));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(slug: string, progress: Record<string, boolean>) {
  try {
    localStorage.setItem(getStorageKey(slug), JSON.stringify(progress));
    emitProgressChanged();
  } catch {
    // fail silently
  }
}

export function ProjectMilestonesTimeline({
  projectSlug,
  milestones,
}: ProjectMilestonesTimelineProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress(projectSlug));
    setMounted(true);
  }, [projectSlug]);

  const allTasks = milestones.flatMap((m, mIdx) =>
    m.tasks.map((task, tIdx) => ({
      id: `${mIdx}-${tIdx}`,
      task,
      milestoneTitle: m.title,
    }))
  );

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => progress[t.id]).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTask = useCallback(
    (taskId: string, taskTitle: string) => {
      setProgress((prev) => {
        const next = { ...prev, [taskId]: !prev[taskId] };
        saveProgress(projectSlug, next);
        if (next[taskId]) {
          logXpEvent('PROJECT_MILESTONE', `Completed: ${taskTitle.slice(0, 30)}`);
        }
        return next;
      });
    },
    [projectSlug]
  );

  return (
    <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs p-5 sm:p-6 mb-8">
      {/* Header with Title and Progress Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-soft)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--accent-dark)] shrink-0">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Build Milestones & Step-by-Step Roadmap
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Follow chronological deliverables from architecture to deployment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs font-mono text-[var(--text-subtle)]">
              <AnimatedCounter value={mounted ? completedTasks : 0} /> / {totalTasks} tasks
            </span>
          </div>
          <span className="text-lg font-mono font-bold text-[var(--text-primary)]">
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="py-4">
        <Progress value={mounted ? completedTasks : 0} max={totalTasks} className="h-2" />
      </div>

      {/* Milestones List */}
      <div className="space-y-6 mt-4">
        {milestones.map((milestone, mIdx) => {
          const milestoneTasks = milestone.tasks.map((t, tIdx) => ({
            id: `${mIdx}-${tIdx}`,
            text: t,
            completed: !!progress[`${mIdx}-${tIdx}`],
          }));

          const milestoneCompleted = milestoneTasks.every((t) => t.completed);

          return (
            <div
              key={mIdx}
              className="relative pl-7 sm:pl-8 border-l-2 border-[var(--border-soft)] last:border-transparent pb-6 last:pb-0"
            >
              {/* Step indicator node on the vertical spine */}
              <div
                className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                  milestoneCompleted
                    ? 'bg-[var(--color-success)] border-[var(--bg-surface)] text-white'
                    : 'bg-[var(--accent-dark)] border-[var(--bg-surface)] text-[var(--text-inverse)]'
                }`}
              >
                {milestoneCompleted ? (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                ) : (
                  mIdx + 1
                )}
              </div>

              {/* Milestone Banner */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {milestone.title}
                  </h3>
                  {milestoneCompleted && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-success)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Tasks Checklist */}
              {milestone.tasks.length > 0 && (
                <div className="space-y-2 mt-3 bg-[var(--bg-subtle)]/50 border border-[var(--border-soft)] rounded-md p-3">
                  {milestoneTasks.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-start gap-3 p-2 rounded-sm hover:bg-[var(--bg-surface)] cursor-pointer transition-colors select-none group"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id, t.text)}
                        className={`mt-0.5 w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          t.completed
                            ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                            : 'border-[var(--border-default)] group-hover:border-[var(--accent-dark)] bg-[var(--bg-surface)]'
                        }`}
                        aria-label={t.completed ? 'Mark task incomplete' : 'Mark task complete'}
                      >
                        {t.completed && (
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        )}
                      </button>

                      <span
                        className={`text-xs leading-relaxed transition-colors ${
                          t.completed
                            ? 'line-through text-[var(--text-subtle)]'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {t.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {completedTasks === totalTasks && totalTasks > 0 && (
        <div className="mt-8 p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-center shadow-xs">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--color-success)] mb-2.5">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            Project Completed!
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            You&apos;ve completed all milestones for this project. Add it to your resume and share your GitHub repository!
          </p>
        </div>
      )}
    </div>
  );
}

