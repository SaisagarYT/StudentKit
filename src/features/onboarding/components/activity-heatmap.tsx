'use client';

import { useMemo } from 'react';
import { Calendar, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface ActivityHeatmapProps {
  totalActiveDays: number;
  currentStreak: number;
}

export function ActivityHeatmap({ totalActiveDays, currentStreak }: ActivityHeatmapProps) {
  // Generate 60 days of activity squares ending today
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 59; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const isRecentStreak = i < currentStreak;
      // Activity level 0 to 4 (deterministic)
      const level = isRecentStreak ? (((i * 3 + 1) % 3) + 2) : (i % 6 === 0 ? 1 : 0);
      result.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        level,
      });
    }
    return result;
  }, [currentStreak]);

  const levelColors = [
    'bg-[var(--bg-subtle)] border border-[var(--border-soft)]',
    'bg-[var(--accent-dark)]/20 border border-[var(--border-soft)]',
    'bg-[var(--accent-dark)]/45 border border-[var(--border-soft)]',
    'bg-[var(--accent-dark)]/75 border border-[var(--border-default)]',
    'bg-[var(--accent-dark)] border border-[var(--accent-dark)]',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="p-5 md:p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Consistency Calendar</span>
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Learning Activity Heatmap
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
          <span className="flex items-center gap-1 text-[var(--text-primary)] font-mono">
            <Flame className="w-3.5 h-3.5 text-[var(--accent-dark)] fill-current" />
            {currentStreak}-day active streak
          </span>
          <span>•</span>
          <span className="font-mono">{totalActiveDays} total active days</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-[500px]">
          {days.map((d, idx) => (
            <div
              key={idx}
              title={`${d.date} — Level ${d.level} activity`}
              className={`w-3.5 h-3.5 rounded-[2px] transition-all hover:scale-125 cursor-pointer ${
                levelColors[d.level]
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[var(--border-soft)] text-[11px] text-[var(--text-subtle)]">
        <span>Last 60 days</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {levelColors.map((col, idx) => (
            <div key={idx} className={`w-2.5 h-2.5 rounded-[1px] ${col}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
}
