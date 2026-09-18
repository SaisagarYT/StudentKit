'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight, Target, Binary, Route, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface DailySprintBarProps {
  dsaSolvedToday: boolean;
  roadmapTopicDoneToday: boolean;
  projectTaskDoneToday: boolean;
}

export function DailySprintBar({
  dsaSolvedToday,
  roadmapTopicDoneToday,
  projectTaskDoneToday,
}: DailySprintBarProps) {
  const tasks = [
    {
      id: 'dsa',
      title: 'Solve Daily DSA Challenge',
      xp: '+50 XP',
      completed: dsaSolvedToday,
      href: '/challenges',
      icon: Binary,
    },
    {
      id: 'roadmap',
      title: 'Complete 1 Roadmap Lesson',
      xp: '+30 XP',
      completed: roadmapTopicDoneToday,
      href: '/roadmaps',
      icon: Route,
    },
    {
      id: 'project',
      title: 'Review 1 Core CS Topic',
      xp: '+25 XP',
      completed: projectTaskDoneToday,
      href: '/placement/cs-fundamentals',
      icon: Target,
    },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const percent = Math.round((completedCount / tasks.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="p-5 md:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Daily Sprint Target
            </h3>
            {completedCount === tasks.length ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded-sm">
                <Trophy className="w-3 h-3" /> All Goals Achieved!
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-[var(--text-subtle)] font-mono">
                {completedCount} of {tasks.length} completed
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Complete your daily micro-goals to maintain consistency and boost your XP multiplier.
          </p>
        </div>

        {/* Mini progress meter */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-28 sm:w-36 h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-[var(--accent-dark)] rounded-full"
            />
          </div>
          <span className="text-xs font-bold font-mono text-[var(--text-primary)] tabular-nums">
            {percent}%
          </span>
        </div>
      </div>

      {/* Task cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tasks.map((task) => {
          return (
            <Link
              key={task.id}
              href={task.href}
              className={`group flex items-center justify-between p-3.5 rounded-md border transition-all ${
                task.completed
                  ? 'bg-[var(--bg-subtle)]/70 border-[var(--border-default)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-soft)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--text-secondary)]" />
                  )}
                </div>
                <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
                  <task.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      task.completed
                        ? 'text-[var(--text-subtle)] line-through'
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="text-[10px] font-mono font-semibold text-[var(--text-subtle)]">
                    {task.xp}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

