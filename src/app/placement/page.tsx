import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Code, MessageSquare, FileText, Target, Briefcase, Trophy } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Placement Preparation | ${siteConfig.name}`,
  description: 'Complete placement preparation — DSA sheet with 250+ problems, CS fundamentals (OS, DBMS, CN, OOPs), interview prep, and company-wise patterns. From zero to FAANG.',
  openGraph: {
    images: [{ url: '/og/placement.png', width: 1200, height: 630 }],
  },
};

const sections = [
  {
    title: 'DSA Sheet',
    description: '250+ handpicked problems from Blind 75, NeetCode 150 & Striver SDE Sheet. Organized by topic with difficulty tags and company info.',
    href: '/placement/dsa',
    icon: Code,
    color: '#C7FF3D',
    stats: '15 Topics • 250+ Problems',
    tag: 'Most Important',
  },
  {
    title: 'CS Fundamentals',
    description: 'Operating Systems, DBMS, Computer Networks, and OOPs — every concept, key point, and interview question you need.',
    href: '/placement/cs-fundamentals',
    icon: Brain,
    color: '#A8F0E6',
    stats: '4 Subjects • 60+ Topics',
    tag: 'Theory Rounds',
  },
  {
    title: 'Interview Prep',
    description: 'HR questions, behavioral (STAR method), technical tips, situational questions, and company-wise interview patterns.',
    href: '/placement/interview',
    icon: MessageSquare,
    color: '#D8CCFF',
    stats: '60+ Questions • 12 Companies',
    tag: 'Final Round',
  },
];

const roadmapSteps = [
  { step: '1', title: 'Pick a Language', description: 'Master one language — C++, Java, or Python. Know its STL/collections inside out.', icon: FileText },
  { step: '2', title: 'DSA Fundamentals', description: 'Start with arrays, strings, then move to recursion, trees, graphs, and DP.', icon: Code },
  { step: '3', title: 'CS Core Subjects', description: 'Cover OS, DBMS, CN, OOPs. Focus on concepts asked in interviews.', icon: Brain },
  { step: '4', title: 'Practice Problems', description: 'Solve 200-300 problems. Focus on patterns, not just answers.', icon: Target },
  { step: '5', title: 'Mock Interviews', description: 'Practice explaining your approach. Time yourself. Get feedback.', icon: MessageSquare },
  { step: '6', title: 'Apply & Track', description: 'Apply strategically. Track each company\'s process and prepare accordingly.', icon: Briefcase },
];

export default function PlacementPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main">
        {/* Hero */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--accent-primary)]">
            <Trophy className="w-3.5 h-3.5" />
            Placement Hub
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Crack Any{' '}
            <span className="font-serif italic font-normal">Interview</span>
          </h1>
          <p className="mt-5 text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Everything you need to go from zero to placed at your dream company.
            DSA problems, CS theory, interview strategies — structured from beginner to FAANG-ready.
          </p>
        </div>

        {/* Main Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative flex flex-col p-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]/40 hover:shadow-lg transition-all duration-300"
              >
                <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                  {section.tag}
                </span>

                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: section.color }} />
                </div>

                <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-dark)] transition-colors">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                  {section.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-[var(--text-subtle)] font-medium">
                    {section.stats}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Preparation Roadmap */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Preparation Roadmap
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-10 max-w-lg">
            Follow this path if you&apos;re starting from scratch. 3-6 months of focused prep is enough for most companies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmapSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-sm font-bold text-[var(--accent-dark)] shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-[var(--text-subtle)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Already know the basics?
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md">
                Jump straight to the DSA sheet and start solving. Track your progress with checkboxes — your state is saved locally.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/placement/dsa"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] rounded-xl hover:opacity-90 transition-opacity"
              >
                <BookOpen className="w-4 h-4" />
                Start DSA Sheet
              </Link>
              <Link
                href="/roadmaps/placement-preparation"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent-primary)]/40 transition-colors"
              >
                Full Placement Roadmap
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
