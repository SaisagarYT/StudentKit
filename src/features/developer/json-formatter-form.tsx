'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Copy,
  Check,
  ClipboardPaste,
  Trash2,
  FileJson,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const SAMPLE_JSON = JSON.stringify(
  {
    name: 'StudentKit',
    version: '1.0.0',
    description: 'A collection of free tools for students',
    features: ['GPA Calculator', 'JSON Formatter', 'Regex Tester'],
    author: {
      name: 'Dev',
      github: 'https://github.com/example',
      socials: {
        twitter: '@example',
        linkedin: 'in/example',
      },
    },
    config: {
      theme: 'dark',
      language: 'en',
      notifications: true,
      limits: { maxUploadSize: 5242880, maxRequests: 100 },
    },
    tags: ['education', 'tools', 'free', 'open-source'],
  },
  null,
  2
);

interface JsonStats {
  keys: number;
  depth: number;
  sizeBytes: number;
}

interface ValidationState {
  status: 'idle' | 'valid' | 'invalid';
  message: string;
  errorLine?: number;
}

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== 'object') return 0;
  if (Array.isArray(obj)) {
    return obj.reduce((acc: number, item) => acc + countKeys(item), 0);
  }
  let count = Object.keys(obj).length;
  for (const value of Object.values(obj)) {
    count += countKeys(value);
  }
  return count;
}

function getDepth(obj: unknown, current: number = 0): number {
  if (obj === null || typeof obj !== 'object') return current;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return current + 1;
    return Math.max(...obj.map((item) => getDepth(item, current + 1)));
  }
  const values = Object.values(obj);
  if (values.length === 0) return current + 1;
  return Math.max(...values.map((value) => getDepth(value, current + 1)));
}

function calculateStats(input: string): JsonStats | null {
  try {
    const parsed = JSON.parse(input);
    return {
      keys: countKeys(parsed),
      depth: getDepth(parsed),
      sizeBytes: new TextEncoder().encode(input).length,
    };
  } catch {
    return null;
  }
}

function parseErrorPosition(errorMessage: string): number | undefined {
  // Try to extract position from JSON.parse error messages
  // Chrome: "at position 42"
  // Firefox: "at line 3 column 5"
  const posMatch = errorMessage.match(/at position (\d+)/);
  if (posMatch) {
    return parseInt(posMatch[1], 10);
  }
  const lineMatch = errorMessage.match(/at line (\d+)/);
  if (lineMatch) {
    return parseInt(lineMatch[1], 10);
  }
  return undefined;
}

function positionToLine(input: string, position: number): number {
  const upToPosition = input.slice(0, position);
  return upToPosition.split('\n').length;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function JsonFormatterForm() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [validation, setValidation] = useState<ValidationState>({
    status: 'idle',
    message: '',
  });
  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setValidation({ status: 'invalid', message: 'Input is empty' });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setValidation({ status: 'valid', message: 'Valid JSON — formatted with 2-space indent' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      const position = parseErrorPosition(message);
      const errorLine = position !== undefined ? positionToLine(input, position) : undefined;
      setValidation({ status: 'invalid', message, errorLine });
      setOutput('');
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setValidation({ status: 'invalid', message: 'Input is empty' });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setValidation({ status: 'valid', message: 'Valid JSON — minified' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      const position = parseErrorPosition(message);
      const errorLine = position !== undefined ? positionToLine(input, position) : undefined;
      setValidation({ status: 'invalid', message, errorLine });
      setOutput('');
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setValidation({ status: 'invalid', message: 'Input is empty' });
      return;
    }
    try {
      JSON.parse(input);
      setValidation({ status: 'valid', message: 'Valid JSON' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid JSON';
      const position = parseErrorPosition(message);
      const errorLine = position !== undefined ? positionToLine(input, position) : undefined;
      setValidation({ status: 'invalid', message, errorLine });
    }
  }, [input]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setValidation({ status: 'idle', message: '' });
      setOutput('');
    } catch {
      // Clipboard access denied — ignore silently
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setValidation({ status: 'idle', message: '' });
  }, []);

  const handleLoadSample = useCallback(() => {
    setInput(SAMPLE_JSON);
    setOutput('');
    setValidation({ status: 'idle', message: '' });
  }, []);

  const handleCopyOutput = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    } catch {
      // Clipboard write denied — ignore silently
    }
  }, [output]);

  const outputStats = useMemo(() => {
    if (!output) return null;
    return {
      chars: output.length,
      lines: output.split('\n').length,
    };
  }, [output]);

  const jsonStats = useMemo(() => {
    if (!input.trim()) return null;
    return calculateStats(input);
  }, [input]);

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleFormat}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Format / Beautify
        </button>
        <button
          type="button"
          onClick={handleMinify}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border-default)] rounded-xl hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          Minify
        </button>
        <button
          type="button"
          onClick={handleValidate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border-default)] rounded-xl hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Validate
        </button>
      </div>

      {/* Validation Feedback */}
      {validation.status !== 'idle' && (
        <div
          className={`flex items-start gap-2 px-4 py-3 rounded-xl text-sm ${
            validation.status === 'valid'
              ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
              : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
          }`}
        >
          {validation.status === 'valid' ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <div>
            <span className="font-medium">{validation.message}</span>
            {validation.errorLine && (
              <span className="block mt-0.5 text-xs opacity-80">
                Error near line {validation.errorLine}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Area */}
        <div className="flex flex-col border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
              Input
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-soft)] rounded-lg hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)] transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-soft)] rounded-lg hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)] transition-colors"
                title="Load sample JSON"
              >
                <FileJson className="w-3.5 h-3.5" />
                Sample
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-soft)] rounded-lg hover:border-[var(--border-default)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/5 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setValidation({ status: 'idle', message: '' });
            }}
            placeholder='Paste your JSON here...\n\n{\n  "key": "value"\n}'
            className="flex-1 min-h-[320px] lg:min-h-[420px] p-4 font-mono text-sm leading-relaxed resize-none bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Output Area */}
        <div className="flex flex-col border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-dark)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]/20">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-inverse)]/60">
              Output
            </span>
            <div className="flex items-center gap-3">
              {outputStats && (
                <span className="text-xs text-[var(--text-inverse)]/40">
                  {outputStats.chars.toLocaleString()} chars &middot; {outputStats.lines} lines
                </span>
              )}
              <button
                type="button"
                onClick={handleCopyOutput}
                disabled={!output}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-inverse)]/80 border border-[var(--text-inverse)]/20 rounded-lg hover:border-[var(--text-inverse)]/40 hover:bg-[var(--text-inverse)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Copy output"
              >
                {copiedOutput ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
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
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
            className="flex-1 min-h-[320px] lg:min-h-[420px] p-4 font-mono text-sm leading-relaxed resize-none bg-transparent text-[var(--text-inverse)]/90 placeholder:text-[var(--text-inverse)]/30 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats Bar */}
      {jsonStats && (
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 border border-[var(--border-soft)] rounded-xl bg-[var(--bg-subtle)]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-subtle)]">Keys:</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {jsonStats.keys}
            </span>
          </div>
          <div className="w-px h-4 bg-[var(--border-default)]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-subtle)]">Depth:</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {jsonStats.depth}
            </span>
          </div>
          <div className="w-px h-4 bg-[var(--border-default)]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-subtle)]">Size:</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {formatBytes(jsonStats.sizeBytes)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
