'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

// ─── Lorem Ipsum Word Bank ──────────────────────────────────────────────────

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'blandit', 'volutpat',
  'maecenas', 'accumsan', 'lacus', 'vel', 'facilisis', 'venenatis', 'cras',
  'ornare', 'arcu', 'dui', 'vivamus', 'vitae', 'congue', 'eu', 'consequat',
  'ac', 'felis', 'donec', 'pretium', 'vulputate', 'sapien', 'nec', 'sagittis',
  'aliquam', 'malesuada', 'bibendum', 'pellentesque', 'habitant', 'morbi',
  'tristique', 'senectus', 'netus', 'fames', 'turpis', 'egestas', 'pharetra',
];

const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

// ─── Generator Utilities ────────────────────────────────────────────────────

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSentence(wordCount?: number): string {
  const count = wordCount ?? Math.floor(Math.random() * 8) + 6;
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(randomWord());
  }
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 4;
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

type GenerateMode = 'paragraphs' | 'sentences' | 'words';

function generateText(mode: GenerateMode, amount: number, startClassic: boolean): string {
  if (mode === 'words') {
    const words: string[] = [];
    for (let i = 0; i < amount; i++) {
      words.push(randomWord());
    }
    let result = words.join(' ');
    if (startClassic) {
      const classicWords = CLASSIC_START.replace('.', '').split(' ').slice(0, Math.min(amount, 8));
      const remaining = amount - classicWords.length;
      if (remaining > 0) {
        const extra: string[] = [];
        for (let i = 0; i < remaining; i++) {
          extra.push(randomWord());
        }
        result = classicWords.join(' ') + ' ' + extra.join(' ');
      } else {
        result = classicWords.join(' ');
      }
    }
    return capitalize(result) + '.';
  }

  if (mode === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < amount; i++) {
      sentences.push(generateSentence());
    }
    if (startClassic && sentences.length > 0) {
      sentences[0] = CLASSIC_START;
    }
    return sentences.join(' ');
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < amount; i++) {
    paragraphs.push(generateParagraph());
  }
  if (startClassic && paragraphs.length > 0) {
    paragraphs[0] = CLASSIC_START + ' ' + paragraphs[0];
  }
  return paragraphs.join('\n\n');
}

// ─── Component ──────────────────────────────────────────────────────────────

export function LoremIpsumForm() {
  const [mode, setMode] = useState<GenerateMode>('paragraphs');
  const [amount, setAmount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const clamped = Math.max(1, Math.min(50, amount));
    setOutput(generateText(mode, clamped, startClassic));
  }, [mode, amount, startClassic]);

  const stats = useMemo(() => {
    if (!output) return { words: 0, chars: 0 };
    const words = output.split(/\s+/).filter(Boolean).length;
    const chars = output.length;
    return { words, chars };
  }, [output]);

  const copyToClipboard = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Mode and amount */}
          <div className="space-y-5">
            {/* Mode selector */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-2">
                Generate
              </label>
              <div className="flex gap-2">
                {(['paragraphs', 'sentences', 'words'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all capitalize ${
                      mode === m
                        ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                        : 'border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-2">
                Amount (1-50)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                className="form-input font-mono w-full max-w-[120px]"
              />
            </div>

            {/* Classic start checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={startClassic}
                onChange={(e) => setStartClassic(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--accent-dark)]"
              />
              <span className="text-sm text-[var(--text-primary)]">
                Start with &ldquo;Lorem ipsum dolor sit amet...&rdquo;
              </span>
            </label>
          </div>

          {/* Generate button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerate}
              className="h-12 px-8 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Output */}
      {output && (
        <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                Output
              </label>
              <span className="text-xs text-[var(--text-subtle)]">
                {stats.words} words &middot; {stats.chars} characters
              </span>
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full px-4 py-3 font-mono text-sm bg-[var(--bg-base)] border border-[var(--border-soft)] rounded-xl text-[var(--text-primary)] resize-y focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
