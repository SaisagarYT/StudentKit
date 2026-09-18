'use client';

import { HelpCircle, Building2, Target, FileText, type LucideIcon } from 'lucide-react';

export type InterviewTabType = 'questions' | 'companies' | 'star' | 'resume';

interface InterviewTabsNavProps {
  activeTab: InterviewTabType;
  onSelectTab: (tab: InterviewTabType) => void;
  counts: {
    questions: number;
    companies: number;
    star: number;
    resume: number;
  };
}

interface TabItem {
  id: InterviewTabType;
  label: string;
  icon: LucideIcon;
  count: number;
}

export function InterviewTabsNav({ activeTab, onSelectTab, counts }: InterviewTabsNavProps) {
  const tabs: TabItem[] = [
    {
      id: 'questions',
      label: 'Questions & Answers',
      icon: HelpCircle,
      count: counts.questions,
    },
    {
      id: 'companies',
      label: 'Company Loops',
      icon: Building2,
      count: counts.companies,
    },
    {
      id: 'star',
      label: 'STAR Framework',
      icon: Target,
      count: counts.star,
    },
    {
      id: 'resume',
      label: 'Resume Checklist',
      icon: FileText,
      count: counts.resume,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-md border text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[var(--accent-dark)] border-[var(--accent-dark)] text-[var(--text-inverse)] shadow-sm'
                : 'bg-[var(--bg-surface)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                isActive
                  ? 'bg-[var(--text-inverse)]/20 text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

