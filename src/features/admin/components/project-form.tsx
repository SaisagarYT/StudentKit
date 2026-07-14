'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { projectService } from '@/lib/cms';
import { DIFFICULTIES } from '@/lib/cms/schemas';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';

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

const STEPS = [
  'Basic Info',
  'Technologies & Skills',
  'Features & Milestones',
  'Architecture',
  'Review',
];

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

export function ProjectForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    architecture: '',
    folderStructure: '',
    databaseConsiderations: '',
    apiConsiderations: '',
    testingGuidance: '',
    securityConsiderations: '',
    deploymentGuidance: '',
    tags: [''],
  });

  function update(fields: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...fields }));
    setError('');
  }

  function addFeature() {
    update({ features: [...form.features, { title: '', description: '' }] });
  }

  function updateFeature(idx: number, fields: Partial<Feature>) {
    const features = [...form.features];
    features[idx] = { ...features[idx], ...fields };
    update({ features });
  }

  function removeFeature(idx: number) {
    update({ features: form.features.filter((_, i) => i !== idx) });
  }

  function addMilestone() {
    update({
      milestones: [
        ...form.milestones,
        { title: '', description: '', order: form.milestones.length, objectives: [''], tasks: [''], estimatedDuration: '' },
      ],
    });
  }

  function updateMilestone(idx: number, fields: Partial<Milestone>) {
    const milestones = [...form.milestones];
    milestones[idx] = { ...milestones[idx], ...fields };
    update({ milestones });
  }

  function removeMilestone(idx: number) {
    update({ milestones: form.milestones.filter((_, i) => i !== idx) });
  }

  function validateStep(): boolean {
    switch (step) {
      case 0:
        if (!form.title || !form.slug || !form.shortDescription || !form.description) {
          setError('Fill in all required fields.');
          return false;
        }
        if (!/^[a-z0-9-]+$/.test(form.slug)) {
          setError('Slug must be lowercase letters, numbers, and hyphens only.');
          return false;
        }
        return true;
      case 1:
        if (form.technologies.filter(Boolean).length === 0) {
          setError('Add at least one technology.');
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        technologies: form.technologies.filter(Boolean),
        skills: form.skills.filter(Boolean),
        learningOutcomes: form.learningOutcomes.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
        tags: form.tags.filter(Boolean),
        features: form.features.filter((f) => f.title),
        milestones: form.milestones.filter((m) => m.title).map((m) => ({
          ...m,
          objectives: m.objectives.filter(Boolean),
          tasks: m.tasks.filter(Boolean),
        })),
        extensionIdeas: [],
        seo: {},
        relatedRoadmapIds: [],
        prerequisiteRoadmapIds: [],
        relatedProjectIds: [],
      };
      await projectService.create(payload, user!.uid);
      router.push('/admin/projects');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create project');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/admin/projects')} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">New Project</h1>
          <p className="text-sm text-[var(--text-secondary)]">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[var(--accent-dark)]' : 'bg-[var(--bg-subtle)]'}`} />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">
        {step === 0 && <StepBasicInfo form={form} update={update} />}
        {step === 1 && <StepTechnologies form={form} update={update} />}
        {step === 2 && (
          <StepFeatures
            form={form}
            addFeature={addFeature}
            updateFeature={updateFeature}
            removeFeature={removeFeature}
            addMilestone={addMilestone}
            updateMilestone={updateMilestone}
            removeMilestone={removeMilestone}
          />
        )}
        {step === 3 && <StepArchitecture form={form} update={update} />}
        {step === 4 && <StepReview form={form} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={prev} disabled={step === 0} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Creating...' : 'Create Project'}
          </button>
        )}
      </div>
    </div>
  );
}

// --- Step Components ---

