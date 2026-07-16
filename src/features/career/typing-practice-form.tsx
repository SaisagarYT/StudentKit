'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { RotateCcw, Trophy } from 'lucide-react';

type TestMode = 'time' | 'words';
type TextCorpus = 'common' | 'programming' | 'quotes';
type TestState = 'idle' | 'running' | 'finished';

interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  timeTaken: number;
  wpmHistory: number[];
}

interface PersonalBest {
  wpm: number;
  accuracy: number;
  mode: string;
  date: string;
}

const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'under', 'never', 'each', 'much', 'begin', 'life',
  'where', 'every', 'start', 'hand', 'high', 'place', 'again', 'small', 'part', 'long',
  'move', 'right', 'world', 'still', 'last', 'tell', 'does', 'set', 'three', 'own',
  'point', 'end', 'why', 'ask', 'men', 'change', 'went', 'light', 'kind', 'off',
  'turn', 'put', 'play', 'run', 'keep', 'while', 'found', 'help', 'through', 'home',
  'should', 'try', 'many', 'write', 'word', 'must', 'call', 'read', 'few', 'old',
  'follow', 'learn', 'same', 'children', 'before', 'open', 'grow', 'together', 'next', 'both',
  'those', 'always', 'show', 'side', 'live', 'around', 'thought', 'another', 'below', 'hard',
  'real', 'left', 'might', 'close', 'something', 'number', 'without', 'story', 'often', 'head',
  'early', 'city', 'seem', 'later', 'until', 'along', 'family', 'night', 'enough', 'study',
];

const PROGRAMMING_WORDS = [
  'function', 'const', 'return', 'async', 'await', 'promise', 'import', 'export',
  'default', 'class', 'interface', 'type', 'string', 'number', 'boolean', 'null',
  'undefined', 'array', 'object', 'map', 'filter', 'reduce', 'forEach', 'push',
  'pop', 'shift', 'slice', 'splice', 'concat', 'indexOf', 'includes', 'find',
  'component', 'props', 'state', 'effect', 'render', 'mount', 'update', 'context',
  'callback', 'handler', 'event', 'listener', 'dispatch', 'action', 'reducer', 'store',
  'module', 'package', 'dependency', 'config', 'server', 'client', 'request', 'response',
  'fetch', 'data', 'json', 'parse', 'stringify', 'encode', 'decode', 'buffer',
  'stream', 'pipe', 'error', 'catch', 'throw', 'try', 'finally', 'debug',
  'console', 'log', 'warn', 'test', 'describe', 'expect', 'assert', 'mock',
  'variable', 'parameter', 'argument', 'scope', 'closure', 'prototype', 'inherit', 'extend',
  'abstract', 'static', 'private', 'public', 'protected', 'readonly', 'generic', 'enum',
  'switch', 'case', 'break', 'continue', 'while', 'loop', 'iterate', 'recursive',
  'algorithm', 'structure', 'node', 'tree', 'graph', 'stack', 'queue', 'linked',
  'binary', 'search', 'sort', 'merge', 'insert', 'delete', 'update', 'query',
  'database', 'table', 'schema', 'index', 'primary', 'foreign', 'key', 'value',
  'cache', 'memory', 'storage', 'session', 'token', 'auth', 'middleware', 'route',
  'endpoint', 'method', 'header', 'body', 'status', 'code', 'deploy', 'build',
  'compile', 'bundle', 'minify', 'optimize', 'performance', 'render', 'hydrate', 'lazy',
  'suspense', 'boundary', 'fallback', 'loading', 'skeleton', 'placeholder', 'template', 'layout',
];

