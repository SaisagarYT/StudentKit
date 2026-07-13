'use client';

import { useState, useMemo, useCallback } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { Copy, Download, Check } from 'lucide-react';

type License = 'MIT' | 'Apache 2.0' | 'GPL 3.0' | 'ISC' | 'None';

interface FormState {
  projectName: string;
  description: string;
  techStack: string;
  installation: string;
  usage: string;
  features: string;
  envVars: string;
  includeContributing: boolean;
  license: License;
  authorName: string;
  authorGithub: string;
}

const initialState: FormState = {
  projectName: '',
  description: '',
  techStack: '',
  installation: '',
  usage: '',
  features: '',
  envVars: '',
  includeContributing: false,
  license: 'MIT',
  authorName: '',
  authorGithub: '',
};

const LICENSE_OPTIONS: License[] = ['MIT', 'Apache 2.0', 'GPL 3.0', 'ISC', 'None'];

function generateMarkdown(state: FormState): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${state.projectName || 'My Project'}`);
  lines.push('');

  // Description
  if (state.description.trim()) {
    lines.push(state.description.trim());
    lines.push('');
  }

  // Tech Stack Badges
  const tags = state.techStack
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (tags.length > 0) {
    lines.push('## Tech Stack');
    lines.push('');
    lines.push(tags.map((tag) => `\`${tag}\``).join(' · '));
    lines.push('');
  }

  // Installation
  if (state.installation.trim()) {
    lines.push('## Installation');
    lines.push('');
    lines.push('```bash');
    lines.push(state.installation.trim());
    lines.push('```');
    lines.push('');
  }

  // Usage
  if (state.usage.trim()) {
    lines.push('## Usage');
    lines.push('');
    lines.push(state.usage.trim());
    lines.push('');
  }

  // Features
  const featureLines = state.features
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (featureLines.length > 0) {
    lines.push('## Features');
    lines.push('');
    featureLines.forEach((f) => {
      lines.push(`- ${f}`);
    });
    lines.push('');
  }

  // Environment Variables
  const envLines = state.envVars
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (envLines.length > 0) {
    lines.push('## Environment Variables');
    lines.push('');
    lines.push('| Variable | Description |');
    lines.push('| --- | --- |');
    envLines.forEach((line) => {
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.slice(0, eqIndex).trim();
        const desc = line.slice(eqIndex + 1).trim();
        lines.push(`| \`${key}\` | ${desc} |`);
      } else {
        lines.push(`| \`${line}\` | — |`);
      }
    });
    lines.push('');
  }

  // Contributing
  if (state.includeContributing) {
    lines.push('## Contributing');
    lines.push('');
    lines.push('Contributions are welcome! Please follow these steps:');
    lines.push('');
    lines.push('1. Fork the repository');
    lines.push('2. Create your feature branch (`git checkout -b feature/amazing-feature`)');
    lines.push('3. Commit your changes (`git commit -m \'Add amazing feature\'`)');
    lines.push('4. Push to the branch (`git push origin feature/amazing-feature`)');
    lines.push('5. Open a Pull Request');
    lines.push('');
  }

  // License
  if (state.license !== 'None') {
    lines.push('## License');
    lines.push('');
    lines.push(`This project is licensed under the ${state.license} License.`);
    lines.push('');
  }

  // Author
  if (state.authorName.trim() || state.authorGithub.trim()) {
    lines.push('## Author');
    lines.push('');
    if (state.authorName.trim() && state.authorGithub.trim()) {
      lines.push(`**${state.authorName.trim()}** — [GitHub](${state.authorGithub.trim()})`);
    } else if (state.authorName.trim()) {
      lines.push(`**${state.authorName.trim()}**`);
    } else {
      lines.push(`[GitHub](${state.authorGithub.trim()})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function renderMarkdownPreview(md: string): string {
  let html = md;

  // Escape HTML entities
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (```...```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="preview-code-block"><code>$2</code></pre>'
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="preview-inline-code">$1</code>');

  // Headers
  html = html.replace(/^## (.+)$/gm, '<h2 class="preview-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="preview-h1">$1</h1>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="preview-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Table
  html = html.replace(
    /^\| (.+) \|$/gm,
    (match) => {
      const cells = match
        .split('|')
        .filter(Boolean)
        .map((c) => c.trim());
      // Skip separator rows
      if (cells.every((c) => /^-+$/.test(c))) {
        return '';
      }
      const tds = cells.map((c) => `<td class="preview-td">${c}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }
  );
  // Wrap consecutive <tr> in table
  html = html.replace(
    /(<tr>[\s\S]*?<\/tr>\n?)+/g,
    '<table class="preview-table"><tbody>$&</tbody></table>'
  );

  // Unordered list items
  html = html.replace(/^- (.+)$/gm, '<li class="preview-li">$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li class="preview-li">[\s\S]*?<\/li>\n?)+/g,
    '<ul class="preview-ul">$&</ul>'
  );

  // Ordered list items
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="preview-oli">$1</li>');
  html = html.replace(
    /(<li class="preview-oli">[\s\S]*?<\/li>\n?)+/g,
    '<ol class="preview-ol">$&</ol>'
  );

  // Paragraphs: lines that are not already wrapped in HTML tags
  html = html
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return line;
      return `<p class="preview-p">${line}</p>`;
    })
    .join('\n');

  // Remove empty lines
  html = html.replace(/\n{2,}/g, '\n');

  return html;
}

