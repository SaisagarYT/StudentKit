'use client';

import { useState } from 'react';
import { Award, BookOpen, Percent, Calculator, GraduationCap } from 'lucide-react';
import { CGPAForm } from '@/features/cgpa/cgpa-form';
import { SGPAForm } from '@/features/sgpa/sgpa-form';
import { CGPAToPercentageForm } from '@/features/percentage/cgpa-to-percentage-form';
import { MarksPercentageForm } from '@/features/percentage/marks-percentage-form';

export type AcademicTab = 'cgpa' | 'sgpa' | 'percentage' | 'marks';

interface UnifiedAcademicCalculatorProps {
  initialTab?: AcademicTab;
}

const TABS: { id: AcademicTab; label: string; shortLabel: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'sgpa',
    label: 'Semester SGPA',
    shortLabel: 'SGPA',
    icon: BookOpen,
    description: 'Calculate your semester GPA with subject grade points and credit hours.',
  },
  {
    id: 'cgpa',
    label: 'Cumulative CGPA',
    shortLabel: 'CGPA',
    icon: Award,
    description: 'Calculate cumulative GPA across multiple semesters with credit weighting.',
  },
  {
    id: 'percentage',
    label: 'CGPA ⇄ Percentage',
    shortLabel: 'CGPA to %',
    icon: Percent,
    description: 'Convert CGPA to percentage using standard (9.5×, 10×) or university formulas.',
  },
  {
    id: 'marks',
    label: 'Marks & Percentage',
    shortLabel: 'Marks %',
    icon: Calculator,
    description: 'Calculate percentage from marks obtained and total marks with clear pass/fail margins.',
  },
];

export function UnifiedAcademicCalculator({ initialTab = 'cgpa' }: UnifiedAcademicCalculatorProps) {
  const [activeTab, setActiveTab] = useState<AcademicTab>(initialTab);

  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-1.5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mode Subheader */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)] px-1">
        <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-dark)] shrink-0" />
        <span>Active Mode: <strong className="text-[var(--text-primary)]">{currentTabInfo.label}</strong> — {currentTabInfo.description}</span>
      </div>

      {/* Calculator Body */}
      <div className="transition-all">
        {activeTab === 'sgpa' && <SGPAForm />}
        {activeTab === 'cgpa' && <CGPAForm />}
        {activeTab === 'percentage' && <CGPAToPercentageForm />}
        {activeTab === 'marks' && <MarksPercentageForm />}
      </div>
    </div>
  );
}