const QUOTES = [
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'First solve the problem then write the code.',
  'Experience is the name everyone gives to their mistakes.',
  'In order to be irreplaceable one must always be different.',
  'Java is to JavaScript what car is to carpet.',
  'Knowledge is power.',
  'Talk is cheap. Show me the code.',
  'Programs must be written for people to read and only incidentally for machines to execute.',
  'The best way to predict the future is to invent it.',
  'Simplicity is the soul of efficiency.',
  'Make it work make it right make it fast.',
  'Code is like humor. When you have to explain it it is bad.',
  'Fix the cause not the symptom.',
  'Before software can be reusable it first has to be usable.',
  'The most disastrous thing that you can ever learn is your first programming language.',
  'The only way to learn a new programming language is by writing programs in it.',
  'Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging Monday code.',
  'Deleted code is debugged code.',
  'If debugging is the process of removing software bugs then programming must be the process of putting them in.',
  'The best error message is the one that never shows up.',
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateText(corpus: TextCorpus, wordCount: number): string {
  if (corpus === 'quotes') {
    const shuffled = shuffleArray(QUOTES);
    let text = '';
    let i = 0;
    while (text.split(' ').length < wordCount) {
      text += (text ? ' ' : '') + shuffled[i % shuffled.length];
      i++;
    }
    return text.split(' ').slice(0, wordCount).join(' ');
  }
  const words = corpus === 'programming' ? PROGRAMMING_WORDS : COMMON_WORDS;
  const shuffled = shuffleArray(words);
  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result.join(' ');
}

function getWordCountForTimeMode(seconds: number): number {
  return Math.ceil((seconds / 60) * 120);
}

function loadPersonalBest(): PersonalBest | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('sk-typing-pb');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function savePersonalBest(pb: PersonalBest): void {
  try {
    localStorage.setItem('sk-typing-pb', JSON.stringify(pb));
  } catch {}
}

function WpmChart({ history, timeTaken }: { history: number[]; timeTaken: number }) {
  if (history.length < 2) return null;

  const maxWpm = Math.max(...history, 10);
  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 40, bottom: 30, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = history.map((wpm, i) => {
    const x = padding.left + (i / (history.length - 1)) * chartW;
    const y = padding.top + chartH - (wpm / maxWpm) * chartH;
    return `${x},${y}`;
  }).join(' ');

  const yTicks = [0, Math.round(maxWpm / 2), maxWpm];
  const totalSeconds = Math.ceil(timeTaken);
  const xTickCount = Math.min(totalSeconds, 10);
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) =>
    Math.round((i / xTickCount) * totalSeconds)
  );

  return (
    <div className="tt-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map(tick => {
          const y = padding.top + chartH - (tick / maxWpm) * chartH;
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--border-soft)" strokeWidth="1" strokeDasharray="4,4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-subtle)">{tick}</text>
            </g>
          );
        })}

        {/* X axis labels */}
        {xTicks.map(tick => {
          const x = padding.left + (tick / totalSeconds) * chartW;
          return (
            <text key={tick} x={x} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-subtle)">{tick}</text>
          );
        })}

        {/* WPM line */}
        <polyline
          points={points}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area fill */}
        <polygon
          points={`${padding.left},${padding.top + chartH} ${points} ${padding.left + chartW},${padding.top + chartH}`}
          fill="var(--accent-primary)"
          opacity="0.08"
        />

        {/* Y axis label */}
        <text x={12} y={padding.top + chartH / 2} textAnchor="middle" fontSize="10" fill="var(--text-subtle)" transform={`rotate(-90, 12, ${padding.top + chartH / 2})`}>Words per Minute</text>
      </svg>
    </div>
  );
}