export function ReadmeGeneratorForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [copied, setCopied] = useState(false);

  const updateField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const markdown = useMemo(() => generateMarkdown(form), [form]);
  const previewHtml = useMemo(() => renderMarkdownPreview(markdown), [markdown]);

  const handleCopy = async () => {
    trackToolUsage('readme-generator');
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Panel */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Project Name <span className="text-[var(--color-error)]">*</span>
            </label>
            <input
              type="text"
              value={form.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
              placeholder="My Awesome Project"
              className="form-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="A brief description of what your project does..."
              rows={3}
              className="form-input resize-y"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Tech Stack
            </label>
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => updateField('techStack', e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, Node.js"
              className="form-input"
            />
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              Comma-separated list of technologies
            </p>
          </div>

          {/* Installation */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Installation
            </label>
            <textarea
              value={form.installation}
              onChange={(e) => updateField('installation', e.target.value)}
              placeholder={"git clone https://github.com/user/repo.git\ncd repo\nnpm install\nnpm run dev"}
              rows={4}
              className="form-input resize-y font-mono text-sm"
            />
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              Commands will be wrapped in a code block
            </p>
          </div>

          {/* Usage */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Usage / Getting Started
            </label>
            <textarea
              value={form.usage}
              onChange={(e) => updateField('usage', e.target.value)}
              placeholder="Describe how to use your project after installation..."
              rows={3}
              className="form-input resize-y"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Features
            </label>
            <textarea
              value={form.features}
              onChange={(e) => updateField('features', e.target.value)}
              placeholder={"Fast and lightweight\nResponsive design\nDark mode support\nTypeScript ready"}
              rows={4}
              className="form-input resize-y"
            />
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              One feature per line — each becomes a bullet point
            </p>
          </div>

          {/* Environment Variables */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              Environment Variables
            </label>
            <textarea
              value={form.envVars}
              onChange={(e) => updateField('envVars', e.target.value)}
              placeholder={"DATABASE_URL=Your database connection string\nAPI_KEY=Your API key from the dashboard\nPORT=Server port (default: 3000)"}
              rows={3}
              className="form-input resize-y font-mono text-sm"
            />
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              Format: KEY=description (one per line)
            </p>
          </div>

          {/* Contributing */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="contributing"
              checked={form.includeContributing}
              onChange={(e) => updateField('includeContributing', e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-default)] text-[var(--accent-dark)] focus:ring-[var(--accent-dark)]"
            />
            <label
              htmlFor="contributing"
              className="text-sm text-[var(--text-secondary)] cursor-pointer"
            >
              Include Contributing section
            </label>
          </div>

          {/* License */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
              License
            </label>
            <select
              value={form.license}
              onChange={(e) => updateField('license', e.target.value as License)}
              className="form-input"
            >
              {LICENSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => updateField('authorName', e.target.value)}
                placeholder="Jane Doe"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={form.authorGithub}
                onChange={(e) => updateField('authorGithub', e.target.value)}
                placeholder="https://github.com/janedoe"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!form.projectName.trim()}
            className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Markdown
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!form.projectName.trim()}
            className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-semibold border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download README.md
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
            Live Preview
          </span>
          <span className="text-xs text-[var(--text-subtle)]">
            {markdown.length} chars
          </span>
        </div>
        <div
          className="readme-preview prose-sm overflow-y-auto max-h-[70vh]"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />

        <style jsx>{`
          .readme-preview :global(.preview-h1) {
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-soft);
            color: var(--text-primary);
          }
          .readme-preview :global(.preview-h2) {
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.01em;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
          }
          .readme-preview :global(.preview-p) {
            margin: 0.25rem 0;
            line-height: 1.6;
            color: var(--text-secondary);
          }
          .readme-preview :global(.preview-code-block) {
            display: block;
            background: var(--bg-subtle);
            border: 1px solid var(--border-soft);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            margin: 0.5rem 0;
            overflow-x: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.8125rem;
            line-height: 1.6;
            color: var(--text-primary);
            white-space: pre;
          }
          .readme-preview :global(.preview-inline-code) {
            background: var(--bg-subtle);
            border: 1px solid var(--border-soft);
            border-radius: 0.25rem;
            padding: 0.125rem 0.375rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.8125rem;
            color: var(--text-primary);
          }
          .readme-preview :global(.preview-ul),
          .readme-preview :global(.preview-ol) {
            margin: 0.5rem 0;
            padding-left: 1.25rem;
            color: var(--text-secondary);
          }
          .readme-preview :global(.preview-ul) {
            list-style-type: disc;
          }
          .readme-preview :global(.preview-ol) {
            list-style-type: decimal;
          }
          .readme-preview :global(.preview-li),
          .readme-preview :global(.preview-oli) {
            margin: 0.25rem 0;
            line-height: 1.5;
          }
          .readme-preview :global(.preview-table) {
            width: 100%;
            border-collapse: collapse;
            margin: 0.5rem 0;
            font-size: 0.8125rem;
          }
          .readme-preview :global(.preview-td) {
            border: 1px solid var(--border-soft);
            padding: 0.5rem 0.75rem;
            color: var(--text-secondary);
          }
          .readme-preview :global(tr:first-child .preview-td) {
            font-weight: 600;
            color: var(--text-primary);
            background: var(--bg-subtle);
          }
          .readme-preview :global(.preview-link) {
            color: var(--accent-dark);
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .readme-preview :global(.preview-link:hover) {
            opacity: 0.8;
          }
        `}</style>
      </div>
    </div>
  );
}
