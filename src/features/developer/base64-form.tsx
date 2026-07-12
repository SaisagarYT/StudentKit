'use client';

import { useState, useCallback, useRef } from 'react';
import { Copy, Check, Upload } from 'lucide-react';

export function Base64Form() {
  const [textInput, setTextInput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [autoMode, setAutoMode] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<'text' | 'base64' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeToBase64 = useCallback((text: string): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }, []);

  const decodeFromBase64 = useCallback((b64: string): string => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }, []);

  const handleEncode = useCallback(() => {
    setError('');
    try {
      const encoded = encodeToBase64(textInput);
      setBase64Input(encoded);
    } catch {
      setError('Failed to encode text.');
    }
  }, [textInput, encodeToBase64]);

  const handleDecode = useCallback(() => {
    setError('');
    try {
      const decoded = decodeFromBase64(base64Input);
      setTextInput(decoded);
    } catch {
      setError('Invalid Base64 input. Please check the string and try again.');
    }
  }, [base64Input, decodeFromBase64]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setTextInput(value);
      setError('');
      if (autoMode) {
        try {
          setBase64Input(encodeToBase64(value));
        } catch {
          setBase64Input('');
        }
      }
    },
    [autoMode, encodeToBase64]
  );

  const handleBase64Change = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setBase64Input(value);
      setError('');
      if (autoMode && value.trim()) {
        try {
          setTextInput(decodeFromBase64(value));
        } catch {
          // Don't clear text on invalid partial input during auto-mode
        }
      }
    },
    [autoMode, decodeFromBase64]
  );

  const handleFileEncode = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBase64Input(result);
        setTextInput(`[File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`);
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read file.');
      };
      reader.readAsDataURL(file);

      // Reset the input so the same file can be selected again
      e.target.value = '';
    },
    []
  );

  const copyToClipboard = useCallback(async (text: string, field: 'text' | 'base64') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }, []);

  return (
    <div className="space-y-6">
      {/* Auto-mode toggle */}
      <div className="p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border-default)] accent-[var(--accent-dark)]"
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Auto-convert mode
          </span>
          <span className="text-xs text-[var(--text-subtle)]">
            (automatically converts as you type)
          </span>
        </label>
      </div>

      {/* Text input */}
      <div className="p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Text
          </label>
          <button
            type="button"
            onClick={() => copyToClipboard(textInput, 'text')}
            disabled={!textInput}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copiedField === 'text' ? (
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
          value={textInput}
          onChange={handleTextChange}
          placeholder="Enter text to encode..."
          rows={5}
          className="w-full px-4 py-3 font-mono text-sm bg-[var(--bg-base)] border border-[var(--border-soft)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]/30 focus:border-[var(--accent-dark)] resize-y"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleEncode}
          disabled={!textInput}
          className="h-10 px-5 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Encode &darr;
        </button>
        <button
          type="button"
          onClick={handleDecode}
          disabled={!base64Input}
          className="h-10 px-5 text-sm font-semibold border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          &uarr; Decode
        </button>
        <button
          type="button"
          onClick={handleFileEncode}
          className="h-10 px-5 flex items-center gap-2 text-sm font-semibold border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-all"
        >
          <Upload className="w-4 h-4" />
          Encode file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>

      {/* Base64 output */}
      <div className="p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Base64
          </label>
          <button
            type="button"
            onClick={() => copyToClipboard(base64Input, 'base64')}
            disabled={!base64Input}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copiedField === 'base64' ? (
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
          value={base64Input}
          onChange={handleBase64Change}
          placeholder="Base64 encoded output will appear here..."
          rows={5}
          className="w-full px-4 py-3 font-mono text-sm bg-[var(--bg-base)] border border-[var(--border-soft)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]/30 focus:border-[var(--accent-dark)] resize-y"
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
