'use client';

import { Monitor, Database, Globe, Boxes, BookOpen, type LucideIcon } from 'lucide-react';
import type { CsSubject } from '@/config/placement/cs-fundamentals';

interface CsSubjectTabsProps {
  subjects: CsSubject[];
  activeSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  getSubjectProgress: (subject: CsSubject) => { total: number; done: number; percent: number };
  mounted: boolean;
}

const subjectIconMap: Record<string, LucideIcon> = {
  Monitor,
  Database,
  Globe,
  Boxes,
};

export function CsSubjectTabs({
  subjects,
  activeSubjectId,
  onSelectSubject,
  getSubjectProgress,
  mounted,
}: CsSubjectTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
      {subjects.map((subject) => {
        const isActive = activeSubjectId === subject.id;
        const IconComponent = subjectIconMap[subject.icon] || BookOpen;
        const { percent } = getSubjectProgress(subject);

        return (
          <button
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-md border text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[var(--accent-dark)] border-[var(--accent-dark)] text-[var(--text-inverse)] shadow-sm'
                : 'bg-[var(--bg-surface)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            <IconComponent className="w-4 h-4 shrink-0" />
            <span>{subject.title}</span>
            {mounted && percent > 0 && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[var(--text-inverse)]/20 text-[var(--text-inverse)]'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)]'
                }`}
              >
                {percent}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

