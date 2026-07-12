import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers, Globe, Bot, ShoppingCart, MessageSquare, BarChart3, Video, Lock } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description: 'Curated project ideas for students and developers — from beginner to advanced. Build real-world applications with guided architecture and milestones.',
};

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const projects = [
  {
    slug: 'portfolio-website',
    title: 'Developer Portfolio',
    description: 'A responsive personal portfolio showcasing your work, skills, and blog.',
    difficulty: 'beginner' as Difficulty,
    tech: ['Next.js', 'Tailwind CSS', 'MDX'],
    duration: '1–2 weeks',
    icon: Globe,
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    description: 'Kanban-style project tracker with drag-and-drop, auth, and real-time updates.',
    difficulty: 'intermediate' as Difficulty,
    tech: ['React', 'Firebase', 'DnD Kit'],
    duration: '2–3 weeks',
    icon: Layers,
  },
  {
    slug: 'ai-chat-application',
    title: 'AI Chat Application',
    description: 'Conversational AI interface with streaming responses, history, and context management.',
    difficulty: 'advanced' as Difficulty,
    tech: ['Next.js', 'OpenAI API', 'PostgreSQL'],
    duration: '3–4 weeks',
    icon: Bot,
  },
  {
    slug: 'ecommerce-store',
    title: 'E-commerce Store',
    description: 'Full-featured online store with cart, checkout, payments, and admin dashboard.',
    difficulty: 'advanced' as Difficulty,
    tech: ['Next.js', 'Stripe', 'Prisma'],
    duration: '4–6 weeks',
    icon: ShoppingCart,
  },
  {
    slug: 'real-time-chat',
    title: 'Real-time Chat',
    description: 'Group messaging with typing indicators, read receipts, and file sharing.',
    difficulty: 'intermediate' as Difficulty,
    tech: ['React', 'Socket.io', 'Express'],
    duration: '2–3 weeks',
    icon: MessageSquare,
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Interactive data visualization dashboard with charts, filters, and export.',
    difficulty: 'intermediate' as Difficulty,
    tech: ['Next.js', 'D3.js', 'REST APIs'],
    duration: '2–4 weeks',
    icon: BarChart3,
  },
  {
    slug: 'video-streaming-platform',
    title: 'Video Platform',
    description: 'Video upload, processing, streaming with recommendations and engagement.',
    difficulty: 'advanced' as Difficulty,
    tech: ['Next.js', 'FFmpeg', 'AWS S3'],
    duration: '5–8 weeks',
    icon: Video,
  },
  {
    slug: 'auth-system',
    title: 'Authentication System',
    description: 'Complete auth with OAuth, MFA, sessions, password reset, and role-based access.',
    difficulty: 'intermediate' as Difficulty,
    tech: ['Node.js', 'JWT', 'PostgreSQL'],
    duration: '1–2 weeks',
    icon: Lock,
  },
];

const difficultyConfig = {
  beginner: { label: 'Beginner', color: '#A8F0E6', textColor: '#1A6B5C' },
  intermediate: { label: 'Intermediate', color: '#FFE066', textColor: '#7A5C00' },
  advanced: { label: 'Advanced', color: '#FFB36B', textColor: '#7A3D00' },
};

export default function ProjectsPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent-primary)]">
            Build
          </span>
          <h1 className="mt-3 text-h1 font-bold tracking-tight">
            Project{' '}
            <span className="font-serif italic font-normal">Ideas</span>
          </h1>
          <p className="mt-4 text-body-lg text-[var(--text-secondary)] leading-relaxed">
            Curated project ideas with architecture guidance, tech stacks, and
            milestones — from weekend builds to portfolio-worthy applications.
          </p>
        </div>

        {/* Difficulty Filter Chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="px-3 py-1.5 text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-full">
            All
          </span>
          {Object.entries(difficultyConfig).map(([key, config]) => (
            <span
              key={key}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            >
              {config.label}
            </span>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const Icon = project.icon;
            const diff = difficultyConfig[project.difficulty];
            return (
              <div
                key={project.slug}
                className="group relative flex flex-col p-5 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--bg-subtle)]">
                    <Icon className="w-4.5 h-4.5 text-[var(--text-secondary)]" />
                  </div>
                  <span
                    className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full"
                    style={{ backgroundColor: `${diff.color}30`, color: diff.textColor }}
                  >
                    {diff.label}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--text-subtle)] leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-medium text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-soft)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-subtle)]">
                    {project.duration}
                  </span>
                  <span className="inline-flex px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--text-subtle)] bg-[var(--bg-subtle)] rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Detailed project guides are coming
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Each project will include full architecture diagrams, step-by-step milestones,
            code structure, and deployment guides. Explore our tools while we build this.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-colors"
          >
            Explore tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
