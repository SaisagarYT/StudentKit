'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tools } from '@/config/tools';
import { Badge } from '@/components/ui/badge';
import { type ToolCategory } from '@/types/tool';

gsap.registerPlugin(ScrollTrigger);

const featuredTools = tools.filter((t) => t.featured);

function getIcon(name: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className="w-5 h-5" /> : null;
}

export function PopularToolsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 30 });
      gsap.set(gridRef.current?.children || [], { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.to(gridRef.current?.children || [], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.2,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing">
      <div className="container-main">
        <div ref={headingRef}>
          <h2 className="text-h2 font-bold tracking-tight">
            Tools students{' '}
            <span className="font-serif italic font-normal">actually</span>{' '}
            need.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] max-w-lg">
            The most used calculators and utilities — always free, always fast.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {featuredTools.map((tool, index) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              title={tool.title}
              description={tool.shortDescription}
              icon={tool.icon}
              category={tool.category}
              isLarge={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ToolCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: ToolCategory;
  isLarge?: boolean;
}

function ToolCard({
  slug,
  title,
  description,
  icon,
  category,
  isLarge,
}: ToolCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!cardRef.current || !arrowRef.current) return;
    gsap.to(cardRef.current, { y: -3, duration: 0.3, ease: 'power2.out' });
    gsap.to(arrowRef.current, {
      x: 3,
      y: -3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    if (!cardRef.current || !arrowRef.current) return;
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(arrowRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <Link
      ref={cardRef}
      href={`/tools/${slug}`}
      className={`group relative flex flex-col justify-between p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-colors ${
        isLarge ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''
      }`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
            {getIcon(icon)}
          </div>
          <Badge variant={category}>{category}</Badge>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
          Use tool
        </span>
        <div ref={arrowRef}>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--text-primary)] transition-colors" />
        </div>
      </div>
    </Link>
  );
}
