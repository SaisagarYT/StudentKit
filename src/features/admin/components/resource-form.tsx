'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Eye, Check, Loader2, AlertCircle,
  Plus, Trash2, Code2, Sparkles,
  Brain, Layers, Tag, Clock, Globe, FileText,
  FolderGit2, ExternalLink, GitBranch,
  HelpCircle, CheckCircle2, ChevronDown, ChevronRight,
  Lightbulb, AlertTriangle, PlayCircle
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { resourceRepository } from '@/lib/cms/repository';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type {
  ResourceDomainType,
  CsSubject,
  ProjectTrack,
  Difficulty,
  ContentStatus,
  CsInterviewQuestion,
  ProjectMilestoneItem,
  CmsResource
} from '@/lib/cms/types';

interface ResourceFormProps {
  mode: 'create' | 'edit';
  resourceId?: string;
}

const CS_SUBJECTS: { value: CsSubject; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'operating-systems', label: 'Operating Systems', icon: Brain, color: '#3b82f6' },
  { value: 'dbms', label: 'Database Systems (DBMS)', icon: Layers, color: '#f97316' },
  { value: 'computer-networks', label: 'Computer Networks', icon: Globe, color: '#8b5cf6' },
  { value: 'oops', label: 'Object-Oriented Programming (OOP)', icon: Code2, color: '#10b981' },
  { value: 'system-design', label: 'High-Level & Low-Level System Design', icon: Layers, color: '#ec4899' },
];

const PROJECT_TRACKS: { value: ProjectTrack; label: string; color: string }[] = [
  { value: 'full-stack', label: 'Full Stack Web', color: '#6366f1' },
  { value: 'backend', label: 'Backend & Distributed Systems', color: '#06b6d4' },
  { value: 'frontend', label: 'Frontend & Interactive Apps', color: '#3b82f6' },
  { value: 'ai-ml', label: 'AI, LLM & Machine Learning', color: '#a855f7' },
  { value: 'mobile', label: 'Mobile Apps (iOS & Android)', color: '#10b981' },
  { value: 'devops', label: 'DevOps, CI/CD & Cloud Infrastructure', color: '#f59e0b' },
];

