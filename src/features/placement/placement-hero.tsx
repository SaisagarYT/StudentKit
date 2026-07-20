'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Code, MessageSquare, FileText, Target, Briefcase, Trophy, Sparkles, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

const sections = [
  {
    title: 'DSA Sheet',
    description: '250+ handpicked problems from Blind 75, NeetCode 150 & Striver SDE Sheet. Track your progress with difficulty filters and company tags.',
    href: '/placement/dsa',
    icon: Code,
    color: '#C7FF3D',
    stats: '15 Topics • 250+ Problems',
    tag: 'Most Important',
    gradient: 'from-[#C7FF3D]/10 to-transparent',
  },
  {
    title: 'CS Fundamentals',
    description: 'Operating Systems, DBMS, Computer Networks, and OOPs — every concept with key points and interview questions.',
    href: '/placement/cs-fundamentals',
    icon: Brain,
    color: '#A8F0E6',
    stats: '4 Subjects • 60+ Topics',
    tag: 'Theory Rounds',
    gradient: 'from-[#A8F0E6]/10 to-transparent',
  },
  {
    title: 'Interview Prep',
    description: 'HR questions, behavioral (STAR), technical tips, situational questions, and company-wise interview patterns.',
    href: '/placement/interview',
    icon: MessageSquare,
    color: '#D8CCFF',
    stats: '60+ Questions • 12 Companies',
    tag: 'Final Round',
    gradient: 'from-[#D8CCFF]/10 to-transparent',
  },
];

const roadmapSteps = [
  { step: '01', title: 'Pick a Language', description: 'Master C++, Java, or Python with STL/collections.', icon: FileText },
  { step: '02', title: 'DSA Fundamentals', description: 'Arrays → Recursion → Trees → Graphs → DP.', icon: Code },
  { step: '03', title: 'CS Core Subjects', description: 'OS, DBMS, CN, OOPs for theory rounds.', icon: Brain },
  { step: '04', title: 'Practice 250+', description: 'Focus on patterns, not just memorizing solutions.', icon: Target },
  { step: '05', title: 'Mock Interviews', description: 'Practice explaining. Time yourself. Get feedback.', icon: MessageSquare },
  { step: '06', title: 'Apply & Track', description: 'Research each company. Prepare accordingly.', icon: Briefcase },
];

const stats = [
  { value: '250+', label: 'DSA Problems' },
  { value: '60+', label: 'CS Topics' },
  { value: '12', label: 'Companies' },
  { value: '100%', label: 'Free Forever' },
];

export function PlacementHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ph-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.ph-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );

      gsap.fromTo(
        '.ph-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.25 }
      );

      gsap.fromTo(
        '.ph-stats > div',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.4 }
      );

      gsap.fromTo(
        '.ph-card',
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.5 }
      );

      gsap.fromTo(
        '.ph-step',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out', delay: 0.8 }
      );

      gsap.fromTo(
        '.ph-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="placement-hero">
      <style>{`
        .placement-hero {
          padding: 40px 0 80px;
          position: relative;
          overflow: hidden;
        }

        .ph-glow {
          position: absolute;
          top: -200px;
          right: -100px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
          opacity: 0.04;
          pointer-events: none;
        }

        .ph-glow-2 {
          position: absolute;
          bottom: 200px;
          left: -200px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, #D8CCFF 0%, transparent 70%);
          opacity: 0.03;
          pointer-events: none;
        }

        .ph-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: var(--bg-surface);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .ph-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.35s;
          pointer-events: none;
        }

        .ph-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .ph-card:hover::before {
          opacity: 1;
        }

        .ph-card:hover .ph-card-arrow {
          transform: translateX(4px);
          color: var(--accent-primary);
        }

        .ph-card-arrow {
          transition: all 0.3s;
        }

        .ph-card-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          opacity: 0.08;
          pointer-events: none;
          filter: blur(40px);
        }

        .ph-stat-card {
          padding: 16px 24px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: var(--bg-surface);
          text-align: center;
          transition: all 0.3s;
        }

        .ph-stat-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .ph-step-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: var(--bg-surface);
          transition: all 0.25s;
        }

        .ph-step-card:hover {
          border-color: var(--accent-primary)/40;
          background: var(--bg-subtle);
        }

        .ph-step-num {
          font-size: 12px;
          font-weight: 800;
          color: var(--accent-primary);
          font-variant-numeric: tabular-nums;
          opacity: 0.6;
        }

        .ph-connector {
          position: absolute;
          left: 36px;
          top: 100%;
          width: 2px;
          height: 12px;
          background: var(--border-soft);
        }

        @media (max-width: 768px) {
          .placement-hero { padding: 24px 0 60px; }
        }
      `}</style>

      <div className="ph-glow" />
      <div className="ph-glow-2" />

      <div className="container-main relative">
        {/* Hero Section */}
        <div ref={heroRef} className="max-w-3xl mb-16">
          <div className="ph-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">Placement Hub</span>
          </div>

          <h1 className="ph-title text-h1 font-bold tracking-tight text-[var(--text-primary)]">
            Crack Any{' '}
            <span className="font-serif italic font-normal">Interview</span>
          </h1>

          <p className="ph-subtitle mt-5 text-body-lg text-[var(--text-primary)] opacity-70 leading-relaxed max-w-2xl">
            Everything you need to go from zero to placed at your dream company.
            DSA problems, CS theory, interview strategies — structured from beginner to FAANG-ready.
          </p>
        </div>

        {/* Stats row */}
        <div className="ph-stats grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {stats.map(stat => (
            <div key={stat.label} className="ph-stat-card">
              <div className="text-xl md:text-2xl font-bold text-[var(--accent-primary)]">{stat.value}</div>
              <div className="text-xs text-[var(--text-primary)] opacity-50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Section Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="ph-card group"
              >
                <div className="ph-card-glow" style={{ background: section.color }} />

                <div className="flex items-center justify-between mb-5">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: `${section.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: section.color }} />
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ backgroundColor: `${section.color}12`, color: section.color }}>
                    {section.tag}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-[var(--text-primary)] opacity-60 leading-relaxed flex-1">
                  {section.description}
                </p>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-xs text-[var(--text-primary)] opacity-50 font-medium">
                    {section.stats}
                  </span>
                  <ArrowRight className="ph-card-arrow w-4 h-4 text-[var(--text-subtle)]" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Preparation Roadmap */}
        <div ref={stepsRef} className="mb-20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Preparation Roadmap
            </h2>
          </div>
          <p className="text-sm text-[var(--text-primary)] opacity-60 mb-8 max-w-lg">
            Follow this path if you&apos;re starting from scratch. 3-6 months of focused prep is enough for most companies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roadmapSteps.map((item) => (
              <div key={item.step} className="ph-step ph-step-card relative">
                <span className="ph-step-num">{item.step}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-primary)] opacity-50 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="ph-cta relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-surface)] border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--accent-primary)] opacity-[0.03] blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Already know the basics?
              </h2>
              <p className="mt-2 text-sm text-[var(--text-primary)] opacity-60 max-w-md">
                Jump straight to the DSA sheet and start solving. Track your progress with checkboxes — saved locally.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/placement/dsa"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[var(--accent-primary)] text-[var(--bg-base)] rounded-xl hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[var(--accent-primary)]/20"
              >
                <BookOpen className="w-4 h-4" />
                Start DSA Sheet
              </Link>
              <Link
                href="/placement/interview"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-primary)]/40 transition-all"
              >
                Interview Prep
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
