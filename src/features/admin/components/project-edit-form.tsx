'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { projectService } from '@/lib/cms';
import { DIFFICULTIES } from '@/lib/cms/schemas';
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { Difficulty } from '@/lib/cms';

type Milestone = {
  title: string;
  description: string;
  order: number;
  objectives: string[];
  tasks: string[];
  estimatedDuration: string;
};

type Feature = {
  title: string;
  description: string;
};

type Phase = {
  id: string;
  phaseNumber: number;
  title: string;
  summary: string;
  estimatedDuration: string;
  imageUrl?: string;
  content: string;
  objectives: string[];
  checkpointTasks: string[];
};

const PROJECT_TYPES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'cli', label: 'CLI Tool' },
  { value: 'api', label: 'API' },
  { value: 'library', label: 'Library' },
];

const PROJECT_CATEGORIES = [
  { value: 'web-app', label: 'Web Application' },
  { value: 'mobile-app', label: 'Mobile Application' },
  { value: 'api-service', label: 'API / Service' },
  { value: 'developer-tool', label: 'Developer Tool' },
  { value: 'game', label: 'Game' },
  { value: 'data', label: 'Data / ML' },
];

const AVAILABLE_ROADMAPS = [
  { slug: 'full-stack-developer', title: 'Full-Stack Development' },
  { slug: 'frontend-developer', title: 'Frontend Engineer' },
  { slug: 'backend-developer', title: 'Backend Engineer' },
  { slug: 'ai-engineer', title: 'AI & Machine Learning' },
  { slug: 'devops', title: 'DevOps & Cloud' },
  { slug: 'cybersecurity', title: 'Cybersecurity Analyst' },
  { slug: 'mobile-developer', title: 'Mobile App Engineer' },
  { slug: 'placement-prep', title: 'Campus Placement Prep' },
  { slug: 'oop', title: 'OOP Mastery' },
];

