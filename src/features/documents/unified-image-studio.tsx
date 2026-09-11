'use client';

import { useState } from 'react';
import { PenTool, ImageDown, Maximize2, Sparkles, FileImage } from 'lucide-react';
import { SignatureResizerForm } from '@/features/image-processing/signature-resizer-form';
import { CompressorForm } from '@/features/image-processing/compressor-form';
import { ResizerForm } from '@/features/image-processing/resizer-form';

export type ImageStudioTab = 'exam' | 'compress' | 'resize';

interface UnifiedImageStudioProps {
  initialTab?: ImageStudioTab;
}

const TABS: { id: ImageStudioTab; label: string; shortLabel: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'exam',
    label: 'Exam & Form Presets',
    shortLabel: 'Exam Presets',
    icon: PenTool,
    description: '1-click dimensions and strict KB limits for UPSC, GATE, SSC, JEE, and Passport photos.',
  },
  {
    id: 'compress',
    label: 'Image Compressor',
    shortLabel: 'Compress',
    icon: ImageDown,
    description: 'Compress image file size directly in your browser without uploading to any server.',
  },
  {
    id: 'resize',
    label: 'Dimension Resizer',
    shortLabel: 'Resize',
    icon: Maximize2,
    description: 'Resize image width and height to exact pixel dimensions with aspect ratio lock.',
  },
];

export function UnifiedImageStudio({ initialTab = 'exam' }: UnifiedImageStudioProps) {
  const [activeTab, setActiveTab] = useState<ImageStudioTab>(initialTab);

  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-1.5 shadow-sm">
        <div className="grid grid-cols-3 gap-1.5">
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
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mode Subheader */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)] px-1">
        <FileImage className="w-3.5 h-3.5 text-[var(--accent-dark)] shrink-0" />
        <span>Active Studio Tool: <strong className="text-[var(--text-primary)]">{currentTabInfo.label}</strong> — {currentTabInfo.description}</span>
      </div>

      {/* Studio Body */}
      <div className="transition-all">
        {activeTab === 'exam' && <SignatureResizerForm />}
        {activeTab === 'compress' && <CompressorForm />}
        {activeTab === 'resize' && <ResizerForm />}
      </div>
    </div>
  );
}