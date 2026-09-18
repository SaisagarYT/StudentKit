'use client';

import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const playbookSteps = [
  {
    step: '01',
    timeline: 'Weeks 1 – 4',
    title: 'Language & STL Mastery',
    description: 'Master one primary language deeply (C++, Java, or Python). Learn time & space complexity analysis (Big-O) and standard library data structures.',
    deliverable: 'Comfortable writing code without IDE autocomplete.',
  },
  {
    step: '02',
    timeline: 'Weeks 5 – 8',
    title: 'Foundational Data Structures',
    description: 'Implement and master Arrays, Hash Tables, Strings, Linked Lists, Stacks, and Queues. Focus on two-pointer techniques and frequency counters.',
    deliverable: 'First 50 Easy/Medium problems solved.',
  },
  {
    step: '03',
    timeline: 'Weeks 9 – 14',
    title: 'Algorithmic Patterns',
    description: 'Transition from brute force to structured patterns: Sliding Window, Binary Search, Tree Traversals (BFS/DFS), and Heap/Priority Queues.',
    deliverable: 'Recognize pattern archetypes within 3 minutes.',
  },
  {
    step: '04',
    timeline: 'Weeks 15 – 18',
    title: 'CS Core Subjects',
    description: 'Study Operating Systems (deadlocks, threads, virtual memory), DBMS (indexing, SQL joins, transactions), Computer Networks, and OOP principles.',
    deliverable: 'Ready for 45-minute deep technical viva rounds.',
  },
  {
    step: '05',
    timeline: 'Weeks 19 – 22',
    title: 'Advanced Algorithms & DP',
    description: 'Tackle Graph algorithms (Dijkstra, Topological Sort), Dynamic Programming (1D, 2D, Knapsack), and Backtracking.',
    deliverable: '200+ total problems completed on the DSA Sheet.',
  },
  {
    step: '06',
    timeline: 'Weeks 23 – 26',
    title: 'Mock Rounds & Applications',
    description: 'Practice timed coding (45-min timer). Polish behavioral answers with the STAR framework. Align your resume and actively apply.',
    deliverable: 'Passed 3+ mock interviews with live feedback.',
  },
];

export function PlacementPlaybook() {
  return (
    <div className="mb-20">
      <div className="flex items-center gap-2.5 mb-2">
        <TrendingUp className="w-5 h-5 text-[var(--accent-dark)]" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          The 6-Month Placement Playbook
        </h2>
      </div>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-8 max-w-xl">
        A structured, chronological roadmap from complete beginner to landing top-tier offers. Consistency over intensity is key.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playbookSteps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 * idx }}
            whileHover={{ y: -2 }}
            className="flex flex-col p-5 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-black font-mono text-[var(--accent-dark)]">
                {item.step}
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]">
                {item.timeline}
              </span>
            </div>

            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">
              {item.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">
              {item.description}
            </p>

            <div className="mt-4 pt-3 border-t border-[var(--border-soft)] flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)] shrink-0 mt-0.5" />
              <span className="text-[11px] font-medium text-[var(--text-primary)]">
                {item.deliverable}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

