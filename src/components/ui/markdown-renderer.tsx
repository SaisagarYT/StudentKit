'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <style>{`
        .markdown-body {
          color: var(--text-primary);
          font-size: 15px;
          line-height: 1.8;
        }

        .markdown-body h1 { font-size: 28px; font-weight: 700; margin: 32px 0 16px; border-bottom: 1px solid var(--border-soft); padding-bottom: 8px; }
        .markdown-body h2 { font-size: 22px; font-weight: 700; margin: 28px 0 12px; }
        .markdown-body h3 { font-size: 18px; font-weight: 600; margin: 24px 0 10px; }
        .markdown-body h4 { font-size: 15px; font-weight: 600; margin: 20px 0 8px; }

        .markdown-body p { margin: 12px 0; color: var(--text-secondary); }
        .markdown-body strong { color: var(--text-primary); font-weight: 600; }

        .markdown-body ul, .markdown-body ol { margin: 12px 0; padding-left: 24px; }
        .markdown-body li { margin: 6px 0; color: var(--text-secondary); }
        .markdown-body li::marker { color: var(--accent-primary); }

        .markdown-body a { color: var(--accent-primary); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
        .markdown-body a:hover { border-bottom-color: var(--accent-primary); }

        .markdown-body blockquote {
          margin: 16px 0;
          padding: 12px 16px;
          border-left: 3px solid var(--accent-primary);
          background: var(--bg-subtle);
          border-radius: 0 8px 8px 0;
        }

        .markdown-body blockquote p { margin: 4px 0; color: var(--text-secondary); }

        .markdown-body code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--bg-subtle);
          color: var(--accent-primary);
        }

        .markdown-body pre {
          margin: 16px 0;
          padding: 16px 20px;
          border-radius: 12px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-soft);
          overflow-x: auto;
        }

        .markdown-body pre code {
          padding: 0;
          background: transparent;
          color: var(--text-primary);
          font-size: 13px;
          line-height: 1.6;
        }

        .markdown-body table {
          width: 100%;
          margin: 16px 0;
          border-collapse: collapse;
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          overflow: hidden;
        }

        .markdown-body th {
          background: var(--bg-subtle);
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-soft);
        }

        .markdown-body td {
          padding: 10px 14px;
          font-size: 13px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-soft);
        }

        .markdown-body tr:last-child td { border-bottom: none; }

        .markdown-body hr { margin: 24px 0; border: none; border-top: 1px solid var(--border-soft); }

        .markdown-body img { max-width: 100%; border-radius: 8px; margin: 16px 0; }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