export function TypingPracticeForm() {
  const trackedRef = useRef(false);

  const [testMode, setTestMode] = useState<TestMode>('time');
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [corpus, setCorpus] = useState<TextCorpus>('common');

  const [testState, setTestState] = useState<TestState>('idle');
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charStates, setCharStates] = useState<('correct' | 'incorrect' | 'pending')[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [personalBest, setPersonalBest] = useState<PersonalBest | null>(null);
  const [isNewPB, setIsNewPB] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [wpmSnapshots, setWpmSnapshots] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const charStatesRef = useRef(charStates);
  const currentIndexRef = useRef(currentIndex);
  const startTimeRef = useRef(startTime);
  const testStateRef = useRef(testState);

  charStatesRef.current = charStates;
  currentIndexRef.current = currentIndex;
  startTimeRef.current = startTime;
  testStateRef.current = testState;

  useEffect(() => {
    setPersonalBest(loadPersonalBest());
  }, []);

  const generateNewText = useCallback(() => {
    const wordCount = testMode === 'time' ? getWordCountForTimeMode(timeLimit) : wordLimit;
    const newText = generateText(corpus, wordCount);
    setText(newText);
    setCharStates(new Array(newText.length).fill('pending'));
    setCurrentIndex(0);
    setStartTime(null);
    setElapsedTime(0);
    setTestState('idle');
    setResult(null);
    setIsNewPB(false);
    setWpmSnapshots([]);
  }, [testMode, timeLimit, wordLimit, corpus]);

  useEffect(() => {
    generateNewText();
  }, [generateNewText]);

  // Smooth caret positioning
  useEffect(() => {
    if (!caretRef.current || !textContainerRef.current) return;
    const charSpans = textContainerRef.current.querySelectorAll('[data-char]');
    if (charSpans.length === 0) return;

    const targetSpan = charSpans[Math.min(currentIndex, charSpans.length - 1)] as HTMLElement;
    if (!targetSpan) return;

    const containerRect = textContainerRef.current.getBoundingClientRect();
    const spanRect = targetSpan.getBoundingClientRect();

    const left = currentIndex >= charSpans.length
      ? spanRect.right - containerRect.left
      : spanRect.left - containerRect.left;
    const top = spanRect.top - containerRect.top;

    caretRef.current.style.transform = `translate(${left}px, ${top}px)`;
    caretRef.current.style.height = `${spanRect.height}px`;

    // Auto-scroll
    const caretBottom = top + spanRect.height;
    const visibleHeight = textContainerRef.current.clientHeight;
    if (caretBottom > visibleHeight - 10) {
      textContainerRef.current.scrollTop += spanRect.height * 1.5;
    }
  }, [currentIndex, text]);

  // Timer + WPM snapshot collection
  useEffect(() => {
    if (testState === 'running') {
      timerRef.current = setInterval(() => {
        if (!startTimeRef.current) return;
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setElapsedTime(elapsed);
        if (testMode === 'time' && elapsed >= timeLimit) {
          finishTest();
        }
      }, 100);

      // Collect WPM every second for the chart
      wpmIntervalRef.current = setInterval(() => {
        if (!startTimeRef.current) return;
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const minutes = elapsed / 60;
        if (minutes === 0) return;
        const states = charStatesRef.current;
        const idx = currentIndexRef.current;
        const correctCount = states.slice(0, idx).filter(s => s === 'correct').length;
        const wpm = Math.max(0, Math.round((correctCount / 5) / minutes));
        setWpmSnapshots(prev => [...prev, wpm]);
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (wpmIntervalRef.current) { clearInterval(wpmIntervalRef.current); wpmIntervalRef.current = null; }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testState, testMode, timeLimit]);

  const finishTest = useCallback(() => {
    setTestState('finished');
    const states = charStatesRef.current;
    const typedCount = currentIndexRef.current;
    const correctCount = states.slice(0, typedCount).filter(s => s === 'correct').length;
    const incorrectCount = states.slice(0, typedCount).filter(s => s === 'incorrect').length;
    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 1;
    const minutes = elapsed / 60;

    const rawWpm = Math.round((typedCount / 5) / minutes);
    const netWpm = Math.max(0, Math.round(((typedCount - incorrectCount) / 5) / minutes));
    const accuracy = typedCount > 0 ? Math.round((correctCount / typedCount) * 100) : 0;

    // Consistency = 100 - coefficient of variation of WPM snapshots
    let consistency = 0;
    setWpmSnapshots(prev => {
      if (prev.length > 1) {
        const mean = prev.reduce((a, b) => a + b, 0) / prev.length;
        if (mean > 0) {
          const variance = prev.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / prev.length;
          const cv = Math.sqrt(variance) / mean;
          consistency = Math.max(0, Math.round((1 - cv) * 100));
        }
      }
      return prev;
    });

    const testResult: TestResult = {
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      totalChars: typedCount,
      correctChars: correctCount,
      incorrectChars: incorrectCount,
      timeTaken: Math.round(elapsed * 10) / 10,
      wpmHistory: [...wpmSnapshots],
    };

    // Recalculate consistency synchronously
    if (wpmSnapshots.length > 1) {
      const mean = wpmSnapshots.reduce((a, b) => a + b, 0) / wpmSnapshots.length;
      if (mean > 0) {
        const variance = wpmSnapshots.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / wpmSnapshots.length;
        const cv = Math.sqrt(variance) / mean;
        testResult.consistency = Math.max(0, Math.round((1 - cv) * 100));
      }
    }

    setResult(testResult);

    const currentPB = loadPersonalBest();
    if (!currentPB || netWpm > currentPB.wpm) {
      const newPB: PersonalBest = {
        wpm: netWpm,
        accuracy,
        mode: `${testMode === 'time' ? timeLimit + 's' : wordLimit + ' words'} - ${corpus}`,
        date: new Date().toISOString(),
      };
      savePersonalBest(newPB);
      setPersonalBest(newPB);
      setIsNewPB(true);
    }

    if (!trackedRef.current) {
      trackToolUsage('typing-practice');
      trackedRef.current = true;
    }
  }, [testMode, timeLimit, wordLimit, corpus, wpmSnapshots]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (testStateRef.current === 'finished') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Tab' || e.key === 'Escape') return;

    e.preventDefault();
    const idx = currentIndexRef.current;

    if (e.key === 'Backspace') {
      if (idx > 0) {
        const newStates = [...charStatesRef.current];
        newStates[idx - 1] = 'pending';
        setCharStates(newStates);
        setCurrentIndex(idx - 1);
      }
      return;
    }

    if (e.key.length !== 1) return;

    if (testStateRef.current === 'idle') {
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
      setTestState('running');
    }

    const newStates = [...charStatesRef.current];
    newStates[idx] = e.key === text[idx] ? 'correct' : 'incorrect';
    setCharStates(newStates);
    setCurrentIndex(idx + 1);

    if (testMode === 'words' && idx + 1 >= text.length) {
      setTimeout(() => finishTest(), 0);
    }
  }, [text, testMode, finishTest]);

  const handleRestart = useCallback(() => {
    setCharStates(new Array(text.length).fill('pending'));
    setCurrentIndex(0);
    setStartTime(null);
    setElapsedTime(0);
    setTestState('idle');
    setResult(null);
    setIsNewPB(false);
    setWpmSnapshots([]);
    if (textContainerRef.current) textContainerRef.current.scrollTop = 0;
    hiddenInputRef.current?.focus();
  }, [text]);

  const handleNewTest = useCallback(() => {
    generateNewText();
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [generateNewText]);

  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus();
    setIsFocused(true);
  }, []);

  const displayTime = useMemo(() => {
    if (testMode === 'time') return Math.max(0, Math.ceil(timeLimit - elapsedTime));
    return Math.round(elapsedTime * 10) / 10;
  }, [testMode, timeLimit, elapsedTime]);

  const corpusLabel = corpus === 'common' ? 'english' : corpus === 'programming' ? 'code' : 'quotes';

  return (
    <div className="typing-tool">
      <style>{`
        .typing-tool {
          position: relative;
        }

        .tt-settings {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          background: var(--bg-surface);
          border: 1px solid var(--border-soft);
          margin-bottom: 48px;
        }

        .tt-settings .sep {
          width: 1px;
          height: 18px;
          background: var(--border-soft);
          margin: 0 6px;
        }

        .tt-btn {
          padding: 5px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.12s ease;
          background: transparent;
          color: var(--text-subtle);
        }

        .tt-btn:hover {
          color: var(--text-primary);
        }

        .tt-btn.active {
          background: var(--accent-dark);
          color: var(--accent-primary);
        }

        .tt-corpus-label {
          text-align: center;
          font-size: 12px;
          color: var(--text-subtle);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .tt-corpus-label::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-primary);
          opacity: 0.6;
        }

        .tt-timer-display {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-primary);
          font-variant-numeric: tabular-nums;
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .tt-typing-area {
          position: relative;
          padding: 0;
          cursor: text;
          outline: none;
        }

        .tt-text-container {
          position: relative;
          font-family: 'Roboto Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
          font-size: 1.5rem;
          line-height: 2.2;
          max-height: calc(1.5rem * 2.2 * 3);
          overflow: hidden;
          user-select: none;
          letter-spacing: 0.02em;
        }

        .tt-char {
          transition: color 0.05s ease;
        }

        .tt-char.pending {
          color: color-mix(in srgb, var(--text-primary) 25%, transparent);
        }

        .tt-char.correct {
          color: var(--text-primary);
        }

        .tt-char.incorrect {
          color: #e2574c;
          text-decoration: underline;
          text-decoration-color: #e2574c;
          text-underline-offset: 4px;
        }

        .tt-caret {
          position: absolute;
          top: 0;
          left: 0;
          width: 2.5px;
          background: var(--accent-primary);
          border-radius: 2px;
          transition: transform 0.08s ease-out;
          will-change: transform;
          z-index: 10;
          animation: tt-pulse 1s ease-in-out infinite;
        }

        .tt-caret.typing {
          animation: none;
          opacity: 1;
        }

        @keyframes tt-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .tt-blur-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--bg-surface) 85%, transparent);
          backdrop-filter: blur(6px);
          border-radius: 8px;
          z-index: 20;
          cursor: pointer;
        }

        .tt-blur-overlay span {
          font-size: 13px;
          color: var(--text-subtle);
        }

        .tt-restart {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 32px auto 0;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--text-subtle);
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          opacity: 0.5;
        }

        .tt-restart:hover {
          color: var(--text-primary);
          opacity: 1;
          transform: rotate(-45deg);
        }

        /* ─── Results ─── */

        .tt-results {
          animation: tt-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        @keyframes tt-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tt-results-top {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 32px;
          align-items: center;
          margin-bottom: 32px;
        }

        .tt-results-big {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tt-results-big-item {
          display: flex;
          flex-direction: column;
        }

        .tt-results-big-label {
          font-size: 13px;
          color: var(--text-subtle);
          font-weight: 500;
        }

        .tt-results-big-value {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1;
          color: var(--accent-primary);
          letter-spacing: -1px;
          font-variant-numeric: tabular-nums;
        }

        .tt-results-big-value.secondary {
          font-size: 2.5rem;
          color: var(--text-primary);
        }

        .tt-chart {
          width: 100%;
          min-height: 180px;
        }

        .tt-chart svg {
          width: 100%;
          height: auto;
        }

        .tt-results-bottom {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          background: var(--border-soft);
          border-radius: 10px;
          overflow: hidden;
        }

        .tt-results-stat {
          flex: 1;
          min-width: 120px;
          padding: 16px 20px;
          background: var(--bg-surface);
        }

        .tt-results-stat-label {
          font-size: 11px;
          color: var(--text-subtle);
          margin-bottom: 4px;
        }

        .tt-results-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }

        .tt-pb-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(234, 179, 8, 0.08);
          border: 1px solid rgba(234, 179, 8, 0.2);
          color: #eab308;
          font-size: 12px;
          font-weight: 600;
          animation: tt-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        @keyframes tt-pop {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }

        .tt-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
        }

        .tt-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid var(--border-default);
          background: var(--bg-surface);
          color: var(--text-secondary);
        }

        .tt-action-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent-primary);
        }

        .tt-action-btn.primary {
          background: var(--accent-dark);
          color: var(--accent-primary);
          border-color: var(--accent-dark);
        }

        .tt-action-btn.primary:hover {
          opacity: 0.85;
        }

        .tt-pb-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: var(--text-subtle);
          font-size: 12px;
          margin-top: 20px;
        }

        @media (max-width: 640px) {
          .tt-text-container { font-size: 1.15rem; line-height: 2; max-height: calc(1.15rem * 2 * 3); }
          .tt-results-top { grid-template-columns: 1fr; }
          .tt-results-big-value { font-size: 2.5rem; }
          .tt-results-big-value.secondary { font-size: 1.8rem; }
          .tt-timer-display { font-size: 1.5rem; }
        }
      `}</style>

      {/* Settings bar */}
      {testState !== 'running' && !result && (
        <div className="tt-settings">
          <button className={`tt-btn ${testMode === 'time' ? 'active' : ''}`} onClick={() => setTestMode('time')}>time</button>
          <button className={`tt-btn ${testMode === 'words' ? 'active' : ''}`} onClick={() => setTestMode('words')}>words</button>
          <div className="sep" />
          {testMode === 'time' ? (
            [15, 30, 60, 120].map(t => (
              <button key={t} className={`tt-btn ${timeLimit === t ? 'active' : ''}`} onClick={() => setTimeLimit(t)}>{t}</button>
            ))
          ) : (
            [10, 25, 50, 100].map(w => (
              <button key={w} className={`tt-btn ${wordLimit === w ? 'active' : ''}`} onClick={() => setWordLimit(w)}>{w}</button>
            ))
          )}
          <div className="sep" />
          <button className={`tt-btn ${corpus === 'common' ? 'active' : ''}`} onClick={() => setCorpus('common')}>english</button>
          <button className={`tt-btn ${corpus === 'programming' ? 'active' : ''}`} onClick={() => setCorpus('programming')}>code</button>
          <button className={`tt-btn ${corpus === 'quotes' ? 'active' : ''}`} onClick={() => setCorpus('quotes')}>quotes</button>
        </div>
      )}

      {/* Countdown timer — only visible thing during typing */}
      {testState === 'running' && (
        <div className="tt-timer-display">
          {displayTime}
        </div>
      )}

      {/* Corpus label */}
      {!result && testState !== 'running' && (
        <div className="tt-corpus-label">{corpusLabel}</div>
      )}

      {/* Typing area */}
      {!result && (
        <div
          ref={containerRef}
          className="tt-typing-area"
          onClick={focusInput}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <input
            ref={hiddenInputRef}
            type="text"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', top: 0, left: 0, pointerEvents: 'none' }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <div ref={textContainerRef} className="tt-text-container">
            <div ref={caretRef} className={`tt-caret ${testState === 'running' ? 'typing' : ''}`} />
            {text.split('').map((char, i) => (
              <span key={i} data-char className={`tt-char ${charStates[i]}`}>{char}</span>
            ))}
          </div>

          {!isFocused && testState === 'idle' && (
            <div className="tt-blur-overlay" onClick={focusInput}>
              <span>Click anywhere to focus the window</span>
            </div>
          )}
        </div>
      )}

      {/* Restart icon */}
      {testState !== 'finished' && !result && (
        <button className="tt-restart" onClick={handleRestart} title="Restart test">
          <RotateCcw size={18} />
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="tt-results">
          {isNewPB && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="tt-pb-badge">
                <Trophy size={14} />
                new personal best!
              </span>
            </div>
          )}

          <div className="tt-results-top">
            <div className="tt-results-big">
              <div className="tt-results-big-item">
                <span className="tt-results-big-label">wpm</span>
                <span className="tt-results-big-value">{result.wpm}</span>
              </div>
              <div className="tt-results-big-item">
                <span className="tt-results-big-label">acc</span>
                <span className="tt-results-big-value secondary">{result.accuracy}%</span>
              </div>
            </div>

            <WpmChart history={result.wpmHistory} timeTaken={result.timeTaken} />
          </div>

          <div className="tt-results-bottom">
            <div className="tt-results-stat">
              <div className="tt-results-stat-label">test type</div>
              <div className="tt-results-stat-value">
                {testMode} {testMode === 'time' ? timeLimit : wordLimit}<br />
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-subtle)' }}>{corpusLabel}</span>
              </div>
            </div>
            <div className="tt-results-stat">
              <div className="tt-results-stat-label">raw</div>
              <div className="tt-results-stat-value">{result.rawWpm}</div>
            </div>
            <div className="tt-results-stat">
              <div className="tt-results-stat-label">characters</div>
              <div className="tt-results-stat-value">
                <span style={{ color: 'var(--text-primary)' }}>{result.correctChars}</span>
                /
                <span style={{ color: '#e2574c' }}>{result.incorrectChars}</span>
                /0/0
              </div>
            </div>
            <div className="tt-results-stat">
              <div className="tt-results-stat-label">consistency</div>
              <div className="tt-results-stat-value">{result.consistency}%</div>
            </div>
            <div className="tt-results-stat">
              <div className="tt-results-stat-label">time</div>
              <div className="tt-results-stat-value">{result.timeTaken}s</div>
            </div>
          </div>

          {personalBest && !isNewPB && (
            <div className="tt-pb-info">
              <Trophy size={13} />
              <span>personal best: {personalBest.wpm} wpm</span>
            </div>
          )}

          <div className="tt-actions">
            <button className="tt-action-btn" onClick={handleRestart}>
              <RotateCcw size={14} />
              try again
            </button>
            <button className="tt-action-btn primary" onClick={handleNewTest}>
              next test
            </button>
          </div>
        </div>
      )}

      {testState === 'idle' && personalBest && !result && (
        <div className="tt-pb-info">
          <Trophy size={13} />
          <span>personal best: {personalBest.wpm} wpm ({personalBest.mode})</span>
        </div>
      )}
    </div>
  );
}
