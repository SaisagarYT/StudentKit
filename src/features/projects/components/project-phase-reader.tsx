'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock, ArrowRight, ArrowLeft, Terminal, CheckCircle2, Circle,
  FileCode, Layers, Check, Copy, ExternalLink, Maximize2, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { CuratedProject } from '@/config/projects';

interface ProjectPhaseReaderProps {
  project: CuratedProject;
  activePhaseIndex: number;
  onSelectPhase: (index: number) => void;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export function ProjectPhaseReader({
  project,
  activePhaseIndex,
  onSelectPhase,
  completedTasks,
  onToggleTask,
  isCompleted,
  onToggleComplete,
}: ProjectPhaseReaderProps) {
  const phases = project.phases || [];
  const activePhase = activePhaseIndex > 0 ? phases[activePhaseIndex - 1] : null;

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; caption?: string } | null>(null);

  const handleCopyCode = useCallback((code: string, id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCodeId(id);
        setTimeout(() => setCopiedCodeId(null), 2000);
      });
    }
  }, []);

  if (!activePhase) return null;

  const isFirstPhase = activePhaseIndex === 1;
  const isLastPhase = activePhaseIndex === phases.length;

  return (
    <div className="w-full space-y-6">
      {/* ── Breadcrumbs & Quick Return ── */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => onSelectPhase(0)}
            className="text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <span className="text-[var(--text-subtle)]">/</span>
          <span className="text-[var(--accent-dark)] font-semibold truncate max-w-[240px] sm:max-w-md">
            Phase {activePhase.phaseNumber}: {activePhase.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectPhase(0)}
          className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Project Specs</span>
        </button>
      </div>

      {/* ── Phase Article Content ── */}
      <motion.article
        key={activePhase.id || activePhaseIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-8"
      >
        {/* Phase Header Banner */}
        <div className="p-6 sm:p-8 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-dark)] text-[var(--text-inverse)]">
              Phase {activePhase.phaseNumber} of {phases.length}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-subtle)] font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{activePhase.estimatedDuration}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {activePhase.title}
          </h1>

          {activePhase.summary && (
            <div className="mt-4 p-4 rounded-sm border-l-4 border-l-[var(--accent-dark)] bg-[var(--bg-subtle)]">
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                &ldquo;{activePhase.summary}&rdquo;
              </p>
            </div>
          )}

          {/* Objectives Chips */}
          {activePhase.objectives && activePhase.objectives.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[var(--border-soft)]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)] block mb-2">
                Core Phase Objectives
              </span>
              <div className="flex flex-wrap gap-2">
                {activePhase.objectives.map((obj, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)]" />
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phase Diagram (if available) */}
        {activePhase.imageUrl && (
          <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs">
            <div className="relative group overflow-hidden rounded-sm bg-black/5 dark:bg-black/40">
              <Image
                src={activePhase.imageUrl}
                alt={activePhase.imageCaption || activePhase.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover rounded-sm transition-transform duration-300 group-hover:scale-[1.01]"
                unoptimized
              />
              <button
                type="button"
                onClick={() => setZoomImage({ url: activePhase.imageUrl!, caption: activePhase.imageCaption })}
                className="absolute top-3 right-3 p-2 rounded-sm bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                title="Zoom Diagram"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            {activePhase.imageCaption && (
              <p className="mt-3 text-center text-xs text-[var(--text-subtle)] font-mono">
                {activePhase.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Long-Form Markdown Technical Guide */}
        <div className="p-6 sm:p-8 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8 mb-4 pb-2 border-b border-[var(--border-soft)]" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mt-6 mb-3" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h4 className="text-base font-semibold text-[var(--text-primary)] mt-5 mb-2" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed my-3" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5 my-3 space-y-1 text-sm text-[var(--text-secondary)]" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal pl-5 my-3 space-y-1 text-sm text-[var(--text-secondary)]" {...props} />
                ),
                li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="p-4 my-4 rounded-sm border-l-4 border-l-[var(--accent-dark)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed"
                    {...props}
                  />
                ),
                table: ({ ...props }) => (
                  <div className="my-4 overflow-x-auto rounded-sm border border-[var(--border-soft)]">
                    <table className="w-full text-left text-xs" {...props} />
                  </div>
                ),
                th: ({ ...props }) => (
                  <th className="px-3.5 py-2.5 font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] border-b border-[var(--border-soft)]" {...props} />
                ),
                td: ({ ...props }) => (
                  <td className="px-3.5 py-2.5 text-[var(--text-secondary)] border-b border-[var(--border-soft)]" {...props} />
                ),
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const isInline = !match && !codeString.includes('\n');

                  if (isInline) {
                    return (
                      <code
                        className="px-1.5 py-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-mono text-[var(--text-primary)]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  const lang = match ? match[1] : 'code';
                  const codeId = `code-${activePhase.id}-${codeString.slice(0, 16)}`;
                  const isCopied = copiedCodeId === codeId;

                  let filename = '';
                  const firstLineMatch = codeString.match(/^(\/\/|#|\/\*)\s*([\w\-./\\]+\.[a-zA-Z0-9]+)/);
                  if (firstLineMatch) {
                    filename = firstLineMatch[2];
                  }

                  return (
                    <div className="my-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-primary)] overflow-hidden shadow-xs">
                      {/* Code Block Header */}
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--bg-subtle)] border-b border-[var(--border-soft)]">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                          <span className="text-[11px] font-mono font-semibold text-[var(--text-primary)]">
                            {filename || lang.toUpperCase()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(codeString, codeId)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-[var(--color-success)]" />
                              <span className="text-[var(--color-success)]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Pre Body */}
                      <pre className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-[var(--text-primary)] bg-[var(--bg-primary)]">
                        <code>{children}</code>
                      </pre>
                    </div>
                  );
                },
              }}
            >
              {activePhase.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* End-of-Phase Checkpoint & Verification */}
        {((activePhase.checkpointTasks && activePhase.checkpointTasks.length > 0) || activePhase.expectedOutput) && (
          <div className="p-6 sm:p-7 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Phase {activePhase.phaseNumber} Verification Checkpoints
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Verify these implementation requirements are satisfied before proceeding.
                </p>
              </div>
            </div>

            {/* Checkpoint tasks */}
            {activePhase.checkpointTasks && activePhase.checkpointTasks.length > 0 && (
              <div className="space-y-2.5 mt-4">
                {activePhase.checkpointTasks.map((task, i) => {
                  const taskId = `${activePhase.id}-task-${i}`;
                  const isDone = !!completedTasks[taskId];
                  return (
                    <div
                      key={taskId}
                      onClick={() => onToggleTask(taskId)}
                      className="flex items-start gap-3 p-3 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] cursor-pointer hover:border-[var(--border-strong)] transition-all select-none"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[var(--text-subtle)] shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-[var(--text-subtle)]' : 'text-[var(--text-primary)] font-medium'}`}>
                        {task}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Expected Output Console */}
            {activePhase.expectedOutput && (
              <div className="mt-4 pt-4 border-t border-[var(--border-soft)]">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                  <span className="text-[11px] font-mono font-semibold text-[var(--text-primary)]">
                    Expected Terminal / Verification Output
                  </span>
                </div>
                <pre className="p-3.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-mono text-[var(--text-primary)] overflow-x-auto leading-relaxed">
                  <code>{activePhase.expectedOutput}</code>
                </pre>
              </div>
            )}

            {activePhase.githubBranchUrl && (
              <div className="pt-3 flex justify-end">
                <a
                  href={activePhase.githubBranchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-dark)] hover:underline"
                >
                  <span>View Phase {activePhase.phaseNumber} Source on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Completion Banner (Final Phase) ── */}
        {isLastPhase && isCompleted && (
          <div className="p-4 rounded-sm border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Masterclass Completed
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                You have successfully completed this project masterclass! Your progress has been updated in your student telemetry.
              </p>
            </div>
          </div>
        )}

        {/* ── Stepper Navigation Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs">
          <button
            type="button"
            onClick={() => onSelectPhase(isFirstPhase ? 0 : activePhaseIndex - 1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-xs font-mono font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isFirstPhase ? '← Overview & Architecture' : `Phase ${activePhaseIndex - 1}`}</span>
          </button>

          {!isLastPhase ? (
            <button
              type="button"
              onClick={() => onSelectPhase(activePhaseIndex + 1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 text-xs font-semibold transition-opacity shadow-xs cursor-pointer"
            >
              <span>Next: Phase {activePhaseIndex + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleComplete}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : ''}`} />
              <span>{isCompleted ? 'Project Completed ✓' : 'Mark Project as Completed'}</span>
            </button>
          )}
        </div>
      </motion.article>

      {/* ── Image Lightbox Modal ── */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
            onClick={() => setZoomImage(null)}
          >
            <div
              className="relative max-w-5xl w-full bg-[var(--bg-surface)] rounded-sm p-4 border border-[var(--border-strong)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-soft)]">
                <span className="text-xs font-mono text-[var(--text-subtle)]">Architecture Diagram Zoom</span>
                <button
                  type="button"
                  onClick={() => setZoomImage(null)}
                  className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center max-h-[80vh] overflow-auto">
                <Image
                  src={zoomImage.url}
                  alt={zoomImage.caption || 'Architecture Diagram'}
                  width={1400}
                  height={800}
                  className="w-full h-auto object-contain rounded-sm"
                  unoptimized
                />
              </div>
              {zoomImage.caption && (
                <p className="mt-3 text-center text-xs text-[var(--text-secondary)] font-mono">
                  {zoomImage.caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
