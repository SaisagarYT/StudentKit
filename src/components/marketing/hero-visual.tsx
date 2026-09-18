'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Flame, CheckCircle2, Route, FolderKanban, Zap, ArrowUpRight } from 'lucide-react';

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position normalized (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse parallax
  const springConfig = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transformations for Card 1 (Roadmap) - medium depth
  const c1RotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const c1RotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const c1TranslateX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const c1TranslateY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  // Transformations for Card 2 (DSA Streak) - higher depth
  const c2RotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const c2RotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const c2TranslateX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const c2TranslateY = useTransform(smoothY, [-0.5, 0.5], [-16, 16]);

  // Transformations for Card 3 (Project) - deep depth
  const c3RotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const c3RotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const c3TranslateX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const c3TranslateY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[520px] perspective-[1200px] flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Background ambient lighting */}
      <div className="absolute w-64 h-64 rounded-full bg-[var(--accent-dark)]/5 blur-3xl -bottom-10 -left-6 pointer-events-none" />

      {/* Card 1: Active Roadmap Progress (Top Right) */}
      <motion.div
        style={{
          rotateX: c1RotateX,
          rotateY: c1RotateY,
          x: c1TranslateX,
          y: c1TranslateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="absolute top-4 right-2 sm:right-6 w-72 p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-lg shadow-black/5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Full-Stack Career</p>
              <p className="text-[10px] text-[var(--text-subtle)]">Career Roadmap</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)]">
            Stage 4 of 6
          </span>
        </div>

        <div className="space-y-1.5 my-3">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-[var(--text-primary)]">Microservices & APIs</span>
            <span className="text-[var(--text-subtle)] font-mono">15/20</span>
          </div>
          <div className="h-2 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
              className="h-full bg-[var(--accent-dark)] rounded-full"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-soft)] flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
          <span>Next: Docker & Kubernetes</span>
          <span className="text-[var(--text-primary)] font-medium flex items-center gap-0.5">
            Continue <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>

      {/* Card 2: Daily DSA Streak (Middle Left) */}
      <motion.div
        style={{
          rotateX: c2RotateX,
          rotateY: c2RotateY,
          x: c2TranslateX,
          y: c2TranslateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        whileHover={{ scale: 1.04, zIndex: 30 }}
        className="absolute top-44 left-0 sm:left-4 w-68 p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-xl shadow-black/5"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">14-Day Streak</p>
              <p className="text-[10px] text-[var(--text-subtle)]">Daily DSA Challenge</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-mono font-bold text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] px-2 py-0.5 rounded-sm">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> +50 XP
          </span>
        </div>

        <div className="p-2.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] mb-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[var(--text-primary)]">Two Sum (#1)</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)]">
              Easy
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--text-subtle)]">
            <span className="flex items-center gap-1 text-[var(--color-success)] font-medium">
              <CheckCircle2 className="w-3 h-3" /> Solved
            </span>
            <span>•</span>
            <span>8m 24s</span>
            <span>•</span>
            <span className="font-mono">Google, Meta</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>Pattern: Two Pointers</span>
          <span className="text-[var(--text-primary)] font-mono font-semibold">Active Streak</span>
        </div>
      </motion.div>

      {/* Card 3: Guided Project Showcase (Bottom Right) */}
      <motion.div
        style={{
          rotateX: c3RotateX,
          rotateY: c3RotateY,
          x: c3TranslateX,
          y: c3TranslateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        className="absolute bottom-6 right-6 sm:right-10 w-72 p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md shadow-lg shadow-black/5"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">In-Memory Cache</p>
              <p className="text-[10px] text-[var(--text-subtle)]">Guided Portfolio Project</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
            Go / TCP
          </span>
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mb-2.5">
          High-concurrency key-value store with LRU eviction and active TTL.
        </p>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
            Redis RESP
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
            LRU Cache
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
            TCP Server
          </span>
        </div>

        <div className="pt-2 border-t border-[var(--border-soft)] flex items-center justify-between text-[11px]">
          <span className="text-[var(--color-success)] font-medium">Resume-Ready</span>
          <span className="text-[var(--text-primary)] font-semibold flex items-center gap-0.5">
            View Architecture <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
