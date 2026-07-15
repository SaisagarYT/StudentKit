'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, ArrowRight, ArrowLeft, Sparkles, MapPin } from 'lucide-react';

interface TourStep {
  target?: string;
  title: string;
  description: string;
  page?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to StudentKit!',
    description: 'Let us show you around. This quick tour will highlight the key features so you can get the most out of the platform.',
  },
  {
    target: '[data-tour="search"]',
    title: 'Quick Search (Cmd+K)',
    description: 'Press Cmd+K (or Ctrl+K) anytime to instantly search across all tools, roadmaps, and pages. Try it!',
    position: 'bottom',
    page: '/',
  },
  {
    target: '[data-tour="nav-tools"]',
    title: 'Tools & Calculators',
    description: 'Hover here to see all tools — attendance calculator, CGPA, salary breakdown, image tools, and more. All run in your browser, no data leaves your device.',
    position: 'bottom',
    page: '/',
  },
  {
    target: '[data-tour="nav-roadmaps"]',
    title: 'Career Roadmaps',
    description: 'Interactive, stage-by-stage paths for Frontend, Backend, Full Stack, AI/ML, DevOps, and more. Each topic has curated resources and a mini project.',
    position: 'bottom',
    page: '/',
  },
  {
    target: '[data-tour="nav-projects"]',
    title: 'Curated Projects',
    description: 'Guided projects with milestones, architecture advice, and folder structure. Build real apps step by step.',
    position: 'bottom',
    page: '/',
  },
  {
    target: '[data-tour="nav-opensource"]',
    title: 'Open Source Discovery',
    description: 'Find beginner-friendly GitHub repos filtered by language and difficulty. Start your open-source journey here.',
    position: 'bottom',
    page: '/',
  },
  {
    title: 'You\'re all set!',
    description: 'Explore at your own pace. Remember: Cmd+K to search, and the nav bar to browse. Happy learning!',
  },
];

const TOUR_STORAGE_KEY = 'sk-tour-completed';
const TOUR_DISMISSED_KEY = 'sk-tour-dismissed';

export function ProductTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrow: string } | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Show prompt for first-time visitors (not on admin pages)
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    const dismissed = localStorage.getItem(TOUR_DISMISSED_KEY);
    if (!completed && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const currentStep = TOUR_STEPS[step];

  const positionTooltip = useCallback(() => {
    if (!currentStep?.target) {
      setTooltipPos(null);
      return;
    }

    const el = document.querySelector(currentStep.target);
    if (!el) {
      setTooltipPos(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const pos = currentStep.position || 'bottom';
    const tooltipWidth = 320;
    const gap = 12;

    let top = 0;
    let left = 0;
    let arrow = '';

    switch (pos) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrow = 'top';
        break;
      case 'top':
        top = rect.top - gap - 160;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrow = 'bottom';
        break;
      case 'left':
        top = rect.top + rect.height / 2 - 80;
        left = rect.left - tooltipWidth - gap;
        arrow = 'right';
        break;
      case 'right':
        top = rect.top + rect.height / 2 - 80;
        left = rect.right + gap;
        arrow = 'left';
        break;
    }

    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    top = Math.max(16, top);

    setTooltipPos({ top, left, arrow });

    // Highlight the target element
    el.classList.add('tour-highlight');
    return () => el.classList.remove('tour-highlight');
  }, [currentStep]);

  useEffect(() => {
    if (!active) return;
    const cleanup = positionTooltip();

    const handleResize = () => positionTooltip();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      cleanup?.();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [active, step, positionTooltip]);

  // Navigate to the right page if needed
  useEffect(() => {
    if (!active || !currentStep?.page) return;
    if (pathname !== currentStep.page) {
      router.push(currentStep.page);
    }
  }, [active, step, currentStep, pathname, router]);

  function startTour() {
    setShowPrompt(false);
    setStep(0);
    setActive(true);
    if (pathname !== '/') router.push('/');
  }

  function nextStep() {
    // Clean previous highlight
    if (currentStep?.target) {
      document.querySelector(currentStep.target)?.classList.remove('tour-highlight');
    }
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      endTour();
    }
  }

  function prevStep() {
    if (currentStep?.target) {
      document.querySelector(currentStep.target)?.classList.remove('tour-highlight');
    }
    if (step > 0) setStep(step - 1);
  }

  function endTour() {
    if (currentStep?.target) {
      document.querySelector(currentStep.target)?.classList.remove('tour-highlight');
    }
    setActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }

  function dismissPrompt() {
    setShowPrompt(false);
    localStorage.setItem(TOUR_DISMISSED_KEY, 'true');
  }

  // First-time prompt bubble
  if (showPrompt && !active) {
    return (
      <div className="fixed bottom-6 right-6 z-[90] animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-xl p-5 max-w-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[var(--accent-dark)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">New here?</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Take a quick tour to see what StudentKit can do for you.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={startTour}
              className="flex-1 px-4 py-2 text-xs font-medium rounded-lg bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
            >
              Start Tour
            </button>
            <button
              onClick={dismissPrompt}
              className="px-3 py-2 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!active) return null;

  const isFirstOrLast = !currentStep.target;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[95] bg-black/30 backdrop-blur-[2px] pointer-events-none" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[100] w-80"
        style={
          tooltipPos
            ? { top: tooltipPos.top, left: tooltipPos.left }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        }
      >
        <div className={`bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-2xl p-5 relative ${isFirstOrLast ? 'text-center' : ''}`}>
          {/* Arrow */}
          {tooltipPos?.arrow === 'top' && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[var(--bg-surface)] border-l border-t border-[var(--border-soft)]" />
          )}

          {/* Close */}
          <button
            onClick={endTour}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon for first/last steps */}
          {isFirstOrLast && (
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
              {step === 0 ? <Sparkles className="w-6 h-6 text-[var(--accent-dark)]" /> : <MapPin className="w-6 h-6 text-[var(--accent-dark)]" />}
            </div>
          )}

          {/* Content */}
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 pr-6">{currentStep.title}</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{currentStep.description}</p>

          {/* Progress & actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-soft)]">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === step ? 'bg-[var(--accent-dark)] w-4' : i < step ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-default)]'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={prevStep}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity"
              >
                {step === TOUR_STEPS.length - 1 ? 'Done' : 'Next'}
                {step < TOUR_STEPS.length - 1 && <ArrowRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
