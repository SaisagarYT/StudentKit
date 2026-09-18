'use client';

import { Building2, Server, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

const tiers = [
  {
    category: 'Tier 1 • Global Big Tech',
    name: 'FAANG & Top Product Companies',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
    icon: Building2,
    evaluation: 'Algorithmic mastery, optimal time/space complexity, edge cases, and architectural foundations.',
    keyFocus: 'Trees & Graphs, Dynamic Programming, Heap/Greedy, System Design basics',
    rounds: 'OA (2-3 Medium/Hard) → 2-3 Live Coding Rounds → System Design / Behavioral (Bar Raiser)',
  },
  {
    category: 'Tier 2 • High-Growth Unicorns',
    name: 'Product Startups & Fintech',
    companies: ['Razorpay', 'Swiggy', 'Zerodha', 'CRED', 'Flipkart'],
    icon: Server,
    evaluation: 'Practical software engineering, machine coding, Low-Level Design (LLD), and clean code principles.',
    keyFocus: 'OOP Design Patterns, Concurrency, SQL & Schema Modeling, REST APIs',
    rounds: 'Machine Coding (2 hrs working code) → Problem Solving → LLD Review → Culture Round',
  },
  {
    category: 'Tier 3 • Major Tech Enterprise',
    name: 'Enterprise Tech & Mass Recruiters',
    companies: ['TCS Digital', 'Infosys', 'Accenture', 'Cognizant'],
    icon: Cpu,
    evaluation: 'Fast problem solving on fundamental algorithms, SQL queries, and core CS definitions.',
    keyFocus: 'Arrays, Strings, Recursion, SQL Joins, OS Process & Memory Management',
    rounds: 'Aptitude & Coding Exam → Combined Technical Interview (CS Core + Code) → HR Round',
  },
];

export function CompanyTracksGrid() {
  return (
    <div className="mb-20">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-subtle)]">
          Company-Wise Expectations
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
          How Different Tiers Evaluate Candidates
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mt-1">
          Tailor your preparation to your target company type. Each tier emphasizes distinct skill sets during evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier, idx) => {
          const Icon = tier.icon;
          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="flex flex-col p-6 rounded-md border border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-sm space-y-4"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                    {tier.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {tier.name}
                </h3>
              </div>

              {/* Companies Tags */}
              <div className="flex flex-wrap gap-1.5">
                {tier.companies.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Evaluation Criteria */}
              <div className="pt-3 border-t border-[var(--border-soft)] space-y-2 flex-1">
                <div>
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                    What They Test
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                    {tier.evaluation}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                    Critical Focus
                  </span>
                  <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed mt-0.5">
                    {tier.keyFocus}
                  </p>
                </div>
              </div>

              {/* Typical Rounds Strip */}
              <div className="pt-3 border-t border-[var(--border-soft)]">
                <span className="text-[10px] font-mono uppercase text-[var(--text-subtle)] block mb-1">
                  Typical Interview Loop:
                </span>
                <p className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug">
                  {tier.rounds}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

