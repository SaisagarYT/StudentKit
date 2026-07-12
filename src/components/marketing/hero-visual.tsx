'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(cardsRef.current.filter(Boolean), {
        opacity: 0,
        y: 60,
        rotation: 0,
      });

      // Staggered entrance
      gsap.to(cardsRef.current.filter(Boolean), {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.6,
      });

      // Floating animation
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.to(card, {
          y: `${i % 2 === 0 ? '-' : '+'}=${8 + i * 3}`,
          duration: 3 + i * 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });
      });
    }, containerRef);

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cardsRef.current.filter(Boolean).forEach((card, i) => {
        const depth = (i + 1) * 0.6;
        gsap.to(card, {
          x: x * 20 * depth,
          rotationY: x * 5 * depth,
          rotationX: -y * 5 * depth,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    };

    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    const container = containerRef.current;

    return () => {
      ctx.revert();
      container?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] perspective-[1200px]"
      aria-hidden="true"
    >
      {/* Card 1: Attendance */}
      <div
        ref={setCardRef(0)}
        className="absolute top-8 right-12 w-56 p-5 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
          <span className="text-xs font-medium text-[var(--text-subtle)]">
            Attendance
          </span>
        </div>
        <div className="text-3xl font-bold tracking-tight">76%</div>
        <p className="mt-1 text-xs text-[var(--text-subtle)]">
          You can miss 3 more classes
        </p>
        <div className="mt-3 h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] rounded-full"
            style={{ width: '76%' }}
          />
        </div>
      </div>

      {/* Card 2: CGPA */}
      <div
        ref={setCardRef(1)}
        className="absolute top-40 left-4 w-48 p-4 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-xs font-medium text-[var(--text-subtle)]">
          CGPA
        </span>
        <div className="mt-2 text-4xl font-bold tracking-tighter">8.4</div>
        <div className="mt-2 flex gap-1">
          {[8.2, 8.5, 8.1, 8.7, 8.4].map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-[var(--accent-college)] rounded-sm"
              style={{ height: `${(v / 10) * 40}px` }}
            />
          ))}
        </div>
      </div>

      {/* Card 3: Salary */}
      <div
        ref={setCardRef(2)}
        className="absolute bottom-12 right-8 w-52 p-4 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-xs font-medium text-[var(--text-subtle)]">
          Monthly In-Hand
        </span>
        <div className="mt-1 text-2xl font-bold tracking-tight">₹41,667</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 bg-[var(--accent-career)] rounded-full" />
          <span className="text-xs text-[var(--text-subtle)]">CTC 8L</span>
        </div>
      </div>

      {/* Card 4: Image */}
      <div
        ref={setCardRef(3)}
        className="absolute bottom-32 left-12 w-44 p-4 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-xs font-medium text-[var(--text-subtle)]">
          Compressed
        </span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-bold">72%</span>
          <span className="text-xs text-[var(--color-success)]">smaller</span>
        </div>
        <div className="mt-2 text-xs text-[var(--text-subtle)]">
          2.4 MB → 680 KB
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[var(--border-soft)] rounded-full opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[var(--border-soft)] rounded-full opacity-20" />

      {/* Floating symbols */}
      <div className="absolute top-16 left-1/2 text-lg font-bold text-[var(--accent-primary)] opacity-60">
        %
      </div>
      <div className="absolute bottom-20 left-1/3 text-sm font-mono text-[var(--text-subtle)] opacity-40">
        ÷
      </div>
      <div className="absolute top-1/3 right-4 text-sm font-mono text-[var(--text-subtle)] opacity-40">
        =
      </div>
    </div>
  );
}