export function ProjectEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    slug: '',
    title: '',
    shortDescription: '',
    description: '',
    category: 'web-app',
    difficulty: 'beginner',
    estimatedDuration: '',
    projectType: 'frontend',
    experienceLevel: 'beginner',
    technologies: [''],
    skills: [''],
    learningOutcomes: [''],
    features: [] as Feature[],
    requirements: [''],
    milestones: [] as Milestone[],
    phases: [] as Phase[],
    architecture: '',
    folderStructure: '',
    databaseConsiderations: '',
    apiConsiderations: '',
    testingGuidance: '',
    securityConsiderations: '',
    deploymentGuidance: '',
    tags: [''],
    relatedRoadmapIds: [] as string[],
  });

  useEffect(() => {
    if (!id) { setError('No project ID provided'); setLoading(false); return; }
    async function load() {
      try {
        const project = await projectService.getById(id!);
        setForm({
          slug: project.slug,
          title: project.title,
          shortDescription: project.shortDescription,
          description: project.description,
          category: project.category,
          difficulty: project.difficulty,
          estimatedDuration: project.estimatedDuration,
          projectType: project.projectType,
          experienceLevel: project.experienceLevel,
          relatedRoadmapIds: project.relatedRoadmapIds ?? [],
          technologies: project.technologies.length > 0 ? project.technologies : [''],
          skills: project.skills.length > 0 ? project.skills : [''],
          learningOutcomes: project.learningOutcomes.length > 0 ? project.learningOutcomes : [''],
          features: project.features,
          requirements: project.requirements.length > 0 ? project.requirements : [''],
          milestones: project.milestones,
          phases: (project.phases || []) as Phase[],
          architecture: project.architecture,
          folderStructure: project.folderStructure,
          databaseConsiderations: project.databaseConsiderations,
          apiConsiderations: project.apiConsiderations,
          testingGuidance: project.testingGuidance,
          securityConsiderations: project.securityConsiderations,
          deploymentGuidance: project.deploymentGuidance,
          tags: project.tags.length > 0 ? project.tags : [''],
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function update(fields: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...fields }));
    setError('');
    setSuccess('');
  }

  async function handleSave() {
    if (!id || !user) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await projectService.update(id, {
        slug: form.slug,
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        estimatedDuration: form.estimatedDuration,
        projectType: form.projectType,
        experienceLevel: form.experienceLevel,
        technologies: form.technologies.filter(Boolean),
        skills: form.skills.filter(Boolean),
        learningOutcomes: form.learningOutcomes.filter(Boolean),
        features: form.features.filter((f) => f.title),
        requirements: form.requirements.filter(Boolean),
        milestones: form.milestones.filter((m) => m.title).map((m) => ({
          ...m,
          objectives: m.objectives.filter(Boolean),
          tasks: m.tasks.filter(Boolean),
        })),
        phases: (form.phases || []).filter((p) => p.title).map((p, idx) => ({
          ...p,
          phaseNumber: idx + 1,
          objectives: (p.objectives || []).filter(Boolean),
          checkpointTasks: (p.checkpointTasks || []).filter(Boolean),
        })),
        architecture: form.architecture,
        folderStructure: form.folderStructure,
        databaseConsiderations: form.databaseConsiderations,
        apiConsiderations: form.apiConsiderations,
        testingGuidance: form.testingGuidance,
        securityConsiderations: form.securityConsiderations,
        deploymentGuidance: form.deploymentGuidance,
        tags: form.tags.filter(Boolean),
        relatedRoadmapIds: form.relatedRoadmapIds || [],
      }, user.uid);
      setSuccess('Saved successfully!');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/projects')} className="p-2 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Project</h1>
            <p className="text-sm text-[var(--text-secondary)]">{form.title || 'Untitled'}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-3 rounded-sm bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-6 p-3 rounded-sm bg-green-50 border border-green-200 text-sm text-green-600">{success}</div>}
      {error && <div className="mb-6 p-3 rounded-sm bg-red-500/10 border border-red-500/30 text-sm text-red-600 dark:text-red-400">{error}</div>}
      {success && <div className="mb-6 p-3 rounded-sm bg-green-500/10 border border-green-500/30 text-sm text-green-600 dark:text-green-400">{success}</div>}

      {/* Basic Info */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Basic Info</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title"><input value={form.title} onChange={(e) => update({ title: e.target.value })} className="input-field" /></Field>
            <Field label="Slug"><input value={form.slug} onChange={(e) => update({ slug: e.target.value })} className="input-field font-mono text-sm" /></Field>
          </div>
          <Field label="Short Description"><textarea value={form.shortDescription} onChange={(e) => update({ shortDescription: e.target.value })} rows={2} className="input-field resize-none" /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => update({ description: e.target.value })} rows={4} className="input-field resize-y" /></Field>
          <div className="grid grid-cols-4 gap-4">
            <Field label="Category">
              <Select value={form.category} onValueChange={(val) => update({ category: val })}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Type">
              <Select value={form.projectType} onValueChange={(val) => update({ projectType: val })}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={form.difficulty} onValueChange={(val) => update({ difficulty: val as Difficulty })}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Duration"><input value={form.estimatedDuration} onChange={(e) => update({ estimatedDuration: e.target.value })} className="input-field" /></Field>
          </div>

          <Field label="Associated Career Roadmaps (Optional)" hint="Select roadmaps where this project will be recommended as a capstone">
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_ROADMAPS.map((r) => {
                const selected = (form.relatedRoadmapIds || []).includes(r.slug);
                return (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => {
                      const current = form.relatedRoadmapIds || [];
                      const next = selected ? current.filter((id: string) => id !== r.slug) : [...current, r.slug];
                      update({ relatedRoadmapIds: next });
                    }}
                    className={`px-3 py-1.5 rounded-sm text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)]'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-soft)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {r.title}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </div>

      {/* Technologies & Skills */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Technologies & Skills</h2>
        <div className="space-y-4">
          <ListField label="Technologies" items={form.technologies} onChange={(items) => update({ technologies: items })} placeholder="e.g. React" />
          <ListField label="Skills" items={form.skills} onChange={(items) => update({ skills: items })} placeholder="e.g. REST API design" />
          <ListField label="Requirements" items={form.requirements} onChange={(items) => update({ requirements: items })} placeholder="e.g. Node.js 18+" />
          <Field label="Tags (comma-separated)"><input value={form.tags.join(', ')} onChange={(e) => update({ tags: e.target.value.split(',').map((t) => t.trim()) })} className="input-field" /></Field>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Features ({form.features.length})</h2>
          <button onClick={() => update({ features: [...form.features, { title: '', description: '' }] })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)]">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={f.title} onChange={(e) => { const features = [...form.features]; features[i] = { ...features[i], title: e.target.value }; update({ features }); }} placeholder="Feature title" className="input-field flex-1" />
              <input value={f.description} onChange={(e) => { const features = [...form.features]; features[i] = { ...features[i], description: e.target.value }; update({ features }); }} placeholder="Description" className="input-field flex-1" />
              <button onClick={() => update({ features: form.features.filter((_, idx) => idx !== i) })} className="p-1.5 text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => update({ features: form.features.filter((_, idx) => idx !== i) })} className="p-1.5 text-[var(--text-subtle)] hover:text-rose-600 dark:hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Milestones ({form.milestones.length})</h2>
          <button onClick={() => update({ milestones: [...form.milestones, { title: '', description: '', order: form.milestones.length, objectives: [''], tasks: [''], estimatedDuration: '' }] })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)]">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-4">
          {form.milestones.map((m, i) => (
            <div key={i} className="border border-[var(--border-soft)] rounded-sm p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[var(--text-subtle)]">Milestone {i + 1}</span>
                <button onClick={() => update({ milestones: form.milestones.filter((_, idx) => idx !== i) })} className="p-1.5 text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={m.title} onChange={(e) => { const ms = [...form.milestones]; ms[i] = { ...ms[i], title: e.target.value }; update({ milestones: ms }); }} placeholder="Title" className="input-field" />
                <input value={m.estimatedDuration} onChange={(e) => { const ms = [...form.milestones]; ms[i] = { ...ms[i], estimatedDuration: e.target.value }; update({ milestones: ms }); }} placeholder="Duration" className="input-field" />
              </div>
              <textarea value={m.description} onChange={(e) => { const ms = [...form.milestones]; ms[i] = { ...ms[i], description: e.target.value }; update({ milestones: ms }); }} placeholder="Description" rows={2} className="input-field resize-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Architecture & Guidance</h2>
        <div className="space-y-4">
          <Field label="Architecture"><textarea value={form.architecture} onChange={(e) => update({ architecture: e.target.value })} rows={3} className="input-field resize-y" /></Field>
          <Field label="Folder Structure"><textarea value={form.folderStructure} onChange={(e) => update({ folderStructure: e.target.value })} rows={3} className="input-field resize-y font-mono text-xs" /></Field>
          <Field label="Database"><textarea value={form.databaseConsiderations} onChange={(e) => update({ databaseConsiderations: e.target.value })} rows={2} className="input-field resize-y" /></Field>
          <Field label="API"><textarea value={form.apiConsiderations} onChange={(e) => update({ apiConsiderations: e.target.value })} rows={2} className="input-field resize-y" /></Field>
          <Field label="Testing"><textarea value={form.testingGuidance} onChange={(e) => update({ testingGuidance: e.target.value })} rows={2} className="input-field resize-y" /></Field>
          <Field label="Security"><textarea value={form.securityConsiderations} onChange={(e) => update({ securityConsiderations: e.target.value })} rows={2} className="input-field resize-y" /></Field>
          <Field label="Deployment"><textarea value={form.deploymentGuidance} onChange={(e) => update({ deploymentGuidance: e.target.value })} rows={2} className="input-field resize-y" /></Field>
        </div>
      </div>

      {/* Masterclass Phases */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Masterclass Phases & Guided Articles ({form.phases.length})
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Sequenced technical deep-dive articles with code, verification checkpoints, and estimated reading duration.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextNum = form.phases.length + 1;
              update({
                phases: [
                  ...form.phases,
                  {
                    id: `phase-${nextNum}`,
                    phaseNumber: nextNum,
                    title: `Phase ${nextNum}: `,
                    summary: '',
                    estimatedDuration: '25 min read',
                    content: '## Overview\n\nExplain this phase of the project...\n\n```typescript\n// Implementation code\n```\n',
                    objectives: [''],
                    checkpointTasks: ['Verify implementation builds without errors'],
                  },
                ],
              });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> Add Phase
          </button>
        </div>

        {form.phases.length === 0 ? (
          <p className="text-xs text-[var(--text-subtle)] py-6 text-center border border-dashed border-[var(--border-soft)] rounded-sm">
            No phases configured. Click &quot;Add Phase&quot; to build step-by-step masterclass articles for this project.
          </p>
        ) : (
          <div className="space-y-4">
            {form.phases.map((ph, i) => (
              <div key={ph.id || i} className="border border-[var(--border-soft)] bg-[var(--bg-subtle)] rounded-sm p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-[var(--border-soft)] pb-2">
                  <span className="text-xs font-bold text-[var(--accent-dark)] uppercase">Phase {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = form.phases.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, phaseNumber: idx + 1 }));
                      update({ phases: remaining });
                    }}
                    className="p-1.5 text-[var(--text-subtle)] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Remove phase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Field label="Phase Title">
                      <input
                        value={ph.title}
                        onChange={(e) => {
                          const copy = [...form.phases];
                          copy[i] = { ...copy[i], title: e.target.value };
                          update({ phases: copy });
                        }}
                        className="input-field"
                        placeholder="e.g. Architecture & PostgreSQL Modeling"
                      />
                    </Field>
                  </div>
                  <div>
                    <Field label="Duration">
                      <input
                        value={ph.estimatedDuration}
                        onChange={(e) => {
                          const copy = [...form.phases];
                          copy[i] = { ...copy[i], estimatedDuration: e.target.value };
                          update({ phases: copy });
                        }}
                        className="input-field"
                        placeholder="e.g. 25 min read"
                      />
                    </Field>
                  </div>
                </div>
                <Field label="Synopsis">
                  <input
                    value={ph.summary}
                    onChange={(e) => {
                      const copy = [...form.phases];
                      copy[i] = { ...copy[i], summary: e.target.value };
                      update({ phases: copy });
                    }}
                    className="input-field"
                    placeholder="Short summary of implementation"
                  />
                </Field>
                <Field label="Article Markdown Content" hint="Markdown, code blocks, checklists">
                  <textarea
                    value={ph.content}
                    onChange={(e) => {
                      const copy = [...form.phases];
                      copy[i] = { ...copy[i], content: e.target.value };
                      update({ phases: copy });
                    }}
                    rows={6}
                    className="input-field font-mono text-xs resize-y"
                    placeholder="## Step 1: Implementation..."
                  />
                </Field>
                <ListField
                  label="Checkpoints"
                  placeholder="Verification task..."
                  items={ph.checkpointTasks && ph.checkpointTasks.length > 0 ? ph.checkpointTasks : ['']}
                  onChange={(items) => {
                    const copy = [...form.phases];
                    copy[i] = { ...copy[i], checkpointTasks: items };
                    update({ phases: copy });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
        {hint && <span className="text-[10px] text-[var(--text-subtle)]">{hint}</span>}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ListField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
        <button onClick={() => onChange([...items, ''])} className="text-[10px] font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)]">+ Add</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={item} onChange={(e) => { const copy = [...items]; copy[i] = e.target.value; onChange(copy); }} placeholder={placeholder} className="input-field flex-1" />
            {items.length > 1 && <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-1.5 text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}
