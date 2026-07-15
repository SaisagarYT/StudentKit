'use client';

import { useState, useRef } from 'react';
import { Upload, FileJson, X, Check, AlertCircle, Loader2, Download, Copy } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { roadmapService, projectService } from '@/lib/cms';

type ImportType = 'roadmap' | 'project';

interface ImportResult {
  success: boolean;
  title: string;
  error?: string;
}

const ROADMAP_TEMPLATE = {
  slug: "example-roadmap",
  title: "Example Roadmap",
  shortDescription: "A short description of this roadmap (10-200 chars)",
  description: "A longer description explaining what this roadmap covers and who it's for.",
  category: "web-development",
  difficulty: "beginner",
  estimatedDuration: "3 months",
  icon: "Code",
  accent: "#4F46E5",
  targetAudience: ["College students", "Self-learners"],
  learningOutcomes: ["Understand fundamentals", "Build real projects"],
  prerequisites: ["Basic computer knowledge"],
  tags: ["web", "frontend"],
  variants: [],
  relationships: [],
  sections: [
    {
      id: "section-1",
      title: "Getting Started",
      description: "Learn the basics and set up your environment",
      timeEstimate: "2 weeks",
      color: "green",
      order: 0,
      projectIds: [],
      topics: [
        {
          id: "topic-1-1",
          title: "Introduction",
          description: "Overview of the field and what to expect",
          timeEstimate: "1 hour",
          whatToLearn: ["Core concepts", "Industry overview", "Tools needed"],
          resources: [
            { title: "Official Docs", url: "https://example.com/docs", type: "docs" },
            { title: "Crash Course Video", url: "https://youtube.com/watch?v=example", type: "video" }
          ],
          project: {
            title: "Hello World Project",
            description: "Build a simple introductory project to verify your setup"
          }
        }
      ]
    }
  ],
  seo: {}
};

const PROJECT_TEMPLATE = {
  slug: "example-project",
  title: "Example Project",
  shortDescription: "A short description of this project (10-200 chars)",
  description: "Detailed description of the project, what students will build and learn.",
  category: "web-development",
  difficulty: "beginner",
  estimatedDuration: "2 weeks",
  projectType: "full-stack",
  experienceLevel: "beginner",
  technologies: ["React", "Node.js", "MongoDB"],
  skills: ["REST APIs", "State management"],
  learningOutcomes: ["Build a full-stack app", "Deploy to production"],
  features: [
    { title: "User Authentication", description: "Login/signup with email and password" }
  ],
  requirements: ["Node.js 18+", "Code editor"],
  milestones: [
    {
      title: "Project Setup",
      description: "Initialize the project and install dependencies",
      order: 0,
      objectives: ["Set up repo", "Install packages"],
      tasks: ["npm init", "Install React", "Configure ESLint"],
      estimatedDuration: "1 day"
    }
  ],
  architecture: "Client-Server architecture with React frontend and Express backend",
  folderStructure: "src/\n  client/\n  server/\n  shared/",
  databaseConsiderations: "Use MongoDB with Mongoose ODM",
  apiConsiderations: "RESTful API with JWT auth",
  testingGuidance: "Unit tests with Jest, E2E with Cypress",
  securityConsiderations: "Sanitize inputs, use helmet.js",
  deploymentGuidance: "Deploy frontend to Vercel, backend to Railway",
  extensionIdeas: [
    { level: "beginner", ideas: ["Add dark mode", "Add pagination"] },
    { level: "advanced", ideas: ["Add real-time features", "Add CI/CD"] }
  ],
  tags: ["react", "nodejs"],
  seo: {},
  relatedRoadmapIds: [],
  prerequisiteRoadmapIds: [],
  relatedProjectIds: []
};

