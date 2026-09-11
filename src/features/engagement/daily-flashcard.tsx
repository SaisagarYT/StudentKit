'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { interviewSections } from '@/config/placement/interview';
import { logXpEvent } from '@/lib/xp';
import { cn } from '@/lib/utils';

// Flatten questions for daily rotation
const ALL_QUESTIONS = interviewSections.flatMap((section) =>
  section.questions.map((q) => ({
    ...q,
    sectionTitle: section.title,
    sectionColor: section.color,
  }))
);

function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDailyQuestionIndex(todayStr: string) {
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash << 5) - hash + todayStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % Math.max(1, ALL_QUESTIONS.length);
}

export function DailyFlashcard() {
  const [todayStr, setTodayStr] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const today = getTodayString();
    setTodayStr(today);
    try {
      const saved = localStorage.getItem(`sk-daily-flashcard-${today}`);
      if (saved === 'completed') {
        setCompleted(true);
        setRevealed(true);
      }
    } catch {}
    setMounted(true);
  }, []);

  if (!mounted || ALL_QUESTIONS.length === 0) return null;

  const questionIndex = getDailyQuestionIndex(todayStr);
  const currentQ = ALL_QUESTIONS[questionIndex];

  const handleMarkKnown = () => {
    try {
      localStorage.setItem(`sk-daily-flashcard-${todayStr}`, 'completed');
    } catch {}
    setCompleted(true);
    logXpEvent('DAILY_FLASHCARD', 'Mastered daily interview question (+15 XP)');
  };

  return (
    <div className="p-5 md:p-6 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[var(--accent-primary)]/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-sm bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center justify-center">
            <Brain className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)]">
            Daily Interview Flashcard
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            +15 XP
          </span>
          <span className="text-[10px] font-medium text-[var(--text-subtle)] hidden sm:inline">
            {currentQ.sectionTitle}
          </span>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug mt-2">
        {currentQ.question}
      </h3>

      {/* Answer / Tips Area */}
      {revealed ? (
        <div className="mt-4 pt-4 border-t border-[var(--border-soft)] space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            How to Answer & Key Points:
          </div>

          <ul className="space-y-1.5">
            {currentQ.tips.map((tip, idx) => (
              <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {currentQ.sampleAnswer && (
            <div className="mt-3 p-3 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] block mb-1">
                Sample High-Impact Response:
              </span>
              <p className="text-xs text-[var(--text-primary)] italic leading-relaxed">
                &ldquo;{currentQ.sampleAnswer}&rdquo;
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-4 pt-2 flex items-center justify-between flex-wrap gap-2">
            {completed ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                Mastered for today! +15 XP Claimed
              </div>
            ) : (
              <button
                onClick={handleMarkKnown}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:bg-[var(--accent-primary)] hover:text-black transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                I Got This (+15 XP)
              </button>
            )}

            <Link
              href="/placement/interview"
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Browse 60+ interview questions
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-3 flex items-center justify-between">
          <button
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-sm border border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Reveal Answer & Tips
          </button>

          <span className="text-[11px] text-[var(--text-subtle)]">
            Test yourself before checking!
          </span>
        </div>
      )}
    </div>
  );
}

