'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

// ─── UUID Generation ────────────────────────────────────────────────────────

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: manual v4 UUID generation
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version 4 bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant bits
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

function formatUUID(uuid: string, uppercase: boolean, hyphens: boolean): string {
  let result = uuid;
  if (!hyphens) {
    result = result.replace(/-/g, '');
  }
  if (uppercase) {
    result = result.toUpperCase();
  }
  return result;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function UuidGeneratorForm() {
  const [singleUuid, setSingleUuid] = useState(() => generateUUID());
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkOutput, setBulkOutput] = useState('');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedBulk, setCopiedBulk] = useState(false);

  const formattedSingle = formatUUID(singleUuid, uppercase, hyphens);

  const handleGenerateSingle = useCallback(() => {
    setSingleUuid(generateUUID());
  }, []);

  const handleGenerateBulk = useCallback(() => {
    const clamped = Math.max(1, Math.min(100, bulkCount));
    const uuids: string[] = [];
    for (let i = 0; i < clamped; i++) {
      uuids.push(formatUUID(generateUUID(), uppercase, hyphens));
    }
    setBulkOutput(uuids.join('\n'));
  }, [bulkCount, uppercase, hyphens]);

  const copySingle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedSingle);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = formattedSingle;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 1500);
  }, [formattedSingle]);

  const copyBulk = useCallback(async () => {
    if (!bulkOutput) return;
    try {
      await navigator.clipboard.writeText(bulkOutput);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = bulkOutput;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedBulk(true);
    setTimeout(() => setCopiedBulk(false), 1500);
  }, [bulkOutput]);

  return (
    <div className="space-y-6">
      {/* Format options */}
      <div className="p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-4">
          Format Options
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--accent-dark)]"
            />
            <span className="text-sm text-[var(--text-primary)]">Uppercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--accent-dark)]"
            />
            <span className="text-sm text-[var(--text-primary)]">Hyphens</span>
          </label>
        </div>
      </div>

      {/* Single UUID */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-4">
          Single UUID
        </label>

        <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-soft)] rounded-xl mb-4">
          <p className="font-mono text-lg md:text-xl text-[var(--text-primary)] text-center break-all select-all">
            {formattedSingle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={handleGenerateSingle}
            className="h-10 px-5 flex items-center gap-2 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Generate
          </button>
          <button
            type="button"
            onClick={copySingle}
            className="h-10 px-5 flex items-center gap-2 text-sm font-semibold border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-all"
          >
            {copiedSingle ? (
              <>
                <Check className="w-4 h-4 text-[var(--color-success)]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bulk generation */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-4">
          Bulk Generate
        </label>

        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div>
            <label className="block text-xs text-[var(--text-subtle)] mb-1.5">
              Count (1-100)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={bulkCount}
              onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
              className="form-input font-mono w-full max-w-[120px]"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerateBulk}
            className="h-10 px-5 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
          >
            Generate Bulk
          </button>
        </div>

        {bulkOutput && (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--text-subtle)]">
                {bulkOutput.split('\n').length} UUIDs generated
              </span>
              <button
                type="button"
                onClick={copyBulk}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                {copiedBulk ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                    Copied all
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy all
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={bulkOutput}
              rows={Math.min(12, bulkOutput.split('\n').length + 1)}
              className="w-full px-4 py-3 font-mono text-sm bg-[var(--bg-base)] border border-[var(--border-soft)] rounded-xl text-[var(--text-primary)] resize-y focus:outline-none"
            />
          </>
        )}
      </div>
    </div>
  );
}