export function JsonImport() {
  const { user } = useAuth();
  const [importType, setImportType] = useState<ImportType>('roadmap');
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [jsonPreview, setJsonPreview] = useState('');
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError('');
    setResults([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        const parsed = JSON.parse(text);
        setJsonPreview(JSON.stringify(parsed, null, 2));
      } catch {
        setParseError('Invalid JSON file. Please check the format.');
        setJsonPreview('');
      }
    };
    reader.readAsText(file);
  }

  function handlePaste(text: string) {
    setParseError('');
    setResults([]);
    try {
      const parsed = JSON.parse(text);
      setJsonPreview(JSON.stringify(parsed, null, 2));
    } catch {
      setParseError('Invalid JSON. Please check the format.');
    }
  }

  async function handleImport() {
    if (!user || !jsonPreview) return;

    setImporting(true);
    setResults([]);

    try {
      const data = JSON.parse(jsonPreview);
      const items = Array.isArray(data) ? data : [data];
      const importResults: ImportResult[] = [];

      for (const item of items) {
        try {
          if (importType === 'roadmap') {
            await roadmapService.create(item, user.uid);
          } else {
            await projectService.create(item, user.uid);
          }
          importResults.push({ success: true, title: item.title || item.slug || 'Unknown' });
        } catch (e: unknown) {
          importResults.push({
            success: false,
            title: item.title || item.slug || 'Unknown',
            error: e instanceof Error ? e.message : 'Unknown error',
          });
        }
      }

      setResults(importResults);
    } catch {
      setParseError('Failed to parse JSON data');
    }

    setImporting(false);
  }

  function downloadTemplate() {
    const template = importType === 'roadmap' ? ROADMAP_TEMPLATE : PROJECT_TEMPLATE;
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyTemplate() {
    const template = importType === 'roadmap' ? ROADMAP_TEMPLATE : PROJECT_TEMPLATE;
    navigator.clipboard.writeText(JSON.stringify(template, null, 2));
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import JSON
      </button>
    );
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <FileJson className="w-5 h-5 text-[var(--accent-dark)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Import from JSON</h2>
              <p className="text-xs text-[var(--text-secondary)]">Upload or paste JSON to create content</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Type selector */}
          <div className="flex gap-2">
            <button
              onClick={() => { setImportType('roadmap'); setJsonPreview(''); setResults([]); setParseError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'roadmap' ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)]' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Roadmap
            </button>
            <button
              onClick={() => { setImportType('project'); setJsonPreview(''); setResults([]); setParseError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'project' ? 'bg-[var(--accent-dark)] text-[var(--accent-primary)]' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Project
            </button>
          </div>

          {/* Template download */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
            <span className="text-xs text-[var(--text-secondary)] flex-1">
              Need the structure? Download or copy the template:
            </span>
            <button onClick={downloadTemplate} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
              <Download className="w-3 h-3" /> Download
            </button>
            <button onClick={copyTemplate} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>

          {/* File upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-[var(--border-default)] rounded-xl text-center hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/5 transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--text-subtle)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">Click to upload JSON file</p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">Single object or array of objects</p>
            </button>
          </div>

          {/* Or paste */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Or paste JSON directly:</label>
            <textarea
              placeholder='{"slug": "my-roadmap", "title": "My Roadmap", ...}'
              className="w-full h-40 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 resize-none"
              onChange={(e) => handlePaste(e.target.value)}
            />
          </div>

          {/* Parse error */}
          {parseError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {parseError}
            </div>
          )}

          {/* Preview info */}
          {jsonPreview && !parseError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              <Check className="w-4 h-4 shrink-0" />
              JSON parsed successfully — {Array.isArray(JSON.parse(jsonPreview)) ? `${JSON.parse(jsonPreview).length} items` : '1 item'} ready to import
            </div>
          )}

          {/* Import results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                {successCount > 0 && <span className="text-green-600 font-medium">{successCount} imported</span>}
                {failCount > 0 && <span className="text-red-600 font-medium">{failCount} failed</span>}
              </div>
              {results.map((r, i) => (
                <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg text-xs ${r.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                  {r.success ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                  <span className={`font-medium ${r.success ? 'text-green-700' : 'text-red-700'}`}>{r.title}</span>
                  {r.error && <span className="text-red-500 ml-auto truncate max-w-[200px]">{r.error}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Import button */}
          <button
            onClick={handleImport}
            disabled={!jsonPreview || !!parseError || importing}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {importType === 'roadmap' ? 'Roadmap(s)' : 'Project(s)'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
