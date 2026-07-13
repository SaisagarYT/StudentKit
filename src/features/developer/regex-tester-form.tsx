'use client';

import { useState, useMemo, useCallback, useRef, Fragment } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { Copy, Check, ChevronDown, ChevronRight, Replace } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface MatchResult {
  index: number;
  text: string;
  start: number;
  end: number;
  groups: string[];
}

interface PresetPattern {
  label: string;
  pattern: string;
  flags: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const COMMON_PATTERNS: PresetPattern[] = [
  {
    label: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
  },
  {
    label: 'URL',
    pattern: 'https?://[^\\s/$.?#].[^\\s]*',
    flags: 'g',
  },
  {
    label: 'Phone (India)',
    pattern: '(\\+91|0)?[6-9]\\d{9}',
    flags: 'g',
  },
  {
    label: 'IP Address',
    pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
    flags: 'g',
  },
  {
    label: 'Date (YYYY-MM-DD)',
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    flags: 'g',
  },
  {
    label: 'Hex Color',
    pattern: '#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\\b',
    flags: 'g',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function RegexTesterForm() {
  const trackedRef = useRef(false);
  const [pattern, setPattern] = useState('');
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const [testString, setTestString] = useState('');
  const [replaceMode, setReplaceMode] = useState(false);
  const [replaceWith, setReplaceWith] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const flags = useMemo(() => {
    let f = '';
    if (flagG) f += 'g';
    if (flagI) f += 'i';
    if (flagM) f += 'm';
    if (flagS) f += 's';
    return f;
  }, [flagG, flagI, flagM, flagS]);

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      const r = new RegExp(pattern, flags);
      return { regex: r, error: null };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flags]);

  const matches: MatchResult[] = useMemo(() => {
    if (!regex || !testString) return [];

    const results: MatchResult[] = [];
    // Always use a regex with the global flag for iteration
    const iterRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');

    let match: RegExpExecArray | null;
    let safety = 0;
    while ((match = iterRegex.exec(testString)) !== null && safety < 10000) {
      safety++;
      const groups: string[] = [];
      for (let i = 1; i < match.length; i++) {
        groups.push(match[i] ?? '');
      }
      results.push({
        index: results.length,
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        groups,
      });
      // For non-global regex, only return first match
      if (!regex.flags.includes('g')) break;
      // Avoid infinite loops on zero-length matches
      if (match[0].length === 0) {
        iterRegex.lastIndex++;
      }
    }
    return results;
  }, [regex, testString]);

  if (matches.length > 0 && !trackedRef.current) {
    trackedRef.current = true;
    trackToolUsage('regex-tester');
  }

  const highlightedParts = useMemo(() => {
    if (!matches.length || !testString) return null;

    const parts: { text: string; isMatch: boolean }[] = [];
    let lastEnd = 0;

    for (const m of matches) {
      if (m.start > lastEnd) {
        parts.push({ text: testString.slice(lastEnd, m.start), isMatch: false });
      }
      parts.push({ text: testString.slice(m.start, m.end), isMatch: true });
      lastEnd = m.end;
    }
    if (lastEnd < testString.length) {
      parts.push({ text: testString.slice(lastEnd), isMatch: false });
    }
    return parts;
  }, [matches, testString]);

  const replacedOutput = useMemo(() => {
    if (!regex || !testString || !replaceMode) return '';
    try {
      return testString.replace(regex, replaceWith);
    } catch {
      return '';
    }
  }, [regex, testString, replaceMode, replaceWith]);

  const handlePresetClick = useCallback((preset: PresetPattern) => {
    setPattern(preset.pattern);
    setFlagG(preset.flags.includes('g'));
    setFlagI(preset.flags.includes('i'));
    setFlagM(preset.flags.includes('m'));
    setFlagS(preset.flags.includes('s'));
  }, []);

  const copyReplacedOutput = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(replacedOutput);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = replacedOutput;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 1500);
  }, [replacedOutput]);

  return (
    <div className="space-y-6">
      {/* Regex Input Section */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-3">
          Regular Expression
        </label>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg text-[var(--text-subtle)] font-mono">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="form-input font-mono flex-1"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="text-lg text-[var(--text-subtle)] font-mono">/{flags}</span>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Flags:
          </span>
          <FlagCheckbox label="g" description="global" checked={flagG} onChange={setFlagG} />
          <FlagCheckbox label="i" description="case-insensitive" checked={flagI} onChange={setFlagI} />
          <FlagCheckbox label="m" description="multiline" checked={flagM} onChange={setFlagM} />
          <FlagCheckbox label="s" description="dotAll" checked={flagS} onChange={setFlagS} />
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-sm text-red-500 font-mono">
            {error}
          </p>
        )}
      </div>

      {/* Test String Section */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Test String
          </label>
          {matches.length > 0 && (
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </span>
          )}
        </div>

        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          rows={6}
          className="form-input font-mono w-full resize-y"
          spellCheck={false}
        />

        {/* Highlighted Preview */}
        {highlightedParts && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-2">
              Match Highlights
            </label>
            <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
              {highlightedParts.map((part, i) => (
                <Fragment key={i}>
                  {part.isMatch ? (
                    <mark className="bg-[var(--accent-primary)]/30 text-[var(--text-primary)] rounded-sm px-0.5">
                      {part.text}
                    </mark>
                  ) : (
                    <span>{part.text}</span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Panel */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-4">
          Match Results
        </label>

        {pattern && testString && matches.length === 0 && !error && (
          <p className="text-sm text-[var(--text-subtle)] italic">No matches</p>
        )}

        {!pattern && (
          <p className="text-sm text-[var(--text-subtle)] italic">Enter a regex pattern to see results</p>
        )}

        {matches.length > 0 && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {matches.map((m) => (
              <div
                key={m.index}
                className="p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[var(--text-subtle)]">
                        Match {m.index}
                      </span>
                      <span className="text-xs text-[var(--text-subtle)]">
                        pos {m.start}&ndash;{m.end}
                      </span>
                    </div>
                    <code className="text-sm font-mono text-[var(--text-primary)] break-all">
                      {m.text || <span className="italic text-[var(--text-subtle)]">(empty string)</span>}
                    </code>
                  </div>
                </div>

                {m.groups.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--border-soft)]">
                    <span className="text-xs text-[var(--text-subtle)] font-medium">
                      Capture Groups:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {m.groups.map((g, gi) => (
                        <span
                          key={gi}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-soft)] text-xs font-mono"
                        >
                          <span className="text-[var(--text-subtle)]">${gi + 1}:</span>
                          <span className="text-[var(--text-primary)]">{g || <em className="text-[var(--text-subtle)]">undefined</em>}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Replace Mode */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Replace Mode
          </label>
          <button
            type="button"
            onClick={() => setReplaceMode(!replaceMode)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              replaceMode
                ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                : 'border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Replace className="w-3.5 h-3.5" />
            {replaceMode ? 'On' : 'Off'}
          </button>
        </div>

        {replaceMode && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-2">
                Replace With
              </label>
              <input
                type="text"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                placeholder="Replacement string (use $1, $2 for groups)..."
                className="form-input font-mono w-full"
                spellCheck={false}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                  Result
                </label>
                <button
                  type="button"
                  onClick={copyReplacedOutput}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  {copiedResult ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={replacedOutput}
                rows={4}
                className="form-input font-mono w-full resize-y bg-[var(--bg-subtle)] cursor-default"
              />
            </div>
          </div>
        )}
      </div>

      {/* Common Patterns Library */}
      <div className="border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between p-6 md:px-8 text-left hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <span className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Common Patterns Library
          </span>
          {showPresets ? (
            <ChevronDown className="w-4 h-4 text-[var(--text-subtle)]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />
          )}
        </button>

        {showPresets && (
          <div className="px-6 md:px-8 pb-6 md:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMMON_PATTERNS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="text-left p-3 rounded-xl border border-[var(--border-soft)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)] transition-all"
              >
                <span className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  {preset.label}
                </span>
                <code className="block text-xs font-mono text-[var(--text-subtle)] truncate">
                  {preset.pattern}
                </code>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function FlagCheckbox({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-[var(--border-default)] text-[var(--accent-dark)] focus:ring-[var(--accent-primary)] cursor-pointer"
      />
      <span className="text-sm font-mono font-medium text-[var(--text-primary)]">{label}</span>
      <span className="text-xs text-[var(--text-subtle)]">({description})</span>
    </label>
  );
}