function StepBasicInfo({ form, update }: { form: any; update: (f: any) => void }) {
  return (
    <div className="space-y-5">
      <Field label="Title" required>
        <input value={form.title} onChange={(e) => update({ title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} placeholder="e.g. Task Manager App" className="input-field" />
      </Field>
      <Field label="Slug" required hint="URL-friendly identifier">
        <input value={form.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="task-manager-app" className="input-field font-mono text-sm" />
      </Field>
      <Field label="Short Description" required hint="Max 200 characters">
        <textarea value={form.shortDescription} onChange={(e) => update({ shortDescription: e.target.value })} rows={2} maxLength={200} placeholder="Brief summary for project cards..." className="input-field resize-none" />
      </Field>
      <Field label="Full Description" required>
        <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} rows={4} placeholder="Detailed project description..." className="input-field resize-y" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="input-field">
            {PROJECT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Project Type">
          <select value={form.projectType} onChange={(e) => update({ projectType: e.target.value })} className="input-field">
            {PROJECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Difficulty">
          <select value={form.difficulty} onChange={(e) => update({ difficulty: e.target.value, experienceLevel: e.target.value })} className="input-field">
            {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </Field>
        <Field label="Estimated Duration">
          <input value={form.estimatedDuration} onChange={(e) => update({ estimatedDuration: e.target.value })} placeholder="e.g. 2-3 weeks" className="input-field" />
        </Field>
      </div>
    </div>
  );
}

function StepTechnologies({ form, update }: { form: any; update: (f: any) => void }) {
  return (
    <div className="space-y-6">
      <ListField label="Technologies" required items={form.technologies} onChange={(items) => update({ technologies: items })} placeholder="e.g. React, Node.js, PostgreSQL" />
      <ListField label="Skills Learned" items={form.skills} onChange={(items) => update({ skills: items })} placeholder="e.g. REST API design" />
      <ListField label="Learning Outcomes" items={form.learningOutcomes} onChange={(items) => update({ learningOutcomes: items })} placeholder="e.g. Deploy a full-stack app" />
      <ListField label="Requirements" items={form.requirements} onChange={(items) => update({ requirements: items })} placeholder="e.g. Node.js 18+" />
      <Field label="Tags" hint="Comma-separated">
        <input value={form.tags.join(', ')} onChange={(e) => update({ tags: e.target.value.split(',').map((t: string) => t.trim()) })} placeholder="react, api, fullstack" className="input-field" />
      </Field>
    </div>
  );
}

function StepFeatures({ form, addFeature, updateFeature, removeFeature, addMilestone, updateMilestone, removeMilestone }: any) {
  return (
    <div className="space-y-8">
      {/* Features */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Features</span>
          <button onClick={addFeature} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)]">
            <Plus className="w-3.5 h-3.5" /> Add Feature
          </button>
        </div>
        <div className="space-y-3">
          {form.features.map((f: Feature, i: number) => (
            <div key={i} className="flex gap-3 items-start bg-[var(--bg-subtle)] rounded-lg p-3">
              <div className="flex-1 space-y-2">
                <input value={f.title} onChange={(e) => updateFeature(i, { title: e.target.value })} placeholder="Feature title" className="input-field" />
                <input value={f.description} onChange={(e) => updateFeature(i, { description: e.target.value })} placeholder="Feature description" className="input-field" />
              </div>
              <button onClick={() => removeFeature(i)} className="p-1.5 text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {form.features.length === 0 && <p className="text-xs text-[var(--text-subtle)] py-4 text-center">No features added yet.</p>}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Milestones</span>
          <button onClick={addMilestone} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)]">
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>
        <div className="space-y-4">
          {form.milestones.map((m: Milestone, i: number) => (
            <div key={i} className="border border-[var(--border-soft)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-subtle)]">Milestone {i + 1}</span>
                <button onClick={() => removeMilestone(i)} className="p-1.5 text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={m.title} onChange={(e) => updateMilestone(i, { title: e.target.value })} placeholder="Milestone title" className="input-field" />
                <input value={m.estimatedDuration} onChange={(e) => updateMilestone(i, { estimatedDuration: e.target.value })} placeholder="e.g. 3 days" className="input-field" />
              </div>
              <textarea value={m.description} onChange={(e) => updateMilestone(i, { description: e.target.value })} placeholder="What is achieved in this milestone?" rows={2} className="input-field resize-none" />
              <Field label="Objectives" hint="One per line">
                <textarea value={m.objectives.join('\n')} onChange={(e) => updateMilestone(i, { objectives: e.target.value.split('\n') })} rows={2} placeholder="Objective 1&#10;Objective 2" className="input-field resize-none font-mono text-xs" />
              </Field>
              <Field label="Tasks" hint="One per line">
                <textarea value={m.tasks.join('\n')} onChange={(e) => updateMilestone(i, { tasks: e.target.value.split('\n') })} rows={2} placeholder="Task 1&#10;Task 2" className="input-field resize-none font-mono text-xs" />
              </Field>
            </div>
          ))}
          {form.milestones.length === 0 && <p className="text-xs text-[var(--text-subtle)] py-4 text-center">No milestones added yet.</p>}
        </div>
      </div>
    </div>
  );
}

function StepArchitecture({ form, update }: { form: any; update: (f: any) => void }) {
  return (
    <div className="space-y-5">
      <Field label="Architecture Overview">
        <textarea value={form.architecture} onChange={(e) => update({ architecture: e.target.value })} rows={4} placeholder="High-level architecture description..." className="input-field resize-y" />
      </Field>
      <Field label="Folder Structure">
        <textarea value={form.folderStructure} onChange={(e) => update({ folderStructure: e.target.value })} rows={4} placeholder="src/&#10;  components/&#10;  pages/&#10;  utils/" className="input-field resize-y font-mono text-xs" />
      </Field>
      <Field label="Database Considerations">
        <textarea value={form.databaseConsiderations} onChange={(e) => update({ databaseConsiderations: e.target.value })} rows={3} placeholder="Schema design, relationships..." className="input-field resize-y" />
      </Field>
      <Field label="API Considerations">
        <textarea value={form.apiConsiderations} onChange={(e) => update({ apiConsiderations: e.target.value })} rows={3} placeholder="Endpoints, auth, rate limiting..." className="input-field resize-y" />
      </Field>
      <Field label="Testing Guidance">
        <textarea value={form.testingGuidance} onChange={(e) => update({ testingGuidance: e.target.value })} rows={3} placeholder="Unit tests, integration tests..." className="input-field resize-y" />
      </Field>
      <Field label="Security Considerations">
        <textarea value={form.securityConsiderations} onChange={(e) => update({ securityConsiderations: e.target.value })} rows={3} placeholder="Auth, input validation, CORS..." className="input-field resize-y" />
      </Field>
      <Field label="Deployment Guidance">
        <textarea value={form.deploymentGuidance} onChange={(e) => update({ deploymentGuidance: e.target.value })} rows={3} placeholder="CI/CD, hosting, environment vars..." className="input-field resize-y" />
      </Field>
    </div>
  );
}

function StepReview({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{form.title || '(Untitled)'}</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{form.shortDescription}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div><span className="text-[var(--text-subtle)]">Slug:</span> <span className="font-mono text-[var(--text-primary)]">{form.slug}</span></div>
        <div><span className="text-[var(--text-subtle)]">Type:</span> <span className="text-[var(--text-primary)]">{form.projectType}</span></div>
        <div><span className="text-[var(--text-subtle)]">Difficulty:</span> <span className="text-[var(--text-primary)]">{form.difficulty}</span></div>
        <div><span className="text-[var(--text-subtle)]">Duration:</span> <span className="text-[var(--text-primary)]">{form.estimatedDuration}</span></div>
        <div><span className="text-[var(--text-subtle)]">Technologies:</span> <span className="text-[var(--text-primary)]">{form.technologies.filter(Boolean).length}</span></div>
        <div><span className="text-[var(--text-subtle)]">Milestones:</span> <span className="text-[var(--text-primary)]">{form.milestones.length}</span></div>
      </div>
      {form.technologies.filter(Boolean).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {form.technologies.filter(Boolean).map((t: string) => (
            <span key={t} className="px-2 py-1 rounded-md text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)]">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Shared UI ---

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[var(--text-primary)]">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      {hint && <span className="text-[10px] text-[var(--text-subtle)] ml-2">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ListField({ label, required, items, onChange, placeholder }: { label: string; required?: boolean; items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--text-primary)]">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</span>
        <button onClick={() => onChange([...items, ''])} className="text-[10px] font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)]">+ Add</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={item} onChange={(e) => { const copy = [...items]; copy[i] = e.target.value; onChange(copy); }} placeholder={placeholder} className="input-field flex-1" />
            {items.length > 1 && (
              <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-1.5 text-[var(--text-subtle)] hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
