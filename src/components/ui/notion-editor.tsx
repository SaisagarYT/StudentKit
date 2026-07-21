'use client';

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from 'react';
import {
  Bold, Italic, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Image, Link2,
  Undo2, Redo2, Type
} from 'lucide-react';

interface NotionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_ITEMS = [
  { icon: Bold, command: 'bold', shortcut: 'Ctrl+B', label: 'Bold' },
  { icon: Italic, command: 'italic', shortcut: 'Ctrl+I', label: 'Italic' },
  { icon: Code, command: 'code', shortcut: 'Ctrl+E', label: 'Inline Code' },
  { type: 'divider' as const },
  { icon: Heading1, command: 'h1', shortcut: 'Ctrl+1', label: 'Heading 1' },
  { icon: Heading2, command: 'h2', shortcut: 'Ctrl+2', label: 'Heading 2' },
  { icon: Heading3, command: 'h3', shortcut: 'Ctrl+3', label: 'Heading 3' },
  { type: 'divider' as const },
  { icon: List, command: 'ul', shortcut: 'Ctrl+Shift+L', label: 'Bullet List' },
  { icon: ListOrdered, command: 'ol', shortcut: 'Ctrl+Shift+O', label: 'Numbered List' },
  { icon: Quote, command: 'quote', shortcut: 'Ctrl+Shift+Q', label: 'Quote' },
  { icon: Minus, command: 'hr', shortcut: '---', label: 'Divider' },
  { type: 'divider' as const },
  { icon: Link2, command: 'link', shortcut: 'Ctrl+K', label: 'Link' },
  { icon: Image, command: 'image', shortcut: 'Ctrl+Shift+I', label: 'Image' },
];