const DIFFICULTIES: { value: Difficulty; label: string; color: string; border: string; bg: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  { value: 'intermediate', label: 'Intermediate', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  { value: 'advanced', label: 'Advanced', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  { value: 'expert', label: 'Expert', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
];

const POPULAR_TECH_STACK = ['Next.js 15', 'React', 'TypeScript', 'Node.js', 'FastAPI', 'Python', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS', 'Kafka', 'GraphQL', 'Stripe'];

// Templates for 1-click authoring
const CS_TEMPLATES = [
  {
    title: 'Process Synchronization, Mutex, Semaphores & Deadlock Avoidance',
    subject: 'operating-systems' as CsSubject,
    difficulty: 'advanced' as Difficulty,
    tags: ['operating-systems', 'concurrency', 'semaphores', 'mutex', 'deadlocks', 'placement-prep'],
    shortDescription: 'Comprehensive guide covering Critical Section Problem, Peterson’s Algorithm, Mutex vs Counting Semaphores, and Banker’s Deadlock Algorithm with FAANG interview questions.',
    content: `## 1. The Critical Section Problem
When concurrent processes or threads share common storage or state, race conditions can occur if access is unregulated. 

A viable solution to the Critical Section problem must satisfy three strict conditions:
1. **Mutual Exclusion**: If process $P_i$ is executing in its critical section, no other process may execute in their critical section.
2. **Progress**: If no process is executing in its critical section and some wish to enter, only those processes not in their remainder section can participate in deciding who enters next.
3. **Bounded Waiting**: There must exist a bound on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter.

### Peterson's Two-Process Solution
\`\`\`c
// Shared variables
int turn;
bool flag[2];

// Process i (other is j = 1 - i)
while (true) {
    flag[i] = true;
    turn = j;
    while (flag[j] && turn == j) {
        // Busy wait (spin)
    }

    /* CRITICAL SECTION */

    flag[i] = false;

    /* REMAINDER SECTION */
}
\`\`\`

## 2. Mutex vs Binary Semaphore: The Deep Difference
> [!IMPORTANT]
> A common interview trap is answering *"A binary semaphore is just a mutex"*. This is **false**!
> - A **Mutex** has the concept of **ownership**: the exact thread that locked the mutex MUST be the thread that unlocks it. Mutexes often support priority inheritance to prevent Priority Inversion.
> - A **Semaphore** is a signaling mechanism with no ownership: any thread can post/signal a semaphore that was waited on by another thread.`,
    cheatSheetBullets: [
      'Critical section requires 3 invariants: Mutual Exclusion, Progress, Bounded Waiting.',
      'Mutex has thread ownership and priority inheritance; Semaphore is a signaling primitive with no ownership.',
      'Four Coffman conditions for deadlock: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
      'Banker’s Algorithm verifies safe states before allocation: Need Matrix = Max Matrix - Allocation Matrix.',
      'Spinlocks waste CPU in busy-wait; use them only if expected hold time is shorter than context switch cost.'
    ],
    commonPitfalls: [
      'Claiming binary semaphore and mutex are identical (violates ownership & priority inversion guarantees).',
      'Forgetting that disabling interrupts only works on single-core architectures, not modern SMP multi-core processors.',
      'Confusing Deadlock (threads permanently blocked) with Livelock (threads continuously change state in response to each other without making forward progress).'
    ],
    interviewQuestions: [
      {
        id: 'q1',
        question: 'What is Priority Inversion and how does Priority Inheritance Protocol solve it?',
        frequency: 'high' as const,
        companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        answer: `**Priority Inversion** is a scenario where a high-priority task ($H$) is indirectly preempted or blocked by a low-priority task ($L$), often because a medium-priority task ($M$) starves $L$ while $L$ holds a lock that $H$ needs.

### Example Scenario:
1. Low-priority task $L$ acquires Mutex $M_1$.
2. High-priority task $H$ preempts $L$ and attempts to acquire $M_1$. Since $M_1$ is locked, $H$ blocks.
3. Medium-priority task $M$ (which does not need $M_1$) preempts $L$ because $M > L$.
4. Now $M$ runs indefinitely, preventing $L$ from finishing its critical section. Consequently, $H$ is starved by $M$!

### The Solution: Priority Inheritance
When $H$ blocks waiting for a lock held by $L$, the OS temporarily elevates the effective priority of $L$ to match $H$. This prevents medium task $M$ from preempting $L$. As soon as $L$ releases $M_1$, its priority returns to its original base level, and $H$ immediately runs.`
      },
      {
        id: 'q2',
        question: 'Explain the four conditions necessary for a Deadlock to occur and how to break each.',
        frequency: 'high' as const,
        companies: ['Uber', 'Microsoft', 'Goldman Sachs'],
        answer: `Deadlock can arise if and only if all four **Coffman Conditions** hold simultaneously:

1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
   - *Prevention*: Make resources shareable (e.g. read-only files).
2. **Hold and Wait**: A process must be holding at least one resource and requesting additional resources held by others.
   - *Prevention*: Require processes to request all resources at once before starting execution.
3. **No Preemption**: Resources cannot be preempted; they can only be released voluntarily.
   - *Prevention*: If a process requesting a resource cannot get it, force it to release all currently held resources.
4. **Circular Wait**: A closed chain of processes exists such that each holds at least one resource needed by the next.
   - *Prevention (Industry Standard)*: Impose a **global total ordering** on all resource types. Every process must request resources strictly in increasing order of resource ID ($R_1 < R_2 < R_3$).`
      }
    ]
  },
  {
    title: 'Database Indexing Internals: B+ Trees vs LSM Trees & Storage Engines',
    subject: 'dbms' as CsSubject,
    difficulty: 'advanced' as Difficulty,
    tags: ['dbms', 'indexing', 'b-trees', 'lsm-trees', 'storage-engines', 'system-design'],
    shortDescription: 'In-depth analysis of physical page layout, high-fanout B+ Trees, write amplification in LSM Trees, Write-Ahead Logs (WAL), and Bloom Filters.',
    content: `## 1. Why Naive In-Memory Data Structures Fail on Disk
Disks read and write in fixed-size blocks called **pages** (usually 4KB, 8KB, or 16KB). In-memory trees (like AVL or Red-Black trees) have a fanout of 2, meaning a dataset of 10 million rows has a depth of $\\approx 24$.
If each node requires an individual disk I/O, a single point lookup would require 24 random page reads ($\approx 24 \times 5\text{ms} = 120\text{ms}$ on HDD or $2.4\text{ms}$ on SSD).

## 2. B+ Tree Architecture
A B+ Tree optimizes for disk block boundaries by maximizing the **fanout** (often 100 to 500 keys per node):
- Tree height is reduced to only 3 to 4 levels for hundreds of millions of keys.
- Internal nodes hold only routing keys and page pointers.
- All leaf nodes are linked as a doubly linked list, enabling $O(\\log_B N + K)$ range scans.`,
    cheatSheetBullets: [
      'B+ Trees store actual data pointers only at leaf nodes; internal nodes contain strictly routing keys.',
      'B+ Tree fanout is typically 100-500, keeping height to 3-4 even for millions of records.',
      'LSM Trees convert random writes into sequential writes via MemTable (RAM) and immutable SSTables (Disk).',
      'LSM Trees use Bloom Filters (probabilistic $O(1)$ bit array) to skip searching SSTables for non-existent keys.',
      'Clustered Index determines the physical order of data rows on disk (only one clustered index per table).'
    ],
    commonPitfalls: [
      'Indexing every column: drastically increases write latency and storage overhead due to index tree maintenance.',
      'Assuming LSM Trees are always better than B+ Trees: B+ Trees deliver far more predictable point read latencies.',
      'Ignoring index column order in composite indexes: \`INDEX (a, b)\` does NOT accelerate queries filtering only on \`b\`.'
    ],
    interviewQuestions: [
      {
        id: 'q1',
        question: 'Why do B+ Trees outperform B-Trees for relational database storage engines?',
        frequency: 'high' as const,
        companies: ['Meta', 'Amazon', 'Google'],
        answer: `B+ Trees offer two decisive advantages over traditional B-Trees:
1. **Higher Fanout (Shallower Depth)**: In a standard B-Tree, internal nodes must store both keys and data pointers. In a B+ Tree, internal nodes store only keys and child page pointers. Because child pointers are tiny, a page can pack significantly more keys, dramatically increasing the branching factor and lowering tree depth.
2. **Efficient Range Queries**: In a B+ Tree, all leaf pages are chained together sequentially via doubly linked pointers. A query like \`WHERE age BETWEEN 20 AND 30\` simply navigates to the first leaf node via tree traversal and then traverses sequentially along the linked list, avoiding costly repeated upward and downward tree traversals.`
      }
    ]
  }
];

const PROJECT_TEMPLATES = [
  {
    title: 'Full-Stack Micro-SaaS: Next.js 15, Multi-Tenancy, PostgreSQL & Stripe',
    projectTrack: 'full-stack' as ProjectTrack,
    difficulty: 'advanced' as Difficulty,
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Stripe', 'NextAuth.js'],
    tags: ['full-stack', 'saas', 'stripe', 'nextjs', 'multi-tenancy', 'database'],
    shortDescription: 'Production-ready engineering blueprint for an end-to-end multi-tenant SaaS application featuring organization workspaces, RBAC, Stripe subscription webhooks, and Prisma database migrations.',
    content: `## Project Architecture Overview
This blueprint guides you through building an enterprise-grade multi-tenant software application. You will implement subdomains/tenant isolation, OAuth 2.0 authentication, role-based access control (Admin, Member, Viewer), automated invoice generation via Stripe webhook events, and idempotent background jobs.`,
    githubStarterUrl: 'https://github.com/studentkit-templates/saas-starter',
    githubCompletedUrl: 'https://github.com/studentkit-templates/saas-production-complete',
    liveDemoUrl: 'https://demo-saas.studentkit.app',
    architectureOverview: 'Client requests are routed through Next.js 15 Edge Middleware which extracts the tenant organization slug. Requests are verified via JWT sessions and executed against a PostgreSQL database using Prisma ORM with tenant ID foreign key filtering.',
    challenges: [
      'Implement real-time audit logging using Server-Sent Events (SSE).',
      'Add end-to-end encryption for sensitive tenant API keys using AES-256-GCM.',
      'Build automated usage-based metering billing (charge per 1,000 API requests).'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Milestone 1: Multi-Tenant Database Schema & Prisma Migrations',
        objective: 'Architect the tenant data model with User, Organization, Membership, and Subscription tables with strict cascading rules.',
        content: `### 1. Initialize Prisma Schema
Define your models with strict tenant segregation:

\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  stripeCustomerId String? @unique
  createdAt DateTime @default(now())
  memberships Membership[]
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  memberships Membership[]
}

enum Role {
  OWNER
  ADMIN
  MEMBER
}

model Membership {
  id             String       @id @default(cuid())
  role           Role         @default(MEMBER)
  organizationId String
  userId         String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
}
\`\`\``,
        checkpoint: 'Run `npx prisma migrate dev --name init_tenancy` and ensure tables exist in PostgreSQL with 0 migration errors.'
      },
      {
        id: 'm2',
        title: 'Milestone 2: Stripe Billing Webhooks & Idempotent Event Handling',
        objective: 'Configure Stripe Checkout Session creation and build an idempotent webhook receiver for subscription events.',
        content: `### 2. Implementing the Webhook Route
Ensure raw body verification to validate Stripe signatures:

\`\`\`typescript
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    return new Response(\`Webhook Error: \${err.message}\`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Activate tenant subscription
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
\`\`\``,
        checkpoint: 'Execute `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and verify `checkout.session.completed` receives HTTP 200.'
      }
    ]
  }
];

export function ResourceForm({ mode, resourceId }: ResourceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Determine initial domain from query param or default
  const queryType = searchParams.get('type');
  const initialDomain: ResourceDomainType = queryType === 'project-guide' ? 'project-guide' : 'cs-fundamentals';

  // Core Form State
  const [resourceType, setResourceType] = useState<ResourceDomainType>(initialDomain);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [readTime, setReadTime] = useState(8);
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState('');

  // CS Fundamentals Specific State
  const [subject, setSubject] = useState<CsSubject>('operating-systems');
  const [diagramUrl, setDiagramUrl] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState<CsInterviewQuestion[]>([]);
  const [cheatSheetBullets, setCheatSheetBullets] = useState<string[]>([]);
  const [cheatBulletInput, setCheatBulletInput] = useState('');
  const [commonPitfalls, setCommonPitfalls] = useState<string[]>([]);
  const [pitfallInput, setPitfallInput] = useState('');

  // Project Guide Specific State
  const [projectTrack, setProjectTrack] = useState<ProjectTrack>('full-stack');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techStackInput, setTechStackInput] = useState('');
  const [githubStarterUrl, setGithubStarterUrl] = useState('');
  const [githubCompletedUrl, setGithubCompletedUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [architectureDiagram, setArchitectureDiagram] = useState('');
  const [architectureOverview, setArchitectureOverview] = useState('');
  const [milestones, setMilestones] = useState<ProjectMilestoneItem[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [challengeInput, setChallengeInput] = useState('');

  // UI Control State
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(0);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (mode === 'create') {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  // Word count & read time metrics
  const metrics = useMemo(() => {
    const totalWords = (content + ' ' + title + ' ' + shortDescription + ' ' + 
      milestones.map(m => m.content).join(' ') + ' ' +
      interviewQuestions.map(q => q.question + ' ' + q.answer).join(' ')
    ).trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(2, Math.ceil(totalWords / 200));
    return { words: totalWords, minutes };
  }, [content, title, shortDescription, milestones, interviewQuestions]);

  // Load existing resource in edit mode
  useEffect(() => {
    if (mode === 'edit' && resourceId) {
      resourceRepository.getById(resourceId).then((res) => {
        if (!res) {
          setError('Resource not found');
          setLoading(false);
          return;
        }
        setResourceType(res.resourceType || (res.category === 'guides' ? 'project-guide' : 'cs-fundamentals'));
        setTitle(res.title);
        setSlug(res.slug);
        setShortDescription(res.shortDescription || '');
        setDifficulty(res.difficulty);
        setTags(res.tags || []);
        setReadTime(res.readTime || 8);
        setStatus(res.status);
        setFeatured(res.featured);
        setContent(res.content || '');

        // CS fields
        setSubject(res.subject || 'operating-systems');
        setDiagramUrl(res.diagramUrl || '');
        setInterviewQuestions(res.interviewQuestions || []);
        setCheatSheetBullets(res.cheatSheetBullets || []);
        setCommonPitfalls(res.commonPitfalls || []);

        // Project fields
        setProjectTrack(res.projectTrack || 'full-stack');
        setTechStack(res.techStack || []);
        setGithubStarterUrl(res.githubStarterUrl || '');
        setGithubCompletedUrl(res.githubCompletedUrl || '');
        setLiveDemoUrl(res.liveDemoUrl || '');
        setArchitectureDiagram(res.architectureDiagram || '');
        setArchitectureOverview(res.architectureOverview || '');
        setMilestones(res.milestones || []);
        setChallenges(res.challenges || []);

        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setError('Failed to load resource');
        setLoading(false);
      });
    }
  }, [mode, resourceId]);

  // Save handler
  const handleSave = async (publishNow: boolean) => {
    if (!user) {
      setError('You must be logged in to save resources');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }
    if (!slug.trim()) {
      setError('Please provide a URL slug');
      return;
    }

    setSaving(true);
    setError('');

    const payload: Partial<CmsResource> & Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      resourceType,
      category: resourceType === 'project-guide' ? 'guides' : (subject === 'system-design' ? 'system-design' : 'concepts'),
      difficulty,
      content,
      readTime: metrics.minutes,
      status: publishNow ? 'published' : 'draft',
      featured,
      tags,
      order: 0,
      approaches: [],
      relatedProblems: [],
      relatedRoadmaps: [],
      relatedResources: [],
      prerequisites: [],
      seo: {
        title: `${title} | StudentKit`,
        description: shortDescription.slice(0, 155),
      }
    };

    if (resourceType === 'cs-fundamentals') {
      payload.subject = subject;
      payload.diagramUrl = diagramUrl;
      payload.interviewQuestions = interviewQuestions;
      payload.cheatSheetBullets = cheatSheetBullets;
      payload.commonPitfalls = commonPitfalls;
    } else {
      payload.projectTrack = projectTrack;
      payload.techStack = techStack;
      payload.githubStarterUrl = githubStarterUrl;
      payload.githubCompletedUrl = githubCompletedUrl;
      payload.liveDemoUrl = liveDemoUrl;
      payload.architectureDiagram = architectureDiagram;
      payload.architectureOverview = architectureOverview;
      payload.milestones = milestones;
      payload.challenges = challenges;
    }

    try {
      if (mode === 'create') {
        await resourceRepository.create(payload, user.uid);
        setSaveSuccess(true);
        setTimeout(() => router.push('/admin/resources'), 1200);
      } else if (resourceId) {
        await resourceRepository.update(resourceId, payload, user.uid);
        if (publishNow && status !== 'published') {
          await resourceRepository.publish(resourceId, user.uid);
          setStatus('published');
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for tags, tech stack, bullets, milestones, and questions
  const handleAddTag = (tagToAdd?: string) => {
    const t = (tagToAdd || tagInput).trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddTechStack = (techToAdd?: string) => {
    const t = (techToAdd || techStackInput).trim();
    if (t && !techStack.includes(t)) {
      setTechStack([...techStack, t]);
      setTechStackInput('');
    }
  };

  const handleRemoveTechStack = (item: string) => {
    setTechStack(techStack.filter(t => t !== item));
  };

  const handleAddCheatBullet = () => {
    if (cheatBulletInput.trim()) {
      setCheatSheetBullets([...cheatSheetBullets, cheatBulletInput.trim()]);
      setCheatBulletInput('');
    }
  };

  const handleRemoveCheatBullet = (idx: number) => {
    setCheatSheetBullets(cheatSheetBullets.filter((_, i) => i !== idx));
  };

  const handleAddPitfall = () => {
    if (pitfallInput.trim()) {
      setCommonPitfalls([...commonPitfalls, pitfallInput.trim()]);
      setPitfallInput('');
    }
  };

  const handleRemovePitfall = (idx: number) => {
    setCommonPitfalls(commonPitfalls.filter((_, i) => i !== idx));
  };

  const handleAddChallenge = () => {
    if (challengeInput.trim()) {
      setChallenges([...challenges, challengeInput.trim()]);
      setChallengeInput('');
    }
  };

  const handleRemoveChallenge = (idx: number) => {
    setChallenges(challenges.filter((_, i) => i !== idx));
  };

  // Interview Questions helper
  const handleAddInterviewQuestion = () => {
    const newQ: CsInterviewQuestion = {
      id: `q_${Date.now()}`,
      question: 'New Interview Question',
      answer: 'Explain the core concept, time/space complexity, and practical trade-offs...',
      frequency: 'high',
      companies: ['Google', 'Amazon'],
    };
    setInterviewQuestions([...interviewQuestions, newQ]);
    setActiveQuestionIndex(interviewQuestions.length);
  };

  const handleUpdateQuestion = (idx: number, patch: Partial<CsInterviewQuestion>) => {
    setInterviewQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...patch } : q));
  };

  const handleRemoveQuestion = (idx: number) => {
    setInterviewQuestions(prev => prev.filter((_, i) => i !== idx));
    if (activeQuestionIndex === idx) setActiveQuestionIndex(null);
  };

  // Milestones helper
  const handleAddMilestone = () => {
    const newM: ProjectMilestoneItem = {
      id: `m_${Date.now()}`,
      title: `Milestone ${milestones.length + 1}: Implementation Phase`,
      objective: 'Define the architectural objective and requirements for this phase.',
      content: '### Implementation Steps\n\n```typescript\n// Code example or configuration\n```',
      checkpoint: 'Run test suite or verification command to ensure completion.'
    };
    setMilestones([...milestones, newM]);
    setActiveMilestoneIndex(milestones.length);
  };

  const handleUpdateMilestone = (idx: number, patch: Partial<ProjectMilestoneItem>) => {
    setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, ...patch } : m));
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== idx));
    if (activeMilestoneIndex === idx) setActiveMilestoneIndex(null);
  };

  // Apply 1-Click Templates
  const applyCsTemplate = (tmpl: typeof CS_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    handleTitleChange(tmpl.title);
    setSubject(tmpl.subject);
    setDifficulty(tmpl.difficulty);
    setTags(tmpl.tags);
    setShortDescription(tmpl.shortDescription);
    setContent(tmpl.content);
    setCheatSheetBullets(tmpl.cheatSheetBullets);
    setCommonPitfalls(tmpl.commonPitfalls);
    setInterviewQuestions(tmpl.interviewQuestions);
    setShowTemplateModal(false);
  };

  const applyProjectTemplate = (tmpl: typeof PROJECT_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    handleTitleChange(tmpl.title);
    setProjectTrack(tmpl.projectTrack);
    setDifficulty(tmpl.difficulty);
    setTechStack(tmpl.techStack);
    setTags(tmpl.tags);
    setShortDescription(tmpl.shortDescription);
    setContent(tmpl.content);
    setGithubStarterUrl(tmpl.githubStarterUrl);
    setGithubCompletedUrl(tmpl.githubCompletedUrl);
    setLiveDemoUrl(tmpl.liveDemoUrl);
    setArchitectureOverview(tmpl.architectureOverview);
    setChallenges(tmpl.challenges);
    setMilestones(tmpl.milestones);
    setShowTemplateModal(false);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)] mx-auto mb-3" />
        <p className="text-xs text-[var(--text-subtle)] font-mono">Loading resource studio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-soft)] py-3 px-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/resources"
              className="p-1.5 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[var(--text-subtle)]">
                  Resources &gt; {resourceType === 'cs-fundamentals' ? 'CS Fundamentals' : 'Project Guides'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[var(--accent-dark)] text-[var(--accent-primary)] font-bold uppercase">
                  {mode}
                </span>
              </div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] truncate max-w-md">
                {title || 'Untitled Resource'}
              </h2>
            </div>
          </div>

          {/* Domain Studio Switcher Pill */}
          <div className="flex items-center bg-[var(--bg-surface)] p-1 rounded-sm border border-[var(--border-soft)]">
            <button
              type="button"
              onClick={() => setResourceType('cs-fundamentals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                resourceType === 'cs-fundamentals'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-xs'
                  : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              CS Fundamentals
            </button>
            <button
              type="button"
              onClick={() => setResourceType('project-guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                resourceType === 'project-guide'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                  : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Project Guides
            </button>
          </div>

          {/* View Modes & Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Template Scaffolder Button */}
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="hidden sm:inline">Templates</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[var(--bg-surface)] p-0.5 rounded-sm border border-[var(--border-soft)]">
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                  viewMode === 'editor' ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-subtle)]'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer hidden md:block ${
                  viewMode === 'split' ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-subtle)]'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                  viewMode === 'preview' ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-subtle)]'
                }`}
              >
                Live Preview
              </button>
            </div>

            {/* Save Draft */}
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              Save Draft
            </button>

            {/* Publish Live */}
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-sm bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity cursor-pointer shadow-xs border border-[var(--accent-primary)]/20 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {mode === 'create' ? 'Publish Live' : 'Update & Publish'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notifications & Error Alerts */}
        {error && (
          <div className="mt-2 p-2.5 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {saveSuccess && (
          <div className="mt-2 p-2.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Resource successfully saved!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Editor & Preview */}
      <div className={`grid gap-6 px-4 ${
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* ===================== LEFT COLUMN: THE EDITING STUDIO ===================== */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className="space-y-6">
            {/* 1. Core Meta Card */}
            <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
                <span>Core Article Information</span>
                <span className="text-[10px] font-mono text-[var(--text-subtle)]">Required for SEO & Hub</span>
              </h3>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Operating Systems: Process Synchronization & Mutex Internals"
                  className="w-full px-3 py-2 text-sm rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition-colors font-medium"
                />
              </div>

              {/* Slug & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center px-2.5 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                    <span className="text-[11px] font-mono text-[var(--text-subtle)] select-none">
                      /resources/view?slug=
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 text-xs font-mono text-[var(--text-primary)] outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Read Time (Minutes)
                  </label>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                    <input
                      type="number"
                      value={readTime || metrics.minutes}
                      onChange={(e) => setReadTime(parseInt(e.target.value) || metrics.minutes)}
                      className="w-full text-xs font-mono text-[var(--text-primary)] outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Executive Summary / Short Description
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="High-level 2-sentence summary rendered in search cards, social previews, and headers..."
                  className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Difficulty & Domain Sub-taxonomy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-soft)]">
                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                    Target Difficulty
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setDifficulty(d.value)}
                        className={`py-1 px-2 rounded-sm text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border text-center ${
                          difficulty === d.value
                            ? `${d.color} ${d.border} ${d.bg} shadow-xs`
                            : 'border-[var(--border-soft)] text-[var(--text-subtle)] hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CS Subject OR Project Track */}
                <div>
                  {resourceType === 'cs-fundamentals' ? (
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        CS Subject Classification
                      </label>
                      <Select
                        value={subject}
                        onValueChange={(val) => setSubject(val as CsSubject)}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {CS_SUBJECTS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Engineering Track
                      </label>
                      <Select
                        value={projectTrack}
                        onValueChange={(val) => setProjectTrack(val as ProjectTrack)}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Select Track" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TRACKS.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===================== CS FUNDAMENTALS SPECIFIC STUDIO ===================== */}
            {resourceType === 'cs-fundamentals' && (
              <>
                {/* 2. Concept Breakdown & Technical Depth Editor */}
                <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        Core Concept Editorial & Deep-Dive
                      </h3>
                      <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                        Theoretical foundations, mathematical models, proofs, and architectural tradeoffs
                      </p>
                    </div>
                  </div>

                  {/* Markdown Helper Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                    <button
                      type="button"
                      onClick={() => setContent(prev => prev + '\n## Section Heading\n')}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-xs hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(prev => prev + '\n### Sub-concept\n')}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-xs hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(prev => prev + ' **bold text** ')}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-xs hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(prev => prev + '\n```cpp\n// Code snippet\n```\n')}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-xs hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    >
                      Code Block
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(prev => prev + '\n> [!IMPORTANT]\n> Key architectural takeaway\n')}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-xs hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    >
                      Alert Tip
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent(prev => prev + '\n```mermaid\nflowchart TD\n  A[Process 1] --> B[Mutex Lock]\n```\n')}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-xs hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    >
                      Mermaid Diagram
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write the comprehensive concept explanation using markdown, LaTeX math formulas, tables, and code blocks..."
                    className="w-full p-3 text-xs font-mono rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] leading-relaxed resize-y"
                  />

                  {/* Architecture Diagram URL */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Visual Architecture / Mechanism Diagram Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={diagramUrl}
                      onChange={(e) => setDiagramUrl(e.target.value)}
                      placeholder="https://example.com/diagrams/os-synchronization.png or leave empty to use Mermaid"
                      className="w-full px-3 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                {/* 3. Interactive Interview Q&A Studio */}
                <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        Interactive Placement Interview Q&As ({interviewQuestions.length})
                      </h3>
                      <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                        High-yield interview questions asked at tier-1 tech firms with collapsible solutions
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddInterviewQuestion}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-sm bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Question
                    </button>
                  </div>

                  {/* Question Cards Accordion / List */}
                  {interviewQuestions.length === 0 ? (
                    <div className="p-4 rounded-sm border border-dashed border-[var(--border-soft)] text-center">
                      <p className="text-xs text-[var(--text-subtle)]">No interview questions added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddInterviewQuestion}
                        className="mt-2 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                      >
                        + Add First Interview Question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {interviewQuestions.map((q, idx) => {
                        const isOpen = activeQuestionIndex === idx;
                        return (
                          <div
                            key={q.id || idx}
                            className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] overflow-hidden"
                          >
                            <div
                              onClick={() => setActiveQuestionIndex(isOpen ? null : idx)}
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--bg-surface)] transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-amber-500/15 text-amber-400 font-bold shrink-0">
                                  Q{idx + 1}
                                </span>
                                <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                                  {q.question || 'Untitled Question'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-sm ${
                                  q.frequency === 'high' ? 'bg-rose-500/15 text-rose-400 font-bold' : 'bg-blue-500/15 text-blue-400'
                                }`}>
                                  {q.frequency || 'high'} Frequency
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveQuestion(idx);
                                  }}
                                  className="p-1 text-[var(--text-subtle)] hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                {isOpen ? <ChevronDown className="w-4 h-4 text-[var(--text-subtle)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />}
                              </div>
                            </div>

                            {isOpen && (
                              <div className="p-4 border-t border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-3">
                                {/* Question Title */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                    Question Prompt
                                  </label>
                                  <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) => handleUpdateQuestion(idx, { question: e.target.value })}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] font-medium"
                                  />
                                </div>

                                {/* Frequency & Companies */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                      Interview Frequency
                                    </label>
                                    <Select
                                      value={q.frequency || 'high'}
                                      onValueChange={(val) =>
                                        handleUpdateQuestion(idx, {
                                          frequency: val as 'high' | 'medium',
                                        })
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select Frequency" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="high">High Frequency (Top FAANG question)</SelectItem>
                                        <SelectItem value="medium">Medium Frequency (Occasional)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                      Companies (Comma-separated)
                                    </label>
                                    <input
                                      type="text"
                                      value={(q.companies || []).join(', ')}
                                      onChange={(e) => handleUpdateQuestion(idx, {
                                        companies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                      })}
                                      placeholder="Google, Amazon, Microsoft"
                                      className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none"
                                    />
                                  </div>
                                </div>

                                {/* Detailed Solution Answer */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                    Comprehensive Answer (Markdown supported)
                                  </label>
                                  <textarea
                                    rows={6}
                                    value={q.answer}
                                    onChange={(e) => handleUpdateQuestion(idx, { answer: e.target.value })}
                                    placeholder="Provide a clear, crisp answer highlighting definitions, code snippets, trade-offs, and edge cases..."
                                    className="w-full p-2.5 text-xs font-mono rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] leading-relaxed resize-y"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Rapid Revision Cheat Sheet & Common Traps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rapid Revision Cheat Sheet */}
                  <div className="p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      5-Minute Revision Cheat Sheet
                    </h3>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={cheatBulletInput}
                        onChange={(e) => setCheatBulletInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCheatBullet())}
                        placeholder="Add quick revision bullet point..."
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCheatBullet}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-sm bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--accent-primary)] border border-[var(--border-soft)] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {cheatSheetBullets.map((b, i) => (
                        <li key={i} className="flex items-start justify-between gap-2 p-1.5 rounded-sm bg-[var(--bg-subtle)] text-[11px] text-[var(--text-primary)]">
                          <span className="leading-tight">• {b}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCheatBullet(i)}
                            className="text-[var(--text-subtle)] hover:text-rose-400 shrink-0"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Pitfalls & Traps */}
                  <div className="p-4 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Common Interview Pitfalls
                    </h3>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={pitfallInput}
                        onChange={(e) => setPitfallInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPitfall())}
                        placeholder="Add tricky misconception / trap..."
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button
                        type="button"
                        onClick={handleAddPitfall}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-sm bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--accent-primary)] border border-[var(--border-soft)] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {commonPitfalls.map((p, i) => (
                        <li key={i} className="flex items-start justify-between gap-2 p-1.5 rounded-sm bg-[var(--bg-subtle)] text-[11px] text-[var(--text-primary)]">
                          <span className="leading-tight">⚠️ {p}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePitfall(i)}
                            className="text-[var(--text-subtle)] hover:text-rose-400 shrink-0"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* ===================== PROJECT GUIDE SPECIFIC STUDIO ===================== */}
            {resourceType === 'project-guide' && (
              <>
                {/* 2. Repositories & Tech Stack Pills */}
                <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                    Engineering Blueprint & Repository Links
                  </h3>

                  {/* Links Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                        GitHub Starter Repo URL
                      </label>
                      <input
                        type="url"
                        value={githubStarterUrl}
                        onChange={(e) => setGithubStarterUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                        Completed Solution Repo URL
                      </label>
                      <input
                        type="url"
                        value={githubCompletedUrl}
                        onChange={(e) => setGithubCompletedUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        placeholder="https://demo.example.com"
                        className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] font-mono"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Chips Builder */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                      Tech Stack Badges
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {POPULAR_TECH_STACK.map((item) => {
                        const isSelected = techStack.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => isSelected ? handleRemoveTechStack(item) : handleAddTechStack(item)}
                            className={`px-2 py-0.5 text-[10px] font-mono rounded-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                                : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] border border-[var(--border-soft)]'
                            }`}
                          >
                            {isSelected ? `✓ ${item}` : `+ ${item}`}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechStack())}
                        placeholder="Add custom library / framework..."
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTechStack()}
                        className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--accent-primary)] border border-[var(--border-soft)] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Architecture Diagram URL & Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-soft)]">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                        Architecture Blueprint Diagram URL
                      </label>
                      <input
                        type="text"
                        value={architectureDiagram}
                        onChange={(e) => setArchitectureDiagram(e.target.value)}
                        placeholder="https://example.com/diagrams/architecture.png"
                        className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                        Architecture Overview Notes
                      </label>
                      <input
                        type="text"
                        value={architectureOverview}
                        onChange={(e) => setArchitectureOverview(e.target.value)}
                        placeholder="Short summary of request lifecycle & data flow..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Milestone Checkpoints Builder */}
                <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Milestone Implementation Phases ({milestones.length})
                      </h3>
                      <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                        Step-by-step building phases with terminal verification tests for students
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Milestone
                    </button>
                  </div>

                  {milestones.length === 0 ? (
                    <div className="p-4 rounded-sm border border-dashed border-[var(--border-soft)] text-center">
                      <p className="text-xs text-[var(--text-subtle)]">No milestones created yet.</p>
                      <button
                        type="button"
                        onClick={handleAddMilestone}
                        className="mt-2 text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                      >
                        + Add Milestone 1
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {milestones.map((m, idx) => {
                        const isOpen = activeMilestoneIndex === idx;
                        return (
                          <div
                            key={m.id || idx}
                            className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] overflow-hidden"
                          >
                            <div
                              onClick={() => setActiveMilestoneIndex(isOpen ? null : idx)}
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[var(--bg-surface)] transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-400 font-bold shrink-0">
                                  Phase {idx + 1}
                                </span>
                                <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                                  {m.title || 'Untitled Milestone'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveMilestone(idx);
                                  }}
                                  className="p-1 text-[var(--text-subtle)] hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                {isOpen ? <ChevronDown className="w-4 h-4 text-[var(--text-subtle)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />}
                              </div>
                            </div>

                            {isOpen && (
                              <div className="p-4 border-t border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-3">
                                {/* Title & Objective */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                    Milestone Title
                                  </label>
                                  <input
                                    type="text"
                                    value={m.title}
                                    onChange={(e) => handleUpdateMilestone(idx, { title: e.target.value })}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] font-medium"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                    Core Objective
                                  </label>
                                  <input
                                    type="text"
                                    value={m.objective}
                                    onChange={(e) => handleUpdateMilestone(idx, { objective: e.target.value })}
                                    placeholder="What will the student build and configure in this milestone?"
                                    className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none"
                                  />
                                </div>

                                {/* Step-by-Step Instructions & Code */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                    Implementation Guide & Code Snippets (Markdown)
                                  </label>
                                  <textarea
                                    rows={8}
                                    value={m.content}
                                    onChange={(e) => handleUpdateMilestone(idx, { content: e.target.value })}
                                    placeholder="Write step-by-step code files, terminal commands, and configuration instructions..."
                                    className="w-full p-2.5 text-xs font-mono rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] leading-relaxed resize-y"
                                  />
                                </div>

                                {/* Verification Command / Test */}
                                <div>
                                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                                    <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    Verification Step / Test Criterion
                                  </label>
                                  <input
                                    type="text"
                                    value={m.checkpoint || ''}
                                    onChange={(e) => handleUpdateMilestone(idx, { checkpoint: e.target.value })}
                                    placeholder="e.g. Run `npm run test:api` or `curl localhost:3000/api/health` and verify 200 OK"
                                    className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none font-mono"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Production & Extension Challenges */}
                <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Resume-Boosting Extension Challenges
                  </h3>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={challengeInput}
                      onChange={(e) => setChallengeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChallenge())}
                      placeholder="Add real-world production challenge (e.g. Implement webhook retries with Redis queue)..."
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                    />
                    <button
                      type="button"
                      onClick={handleAddChallenge}
                      className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--accent-primary)] border border-[var(--border-soft)] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {challenges.map((ch, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 p-2 rounded-sm bg-[var(--bg-subtle)] text-xs text-[var(--text-primary)]">
                        <span>🚀 {ch}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChallenge(i)}
                          className="text-[var(--text-subtle)] hover:text-rose-400"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* 5. Tags & Taxonomy Card */}
            <div className="p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Tags & Global Taxonomy
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-sm bg-[var(--accent-dark)] text-[var(--accent-primary)] font-bold"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-400 cursor-pointer ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add custom tag..."
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-[var(--bg-subtle)] hover:bg-[var(--accent-dark)] hover:text-[var(--accent-primary)] border border-[var(--border-soft)] cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== RIGHT COLUMN: LIVE STUDENT PREVIEW ===================== */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 shadow-sm overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--border-soft)]">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Live Student Viewport
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                {resourceType === 'cs-fundamentals' ? 'CS Fundamentals Reader' : 'Project Blueprint Reader'}
              </span>
            </div>

            {/* Breadcrumb preview */}
            <div className="text-[11px] font-mono text-[var(--text-subtle)] mb-3">
              Home &gt; Resources &gt; {resourceType === 'cs-fundamentals' ? subject : projectTrack} &gt; {title || 'Untitled'}
            </div>

            {/* Title & Meta */}
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {title || 'Article Title'}
            </h1>
            {shortDescription && (
              <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                {shortDescription}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3 mb-6">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-400">
                {difficulty}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                {metrics.minutes} min read
              </span>
              {resourceType === 'project-guide' && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                  {milestones.length} Milestones
                </span>
              )}
              {resourceType === 'cs-fundamentals' && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-sm">
                  {interviewQuestions.length} Interview Q&As
                </span>
              )}
            </div>

            {/* Project Specific Live Previews */}
            {resourceType === 'project-guide' && (
              <div className="space-y-6">
                {/* Action Buttons Bar */}
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                  {githubStarterUrl && (
                    <a
                      href={githubStarterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      Starter Repo
                    </a>
                  )}
                  {githubCompletedUrl && (
                    <a
                      href={githubCompletedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Completed Code
                    </a>
                  )}
                  {liveDemoUrl && (
                    <a
                      href={liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--accent-primary)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Tech Stack Bar */}
                {techStack.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-mono uppercase text-[var(--text-subtle)] mb-1.5">Tech Stack</h4>
                    <div className="flex flex-wrap gap-1">
                      {techStack.map(ts => (
                        <span key={ts} className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-soft)]">
                          {ts}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Overview */}
                {architectureOverview && (
                  <div className="p-3.5 rounded-sm bg-blue-500/5 border border-blue-500/20 text-xs text-blue-300">
                    <p className="font-bold mb-1">Architecture Blueprint</p>
                    <p>{architectureOverview}</p>
                  </div>
                )}

                {/* Milestones Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Milestones Roadmap
                  </h3>
                  {milestones.map((m, i) => (
                    <div key={i} className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 font-bold">
                          Step {i + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">{m.title}</h4>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{m.objective}</p>
                      <div className="pt-2 border-t border-[var(--border-soft)]">
                        <MarkdownRenderer content={m.content} />
                      </div>
                      {m.checkpoint && (
                        <div className="mt-2 p-2 rounded-sm bg-[var(--bg-base)] border border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                          <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Test: {m.checkpoint}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Extension Challenges */}
                {challenges.length > 0 && (
                  <div className="p-4 rounded-sm bg-amber-500/5 border border-amber-500/20">
                    <h4 className="text-xs font-bold text-amber-400 mb-2">Extension Challenges</h4>
                    <ul className="space-y-1">
                      {challenges.map((c, i) => (
                        <li key={i} className="text-xs text-[var(--text-primary)]">🚀 {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CS Fundamentals Specific Live Previews */}
            {resourceType === 'cs-fundamentals' && (
              <div className="space-y-6">
                {/* Concept Markdown */}
                {content && (
                  <div className="prose-container">
                    <MarkdownRenderer content={content} />
                  </div>
                )}

                {/* Rapid Revision Cheat Sheet Preview */}
                {cheatSheetBullets.length > 0 && (
                  <div className="p-4 rounded-sm bg-amber-500/10 border border-amber-500/20">
                    <h3 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      5-Minute Pre-Interview Cheat Sheet
                    </h3>
                    <ul className="space-y-1">
                      {cheatSheetBullets.map((b, i) => (
                        <li key={i} className="text-xs text-[var(--text-primary)] leading-relaxed">
                          • {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interview Questions Preview */}
                {interviewQuestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      Interview Questions & Solutions
                    </h3>
                    {interviewQuestions.map((q, i) => (
                      <div key={i} className="p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[var(--text-primary)]">
                            Q{i + 1}: {q.question}
                          </p>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-rose-500/10 text-rose-400 uppercase font-bold">
                            {q.frequency} Frequency
                          </span>
                        </div>
                        {q.companies && q.companies.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-[var(--text-subtle)]">Asked at:</span>
                            {q.companies.map(c => (
                              <span key={c} className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-[var(--bg-base)] text-[var(--text-subtle)]">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="p-2.5 rounded-sm bg-[var(--bg-base)] border border-[var(--border-soft)] text-xs">
                          <MarkdownRenderer content={q.answer} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Common Pitfalls Preview */}
                {commonPitfalls.length > 0 && (
                  <div className="p-4 rounded-sm bg-rose-500/10 border border-rose-500/20">
                    <h3 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Common Traps & Interview Pitfalls
                    </h3>
                    <ul className="space-y-1">
                      {commonPitfalls.map((p, i) => (
                        <li key={i} className="text-xs text-[var(--text-primary)]">⚠️ {p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1-Click Editorial Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-soft)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                  1-Click Industry Standard Templates
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Select a pre-engineered template to scaffold high-yield resources in seconds
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              <div className="text-[10px] font-mono uppercase text-[var(--text-subtle)] font-bold">
                CS Fundamentals & Placement Templates
              </div>
              {CS_TEMPLATES.map((tmpl, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setResourceType('cs-fundamentals');
                    applyCsTemplate(tmpl);
                  }}
                  className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-blue-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-blue-500/15 text-blue-400 font-bold uppercase">
                          {tmpl.subject}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                          {tmpl.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {tmpl.shortDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-mono text-amber-400">
                          {tmpl.interviewQuestions.length} Interview Q&As
                        </span>
                        <span className="text-[9px] font-mono text-[var(--text-subtle)]">
                          • {tmpl.cheatSheetBullets.length} Cheat Sheet Bullets
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-[10px] font-mono uppercase text-[var(--text-subtle)] font-bold pt-2">
                Project Guide & Engineering Blueprint Templates
              </div>
              {PROJECT_TEMPLATES.map((tmpl, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setResourceType('project-guide');
                    applyProjectTemplate(tmpl);
                  }}
                  className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-emerald-500/15 text-emerald-400 font-bold uppercase">
                          {tmpl.projectTrack}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                          {tmpl.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {tmpl.shortDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-mono text-emerald-400">
                          {tmpl.milestones.length} Milestones
                        </span>
                        <span className="text-[9px] font-mono text-[var(--text-subtle)]">
                          • Stack: {tmpl.techStack.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
