import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description: 'StudentKit helps students calculate, learn, and build — free tools, interactive roadmaps, and curated project ideas.',
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">About StudentKit</h1>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <p className="text-body-lg">
            StudentKit is a free platform that helps students calculate, learn, and
            build. We provide instant tools, interactive career roadmaps, and curated
            project ideas — everything you need to move forward without barriers.
          </p>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            Why we built this
          </h2>
          <p>
            Students need more than just calculators. They need clarity on what to
            learn, what to build, and how to progress. Most existing platforms are
            cluttered with ads, require accounts for basic functionality, or scatter
            information across dozens of sites.
          </p>
          <p>
            StudentKit brings together essential utilities, structured learning paths,
            and real-world project guidance in one place — fast, private, and free.
            Every calculator runs in your browser. Your data stays on your device.
          </p>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            Three pillars
          </h2>
          <ul className="space-y-4 list-none">
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">01</span>
              <span><strong className="text-[var(--text-primary)]">Calculate.</strong> Instant tools for grades, attendance, salary, documents, and more.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">02</span>
              <span><strong className="text-[var(--text-primary)]">Learn.</strong> Interactive roadmaps for careers, technologies, and exam preparation.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">03</span>
              <span><strong className="text-[var(--text-primary)]">Build.</strong> Curated project ideas with architecture, milestones, and deployment guides.</span>
            </li>
          </ul>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            Our principles
          </h2>
          <ul className="space-y-3 list-none">
            <li className="flex gap-3">
              <span className="text-[var(--text-subtle)] font-mono text-sm shrink-0">—</span>
              <span><strong className="text-[var(--text-primary)]">Fast.</strong> Get your answer in seconds, not minutes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-subtle)] font-mono text-sm shrink-0">—</span>
              <span><strong className="text-[var(--text-primary)]">Private.</strong> Client-side processing wherever possible.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-subtle)] font-mono text-sm shrink-0">—</span>
              <span><strong className="text-[var(--text-primary)]">Free.</strong> No paywalls for essential student resources.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-subtle)] font-mono text-sm shrink-0">—</span>
              <span><strong className="text-[var(--text-primary)]">Accurate.</strong> Transparent formulas and verified information.</span>
            </li>
          </ul>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            What&apos;s next
          </h2>
          <p>
            We&apos;re actively building interactive roadmaps with progress tracking,
            detailed project guides with architecture diagrams, and developer tools
            like README generators and project structure builders. If you have ideas,
            reach out through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