export function NotionEditor({ value, onChange, placeholder, minHeight = '300px' }: NotionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSlash, setShowSlash] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [slashPos, setSlashPos] = useState(0);

  const insertAtCursor = useCallback((before: string, after: string = '', selectInner = false) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newText = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newText);

    requestAnimationFrame(() => {
      ta.focus();
      if (selectInner && !selected) {
        ta.setSelectionRange(start + before.length, start + before.length);
      } else {
        ta.setSelectionRange(start + before.length + selected.length + after.length, start + before.length + selected.length + after.length);
      }
    });
  }, [value, onChange]);

  const wrapSelection = useCallback((wrapper: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);

    if (selected) {
      const newText = value.slice(0, start) + wrapper + selected + wrapper + value.slice(end);
      onChange(newText);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + wrapper.length, end + wrapper.length);
      });
    } else {
      insertAtCursor(wrapper, wrapper, true);
    }
  }, [value, onChange, insertAtCursor]);

  const insertLinePrefix = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newText);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }, [value, onChange]);

  const execCommand = useCallback((command: string) => {
    setShowSlash(false);
    switch (command) {
      case 'bold': wrapSelection('**'); break;
      case 'italic': wrapSelection('*'); break;
      case 'code': wrapSelection('`'); break;
      case 'h1': insertLinePrefix('# '); break;
      case 'h2': insertLinePrefix('## '); break;
      case 'h3': insertLinePrefix('### '); break;
      case 'ul': insertLinePrefix('- '); break;
      case 'ol': insertLinePrefix('1. '); break;
      case 'quote': insertLinePrefix('> '); break;
      case 'hr': insertAtCursor('\n---\n'); break;
      case 'codeblock': insertAtCursor('\n```python\n', '\n```\n', true); break;
      case 'link': {
        const url = prompt('Enter URL:');
        if (url) insertAtCursor('[', `](${url})`);
        break;
      }
      case 'image': {
        const url = prompt('Enter image URL:');
        if (url) insertAtCursor(`![alt](${url})`);
        break;
      }
      case 'table': insertAtCursor('\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n'); break;
    }
  }, [wrapSelection, insertLinePrefix, insertAtCursor]);

  const slashCommands = [
    { id: 'h1', label: 'Heading 1', desc: 'Large heading', icon: Heading1 },
    { id: 'h2', label: 'Heading 2', desc: 'Medium heading', icon: Heading2 },
    { id: 'h3', label: 'Heading 3', desc: 'Small heading', icon: Heading3 },
    { id: 'ul', label: 'Bullet List', desc: 'Unordered list', icon: List },
    { id: 'ol', label: 'Numbered List', desc: 'Ordered list', icon: ListOrdered },
    { id: 'quote', label: 'Quote', desc: 'Block quote', icon: Quote },
    { id: 'codeblock', label: 'Code Block', desc: 'Fenced code block', icon: Code },
    { id: 'hr', label: 'Divider', desc: 'Horizontal line', icon: Minus },
    { id: 'table', label: 'Table', desc: 'Markdown table', icon: Type },
    { id: 'image', label: 'Image', desc: 'Insert image URL', icon: Image },
    { id: 'link', label: 'Link', desc: 'Insert hyperlink', icon: Link2 },
  ];

  const filteredSlash = slashCommands.filter(c =>
    c.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
    c.desc.toLowerCase().includes(slashFilter.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ctrl = e.ctrlKey || e.metaKey;

    if (ctrl && e.key === 'b') { e.preventDefault(); execCommand('bold'); return; }
    if (ctrl && e.key === 'i') { e.preventDefault(); execCommand('italic'); return; }
    if (ctrl && e.key === 'e') { e.preventDefault(); execCommand('code'); return; }
    if (ctrl && e.key === 'k') { e.preventDefault(); execCommand('link'); return; }
    if (ctrl && e.key === '1') { e.preventDefault(); execCommand('h1'); return; }
    if (ctrl && e.key === '2') { e.preventDefault(); execCommand('h2'); return; }
    if (ctrl && e.key === '3') { e.preventDefault(); execCommand('h3'); return; }
    if (ctrl && e.shiftKey && e.key === 'L') { e.preventDefault(); execCommand('ul'); return; }
    if (ctrl && e.shiftKey && e.key === 'O') { e.preventDefault(); execCommand('ol'); return; }
    if (ctrl && e.shiftKey && e.key === 'Q') { e.preventDefault(); execCommand('quote'); return; }

    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('  ');
      return;
    }

    if (showSlash) {
      if (e.key === 'Escape') { setShowSlash(false); return; }
      if (e.key === 'Enter' && filteredSlash.length > 0) {
        e.preventDefault();
        const ta = textareaRef.current!;
        const newVal = value.slice(0, slashPos) + value.slice(ta.selectionStart);
        onChange(newVal);
        requestAnimationFrame(() => {
          ta.setSelectionRange(slashPos, slashPos);
          execCommand(filteredSlash[0].id);
        });
        setShowSlash(false);
        return;
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    onChange(newVal);

    const ta = textareaRef.current!;
    const cursor = ta.selectionStart;
    const charBefore = newVal[cursor - 1];

    if (charBefore === '/') {
      const lineStart = newVal.lastIndexOf('\n', cursor - 2) + 1;
      const lineContent = newVal.slice(lineStart, cursor - 1).trim();
      if (lineContent === '') {
        setShowSlash(true);
        setSlashPos(cursor - 1);
        setSlashFilter('');
        return;
      }
    }

    if (showSlash) {
      const filter = newVal.slice(slashPos + 1, cursor);
      if (filter.includes(' ') || filter.includes('\n')) {
        setShowSlash(false);
      } else {
        setSlashFilter(filter);
      }
    }
  };

  return (
    <div className="notion-editor rounded-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden bg-[var(--bg-surface)]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[rgba(255,255,255,0.05)] bg-[var(--bg-subtle)] overflow-x-auto">
        {TOOLBAR_ITEMS.map((item, i) => {
          if ('type' in item && item.type === 'divider') {
            return <div key={i} className="w-px h-5 bg-[rgba(255,255,255,0.08)] mx-1" />;
          }
          const Icon = item.icon!;
          return (
            <button
              key={i}
              onClick={() => execCommand(item.command!)}
              title={`${item.label} (${item.shortcut})`}
              className="p-1.5 rounded-md text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] transition-colors shrink-0"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <span className="text-[9px] text-[var(--text-subtle)] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[rgba(255,255,255,0.05)]">
            Type / for commands
          </span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Start writing... Use / for commands, Ctrl+B for bold, Ctrl+I for italic...'}
          className="w-full p-5 font-mono text-[13px] text-[var(--text-primary)] bg-transparent outline-none resize-y leading-relaxed placeholder:text-[var(--text-subtle)]"
          style={{ minHeight }}
          spellCheck={false}
        />

        {/* Slash Command Menu */}
        {showSlash && (
          <div className="absolute left-5 z-50 w-64 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[var(--bg-surface)] shadow-2xl shadow-black/40 py-1.5 max-h-64 overflow-y-auto"
            style={{ top: '40px' }}
          >
            <div className="px-3 py-1.5 border-b border-[rgba(255,255,255,0.05)]">
              <span className="text-[9px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Commands</span>
            </div>
            {filteredSlash.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const ta = textareaRef.current!;
                    const newVal = value.slice(0, slashPos) + value.slice(ta.selectionStart);
                    onChange(newVal);
                    requestAnimationFrame(() => {
                      ta.setSelectionRange(slashPos, slashPos);
                      execCommand(cmd.id);
                    });
                    setShowSlash(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--text-primary)]">{cmd.label}</p>
                    <p className="text-[10px] text-[var(--text-subtle)]">{cmd.desc}</p>
                  </div>
                </button>
              );
            })}
            {filteredSlash.length === 0 && (
              <p className="px-3 py-3 text-xs text-[var(--text-subtle)]">No commands found</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.04)] bg-[var(--bg-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] text-[var(--text-subtle)]">
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[rgba(255,255,255,0.08)]">Ctrl+B</kbd> Bold</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[rgba(255,255,255,0.08)]">Ctrl+I</kbd> Italic</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[rgba(255,255,255,0.08)]">Ctrl+E</kbd> Code</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[rgba(255,255,255,0.08)]">/</kbd> Commands</span>
        </div>
        <span className="text-[9px] text-[var(--text-subtle)] tabular-nums">{value.length} chars</span>
      </div>
    </div>
  );
}
