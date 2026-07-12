'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LiveDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [totalClasses, setTotalClasses] = useState(50);
  const [attended, setAttended] = useState(38);
  const [target, setTarget] = useState(75);

  const percentage = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;
  const isAboveTarget = percentage >= target;

  const getInsight = useCallback(() => {
    if (totalClasses === 0) return 'Enter your total classes to get started.';
    if (attended > totalClasses) return 'Attended cannot exceed total classes.';

    if (isAboveTarget) {
      const canMiss = Math.floor(
        (attended - (target / 100) * totalClasses) / (target / 100)
      );
      return `You can safely miss ${Math.max(canMiss, 0)} more class${canMiss !== 1 ? 'es' : ''} and stay above ${target}%.`;
    } else {
      const needed = Math.ceil(
        ((target / 100) * totalClasses - attended) / (1 - target / 100)
      );
      return `Attend the next ${needed} class${needed !== 1 ? 'es' : ''} to reach your ${target}% target.`;
    }
  }, [totalClasses, attended, target, isAboveTarget]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(contentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing">
      <div className="container-main">
        <div ref={contentRef}>
          <div className="max-w-lg mb-12">
            <h2 className="text-h2 font-bold tracking-tight">
              Know exactly where your attendance{' '}
              <span className="font-serif italic font-normal">stands</span>.
            </h2>
            <p className="mt-4 text-body-lg text-[var(--text-secondary)]">
              Try it now — enter your numbers and see instant results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input side */}
            <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
              <div className="space-y-5">
                <DemoInput
                  label="Total Classes"
                  value={totalClasses}
                  onChange={setTotalClasses}
                  min={0}
                  max={500}
                />
                <DemoInput
                  label="Classes Attended"
                  value={attended}
                  onChange={setAttended}
                  min={0}
                  max={totalClasses}
                />
                <DemoInput
                  label="Target %"
                  value={target}
                  onChange={setTarget}
                  min={1}
                  max={100}
                />
              </div>
            </div>

            {/* Result side */}
            <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
                Current Attendance
              </span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tighter">
                  {totalClasses > 0 ? percentage.toFixed(1) : '—'}
                </span>
                {totalClasses > 0 && (
                  <span className="text-2xl font-bold text-[var(--text-subtle)]">
                    %
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-6 relative">
                <div className="h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isAboveTarget
                        ? 'var(--color-success)'
                        : percentage > target * 0.9
                          ? 'var(--color-warning)'
                          : 'var(--color-error)',
                    }}
                  />
                </div>
                {/* Target marker */}
                <div
                  className="absolute top-0 h-3 w-0.5 bg-[var(--text-primary)]"
                  style={{ left: `${target}%` }}
                />
                <div
                  className="absolute -bottom-5 text-xs text-[var(--text-subtle)] -translate-x-1/2"
                  style={{ left: `${target}%` }}
                >
                  {target}%
                </div>
              </div>

              {/* Insight */}
              <p className="mt-10 text-sm text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--accent-primary)] pl-4">
                {getInsight()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DemoInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
}

function DemoInput({ label, value, onChange, min, max }: DemoInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
        <span className="text-sm font-mono text-[var(--text-subtle)]">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[var(--bg-subtle)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-dark)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--bg-surface)] [&::-webkit-slider-thumb]:shadow-md"
      />
    </div>
  );
}
