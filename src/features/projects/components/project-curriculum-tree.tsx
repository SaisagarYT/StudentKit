'use client';

import { useState } from 'react';
import {
  FolderTree, Folder, FolderOpen, FileText, CheckCircle2,
  ChevronDown, ChevronRight, Clock
} from 'lucide-react';
import type { CuratedProject, ProjectPhase } from '@/config/projects';

interface ProjectCurriculumTreeProps {
  project: CuratedProject;
  activePhaseIndex: number;
  onSelectPhase: (index: number) => void;
  completedTasks: Record<string, boolean>;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

function sanitizeFolderName(title: string): string {
  return title
    .toLowerCase()
    .replace(/^phase\s*\d+\s*:\s*/i, '')
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 24)
    .replace(/(^_|_$)/g, '');
}

export function ProjectCurriculumTree({
  project,
  activePhaseIndex,
  onSelectPhase,
  completedTasks,
  isCompleted,
  onToggleComplete,
}: ProjectCurriculumTreeProps) {
  const phases = project.phases || [];

  // Track expanded folder state; default all folders open
  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    phases.forEach((_, idx) => {
      initial[idx + 1] = true;
    });
    return initial;
  });

  const toggleFolder = (phaseNum: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenFolders((prev) => ({
      ...prev,
      [phaseNum]: !prev[phaseNum],
    }));
  };

  // Calculate phase checkpoint completion
  const getPhaseCheckStats = (phase: ProjectPhase) => {
    const tasks = phase.checkpointTasks || [];
    if (tasks.length === 0) return { total: 0, done: 0, allDone: false };
    const done = tasks.filter((_: string, i: number) => !!completedTasks[`${phase.id}-task-${i}`]).length;
    return {
      total: tasks.length,
      done,
      allDone: done === tasks.length && tasks.length > 0,
    };
  };

  // Calculate overall masterclass progress
  const completedPhasesCount = phases.filter((p) => {
    const stats = getPhaseCheckStats(p);
    return stats.allDone;
  }).length;
  const progressPercent = phases.length > 0 ? Math.round((completedPhasesCount / phases.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* ── Folder Tree Card ── */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs overflow-hidden">
        {/* Terminal / Explorer Header */}
        <div className="px-4 py-3 bg-[var(--bg-subtle)] border-b border-[var(--border-soft)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[var(--accent-dark)]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Curriculum Explorer
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-subtle)]">
            {phases.length} Phases
          </span>
        </div>

        {/* Root Directory Breadcrumb */}
        <div className="px-4 py-2 border-b border-[var(--border-soft)]/60 bg-[var(--bg-primary)]/40 text-[10px] font-mono text-[var(--text-subtle)] flex items-center gap-1 truncate">
          <span>~/masterclass</span>
          <span>/</span>
          <span className="text-[var(--text-secondary)] font-semibold truncate">{project.slug}</span>
        </div>

        {/* Tree Nodes */}
        <div className="p-2 space-y-0.5 font-mono text-xs select-none">
          {/* Node 0: Overview File */}
          <button
            type="button"
            onClick={() => onSelectPhase(0)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors text-left group ${
              activePhaseIndex === 0
                ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] font-semibold shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className={`w-3.5 h-3.5 shrink-0 ${activePhaseIndex === 0 ? 'text-[var(--text-inverse)]' : 'text-[var(--text-subtle)]'}`} />
              <span className="truncate text-[11px]">00_overview.md</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-xs font-mono uppercase ${
              activePhaseIndex === 0 ? 'bg-black/20 text-[var(--text-inverse)]' : 'text-[var(--text-subtle)]'
            }`}>
              Specs
            </span>
          </button>

          {/* Phase Folders */}
          {phases.map((phase, idx) => {
            const phaseNum = idx + 1;
            const isFolderOpen = !!openFolders[phaseNum];
            const isPhaseActive = activePhaseIndex === phaseNum;
            const stats = getPhaseCheckStats(phase);
            const folderName = `phase_${String(phaseNum).padStart(2, '0')}_${sanitizeFolderName(phase.title)}`;

            return (
              <div key={phase.id || idx} className="space-y-0.5">
                {/* Folder Header */}
                <div
                  onClick={() => onSelectPhase(phaseNum)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-sm cursor-pointer transition-colors group ${
                    isPhaseActive
                      ? 'bg-[var(--accent-dark)]/10 text-[var(--accent-dark)] font-semibold border-l-2 border-l-[var(--accent-dark)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => toggleFolder(phaseNum, e)}
                      className="p-0.5 text-[var(--text-subtle)] hover:text-[var(--text-primary)]"
                    >
                      {isFolderOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isFolderOpen ? (
                      <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate text-[11px] font-medium">{folderName}/</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                    {stats.allDone ? (
                      <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[var(--text-subtle)] font-mono text-[9px]">
                        {phase.estimatedDuration ? phase.estimatedDuration.replace('read', '').trim() : `${phaseNum * 20}m`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Folder Children (Articles & Checkpoints) */}
                {isFolderOpen && (
                  <div className="pl-6 space-y-0.5 border-l border-[var(--border-soft)]/60 ml-3 py-0.5">
                    {/* File 1: Technical Guide */}
                    <button
                      type="button"
                      onClick={() => onSelectPhase(phaseNum)}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded-sm text-left transition-colors ${
                        isPhaseActive
                          ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] font-semibold shadow-xs'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className={`w-3 h-3 shrink-0 ${isPhaseActive ? 'text-[var(--text-inverse)]' : 'text-[var(--text-subtle)]'}`} />
                        <span className="truncate text-[10.5px]">guide.md</span>
                      </div>
                      <span className={`text-[9px] font-mono ${isPhaseActive ? 'text-[var(--text-inverse)]' : 'text-[var(--text-subtle)]'}`}>
                        {phase.estimatedDuration || '25m'}
                      </span>
                    </button>

                    {/* File 2: Checkpoints */}
                    {stats.total > 0 && (
                      <button
                        type="button"
                        onClick={() => onSelectPhase(phaseNum)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-sm text-left text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className={`w-3 h-3 shrink-0 ${stats.allDone ? 'text-emerald-500' : 'text-[var(--text-subtle)]'}`} />
                          <span className="truncate text-[10.5px]">checkpoints.md</span>
                        </div>
                        <span className={`text-[9px] font-mono ${stats.allDone ? 'text-emerald-500 font-bold' : 'text-[var(--text-subtle)]'}`}>
                          {stats.done}/{stats.total}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Progress & Verification Widget ── */}
      <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--text-primary)]">Masterclass Progress</span>
          <span className="font-mono text-[var(--text-secondary)] font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-dark)] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--text-subtle)] pt-1">
          <span>{completedPhasesCount} of {phases.length} phases verified</span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            {project.estimatedDuration}
          </span>
        </div>

        {/* Project Completion Action */}
        <div className="pt-2 border-t border-[var(--border-soft)]">
          <button
            type="button"
            onClick={onToggleComplete}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-xs font-semibold border transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-500' : ''}`} />
            <span>{isCompleted ? 'Project Completed ✓' : 'Mark Project as Completed'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

