'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { roadmapService, projectService, projectRepository, type ProjectListItem } from '@/lib/cms';
import { ROADMAP_CATEGORIES, DIFFICULTIES, STAGE_COLORS } from '@/lib/cms/schemas';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  FolderOpen,
  X,
  PlusCircle,
} from 'lucide-react';

type Section = {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  color: string;
  order: number;
  topics: Topic[];
  projectIds: string[];
};

type Topic = {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  whatToLearn: string[];
  resources: { title: string; url: string; type: string }[];
  project: { title: string; description: string };
};

const STEPS = [
  'Basic Info',
  'Details',
  'Audience & Outcomes',
  'Sections',
  'Review',
];

export function RoadmapForm() {
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
    category: 'web-development',
    difficulty: 'beginner',
    estimatedDuration: '',
    icon: '🗺️',
    accent: '#C7FF3D',
    targetAudience: [''],
    learningOutcomes: [''],
    prerequisites: [''],
    tags: [''],
    sections: [] as Section[],
  });

  function update(fields: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...fields }));
    setError('');
  }

  function addSection() {
    const id = `section-${Date.now()}`;
    update({
      sections: [
        ...form.sections,
        {
          id,
          title: '',
          description: '',
          timeEstimate: '',
          color: 'green',
          order: form.sections.length,
          topics: [],
          projectIds: [],
        },
      ],
    });
  }

  function updateSection(idx: number, fields: Partial<Section>) {
    const sections = [...form.sections];
    sections[idx] = { ...sections[idx], ...fields };
    update({ sections });
  }

  function removeSection(idx: number) {
    update({ sections: form.sections.filter((_, i) => i !== idx) });
  }

  function addTopic(sectionIdx: number) {
    const sections = [...form.sections];
    sections[sectionIdx].topics.push({
      id: `topic-${Date.now()}`,
      title: '',
      description: '',
      timeEstimate: '',
      whatToLearn: [''],
      resources: [{ title: '', url: '', type: 'article' }],
      project: { title: '', description: '' },
    });
    update({ sections });
  }

  function updateTopic(sectionIdx: number, topicIdx: number, fields: Partial<Topic>) {
    const sections = [...form.sections];
    sections[sectionIdx].topics[topicIdx] = {
      ...sections[sectionIdx].topics[topicIdx],
      ...fields,
    };
    update({ sections });
  }

  function removeTopic(sectionIdx: number, topicIdx: number) {
    const sections = [...form.sections];
    sections[sectionIdx].topics = sections[sectionIdx].topics.filter((_, i) => i !== topicIdx);
    update({ sections });
  }

  function validateStep(): boolean {
    switch (step) {
      case 0:
        if (!form.title || !form.slug || !form.shortDescription) {
          setError('Fill in title, slug, and short description.');
          return false;
        }
        if (!/^[a-z0-9-]+$/.test(form.slug)) {
          setError('Slug must be lowercase letters, numbers, and hyphens only.');
          return false;
        }
        return true;
      case 1:
        if (!form.description || !form.estimatedDuration) {
          setError('Fill in the full description and estimated duration.');
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        if (form.sections.length === 0) {
          setError('Add at least one section.');
          return false;
        }
        for (const section of form.sections) {
          if (!section.title) {
            setError('Every section needs a title.');
            return false;
          }
          if (section.topics.length === 0) {
            setError(`Section "${section.title}" needs at least one topic.`);
            return false;
          }
          for (const topic of section.topics) {
            if (!topic.title) {
              setError(`Every topic in "${section.title}" needs at least a title.`);
              return false;
            }
          }
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
      const sections = form.sections.map((s) => ({
        ...s,
        description: s.description || `Learn about ${s.title}`,
        timeEstimate: s.timeEstimate || '1-2 weeks',
        topics: s.topics.map((t) => ({
          ...t,
          description: t.description || `Learn about ${t.title}`,
          whatToLearn: t.whatToLearn.filter(Boolean).length > 0 ? t.whatToLearn.filter(Boolean) : ['Learn the fundamentals'],
          resources: t.resources.filter((r) => r.title && r.url).length > 0
            ? t.resources.filter((r) => r.title && r.url)
            : [{ title: 'Documentation', url: 'https://example.com', type: 'docs' as const }],
          timeEstimate: t.timeEstimate || '1-2 hours',
          project: {
            title: t.project.title || `Build a ${t.title} project`,
            description: t.project.description || `Practice what you learned about ${t.title}`,
          },
        })),
      }));

      const payload = {
        slug: form.slug,
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        category: form.category,
        difficulty: form.difficulty,
        estimatedDuration: form.estimatedDuration || '3-6 months',
        icon: form.icon,
        accent: form.accent,
        targetAudience: form.targetAudience.filter(Boolean),
        learningOutcomes: form.learningOutcomes.filter(Boolean),
        prerequisites: form.prerequisites.filter(Boolean),
        tags: form.tags.filter(Boolean),
        sections,
        variants: [],
        relationships: [],
        seo: {},
      };
      await roadmapService.create(payload, user!.uid);
      router.push('/admin/roadmaps');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create roadmap');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/admin/roadmaps')} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">New Roadmap</h1>
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
        {step === 1 && <StepDetails form={form} update={update} />}
        {step === 2 && <StepAudience form={form} update={update} />}
        {step === 3 && (
          <StepSections
            form={form}
            addSection={addSection}
            updateSection={updateSection}
            removeSection={removeSection}
            addTopic={addTopic}
            updateTopic={updateTopic}
            removeTopic={removeTopic}
            update={update}
          />
        )}
        {step === 4 && <StepReview form={form} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={prev} disabled={step === 0} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={next} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 transition-opacity">
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Creating...' : 'Create Roadmap'}
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
        <input value={form.title} onChange={(e) => update({ title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} placeholder="e.g. Frontend Developer" className="input-field" />
      </Field>
      <Field label="Slug" required hint="URL-friendly identifier">
        <input value={form.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="frontend-developer" className="input-field font-mono text-sm" />
      </Field>
      <Field label="Short Description" required hint="Max 200 characters">
        <textarea value={form.shortDescription} onChange={(e) => update({ shortDescription: e.target.value })} placeholder="A brief summary shown in cards..." rows={2} maxLength={200} className="input-field resize-none" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="input-field">
            {ROADMAP_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Difficulty">
          <select value={form.difficulty} onChange={(e) => update({ difficulty: e.target.value })} className="input-field">
            {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Icon (emoji)">
          <input value={form.icon} onChange={(e) => update({ icon: e.target.value })} className="input-field text-center text-xl" />
        </Field>
        <Field label="Accent Color">
          <div className="flex items-center gap-2">
            <input type="color" value={form.accent} onChange={(e) => update({ accent: e.target.value })} className="w-10 h-10 rounded-lg border border-[var(--border-default)] cursor-pointer" />
            <input value={form.accent} onChange={(e) => update({ accent: e.target.value })} className="input-field flex-1 font-mono text-sm" />
          </div>
        </Field>
        <Field label="Duration">
          <input value={form.estimatedDuration} onChange={(e) => update({ estimatedDuration: e.target.value })} placeholder="e.g. 3-6 months" className="input-field" />
        </Field>
      </div>
    </div>
  );
}

function StepDetails({ form, update }: { form: any; update: (f: any) => void }) {
  return (
    <div className="space-y-5">
      <Field label="Full Description" required>
        <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="Detailed description of the roadmap..." rows={6} className="input-field resize-y" />
      </Field>
      <Field label="Tags" hint="Comma-separated">
        <input value={form.tags.join(', ')} onChange={(e) => update({ tags: e.target.value.split(',').map((t: string) => t.trim()) })} placeholder="react, javascript, web" className="input-field" />
      </Field>
    </div>
  );
}

function StepAudience({ form, update }: { form: any; update: (f: any) => void }) {
  return (
    <div className="space-y-6">
      <ListField label="Target Audience" items={form.targetAudience} onChange={(items) => update({ targetAudience: items })} placeholder="e.g. CS students wanting to become frontend devs" />
      <ListField label="Learning Outcomes" items={form.learningOutcomes} onChange={(items) => update({ learningOutcomes: items })} placeholder="e.g. Build production-ready React apps" />
      <ListField label="Prerequisites" items={form.prerequisites} onChange={(items) => update({ prerequisites: items })} placeholder="e.g. Basic HTML/CSS knowledge" />
    </div>
  );
}

function StepSections({ form, addSection, updateSection, removeSection, addTopic, updateTopic, removeTopic, update }: any) {
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState<ProjectListItem[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [creatingForSection, setCreatingForSection] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ title: '', slug: '', shortDescription: '', category: 'web', difficulty: 'beginner', technologies: '', estimatedDuration: '' });
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    projectService.list({ status: 'published' }).then((p) => {
      setAllProjects(p);
      setProjectsLoaded(true);
    }).catch(() => setProjectsLoaded(true));
  }, []);

  function addProjectToSection(sIdx: number, projectId: string) {
    if (form.sections[sIdx].projectIds.includes(projectId)) return;
    updateSection(sIdx, { projectIds: [...form.sections[sIdx].projectIds, projectId] });
  }

  function removeProjectFromSection(sIdx: number, projectId: string) {
    updateSection(sIdx, { projectIds: form.sections[sIdx].projectIds.filter((id: string) => id !== projectId) });
  }

  function openCreateProject(sIdx: number) {
    setCreatingForSection(sIdx);
    setNewProject({ title: '', slug: '', shortDescription: '', category: 'web', difficulty: 'beginner', technologies: '', estimatedDuration: '' });
    setCreateError('');
  }

  async function handleCreateProject() {
    if (!user || creatingForSection === null) return;
    if (!newProject.title || !newProject.slug) {
      setCreateError('Title and slug are required.');
      return;
    }
    setCreateSaving(true);
    setCreateError('');
    try {
      const id = await projectRepository.create({
        title: newProject.title,
        slug: newProject.slug,
        shortDescription: newProject.shortDescription || `Learn by building: ${newProject.title}`,
        description: newProject.shortDescription || `Learn by building: ${newProject.title}`,
        category: newProject.category,
        difficulty: newProject.difficulty,
        estimatedDuration: newProject.estimatedDuration || '1-2 weeks',
        technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
        projectType: 'guided',
        experienceLevel: newProject.difficulty,
        skills: [],
        learningOutcomes: [],
        features: [],
        requirements: [],
        milestones: [],
        architecture: '',
        folderStructure: '',
        databaseConsiderations: '',
        apiConsiderations: '',
        testingGuidance: '',
        securityConsiderations: '',
        deploymentGuidance: '',
        extensionIdeas: [],
        tags: [],
        seo: {},
        relatedRoadmapIds: [],
        prerequisiteRoadmapIds: [],
        relatedProjectIds: [],
      }, user.uid);

      // Publish it immediately so it shows in roadmap
      await projectRepository.publish(id, user.uid);

      // Add to local list and link to section
      const newEntry: ProjectListItem = {
        id,
        slug: newProject.slug,
        title: newProject.title,
        status: 'published',
        category: newProject.category,
        difficulty: newProject.difficulty as any,
        featured: false,
        technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: new Date(),
        publishedAt: new Date(),
      };
      setAllProjects(prev => [newEntry, ...prev]);
      addProjectToSection(creatingForSection, id);
      setCreatingForSection(null);
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create project');
    } finally {
      setCreateSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{form.sections.length} section{form.sections.length !== 1 ? 's' : ''}</p>
        <button onClick={addSection} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)]">
          <Plus className="w-3.5 h-3.5" /> Add Section
        </button>
      </div>

      {form.sections.map((section: Section, sIdx: number) => (
        <div key={section.id} className="border border-[var(--border-soft)] rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-[var(--text-subtle)]" />
              <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase">Section {sIdx + 1}</span>
            </div>
            <button onClick={() => removeSection(sIdx)} className="p-1.5 rounded-md hover:bg-red-50 text-[var(--text-subtle)] hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input value={section.title} onChange={(e) => updateSection(sIdx, { title: e.target.value })} placeholder="Section title" className="input-field" />
            <div className="grid grid-cols-2 gap-2">
              <select value={section.color} onChange={(e) => updateSection(sIdx, { color: e.target.value })} className="input-field">
                {STAGE_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <input value={section.timeEstimate} onChange={(e) => updateSection(sIdx, { timeEstimate: e.target.value })} placeholder="e.g. 2 weeks" className="input-field" />
            </div>
          </div>
          <textarea value={section.description} onChange={(e) => updateSection(sIdx, { description: e.target.value })} placeholder="Section description" rows={2} className="input-field resize-none" />

          {/* Linked Projects */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span className="text-xs font-medium text-[var(--text-primary)]">Linked Projects</span>
              </div>
              <button
                onClick={() => openCreateProject(sIdx)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-[var(--accent-dark)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors"
              >
                <PlusCircle className="w-3 h-3" /> Create New
              </button>
            </div>
            {section.projectIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {section.projectIds.map((pid: string) => {
                  const proj = allProjects.find((p) => p.id === pid);
                  return (
                    <span key={pid} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--accent-primary)]/15 text-[var(--accent-dark)]">
                      {proj?.title || pid}
                      <button onClick={() => removeProjectFromSection(sIdx, pid)} className="hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {projectsLoaded && allProjects.length > 0 ? (
              <select
                value=""
                onChange={(e) => { if (e.target.value) addProjectToSection(sIdx, e.target.value); }}
                className="input-field text-xs"
              >
                <option value="">+ Link an existing project...</option>
                {allProjects.filter((p) => !section.projectIds.includes(p.id)).map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
                ))}
              </select>
            ) : projectsLoaded ? (
              <p className="text-[10px] text-[var(--text-subtle)]">No published projects yet. Use &quot;Create New&quot; to add one.</p>
            ) : null}

            {/* Inline Project Creator */}
            {creatingForSection === sIdx && (
              <div className="mt-3 p-4 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Quick Create Project</span>
                  <button onClick={() => setCreatingForSection(null)} className="text-[var(--text-subtle)] hover:text-red-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {createError && <p className="text-[10px] text-red-500">{createError}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newProject.title}
                    onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))}
                    placeholder="Project title *"
                    className="input-field"
                  />
                  <input
                    value={newProject.slug}
                    onChange={(e) => setNewProject(p => ({ ...p, slug: e.target.value }))}
                    placeholder="slug *"
                    className="input-field font-mono text-xs"
                  />
                </div>
                <textarea
                  value={newProject.shortDescription}
                  onChange={(e) => setNewProject(p => ({ ...p, shortDescription: e.target.value }))}
                  placeholder="Short description of the project"
                  rows={2}
                  className="input-field resize-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <select value={newProject.difficulty} onChange={(e) => setNewProject(p => ({ ...p, difficulty: e.target.value }))} className="input-field text-xs">
                    {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                  <input
                    value={newProject.technologies}
                    onChange={(e) => setNewProject(p => ({ ...p, technologies: e.target.value }))}
                    placeholder="Tech (comma-sep)"
                    className="input-field text-xs"
                  />
                  <input
                    value={newProject.estimatedDuration}
                    onChange={(e) => setNewProject(p => ({ ...p, estimatedDuration: e.target.value }))}
                    placeholder="e.g. 1-2 weeks"
                    className="input-field text-xs"
                  />
                </div>
                <button
                  onClick={handleCreateProject}
                  disabled={createSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {createSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  {createSaving ? 'Creating...' : 'Create & Link'}
                </button>
              </div>
            )}
          </div>

          {/* Topics */}
          <div className="pl-4 border-l-2 border-[var(--border-soft)] space-y-3">
            {section.topics.map((topic: Topic, tIdx: number) => (
              <div key={topic.id} className="bg-[var(--bg-subtle)] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-subtle)]">Topic {tIdx + 1}</span>
                  <button onClick={() => removeTopic(sIdx, tIdx)} className="text-[var(--text-subtle)] hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={topic.title} onChange={(e) => updateTopic(sIdx, tIdx, { title: e.target.value })} placeholder="Topic title" className="input-field" />
                  <input value={topic.timeEstimate} onChange={(e) => updateTopic(sIdx, tIdx, { timeEstimate: e.target.value })} placeholder="e.g. 3 hours" className="input-field" />
                </div>
                <textarea value={topic.description} onChange={(e) => updateTopic(sIdx, tIdx, { description: e.target.value })} placeholder="Topic description" rows={2} className="input-field resize-none" />
                <Field label="What to Learn" hint="One per line">
                  <textarea value={topic.whatToLearn.join('\n')} onChange={(e) => updateTopic(sIdx, tIdx, { whatToLearn: e.target.value.split('\n') })} placeholder="Key concept 1&#10;Key concept 2" rows={3} className="input-field resize-none font-mono text-xs" />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <input value={topic.project.title} onChange={(e) => updateTopic(sIdx, tIdx, { project: { ...topic.project, title: e.target.value } })} placeholder="Mini-project title" className="input-field" />
                  <input value={topic.project.description} onChange={(e) => updateTopic(sIdx, tIdx, { project: { ...topic.project, description: e.target.value } })} placeholder="Mini-project desc" className="input-field" />
                </div>
              </div>
            ))}
            <button onClick={() => addTopic(sIdx)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border border-dashed border-[var(--border-default)] transition-colors">
              <Plus className="w-3 h-3" /> Add Topic
            </button>
          </div>
        </div>
      ))}

      {form.sections.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[var(--border-default)] rounded-xl">
          <p className="text-sm text-[var(--text-subtle)]">No sections yet. Add your first section to define the roadmap structure.</p>
        </div>
      )}
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
        <div><span className="text-[var(--text-subtle)]">Category:</span> <span className="text-[var(--text-primary)]">{form.category}</span></div>
        <div><span className="text-[var(--text-subtle)]">Difficulty:</span> <span className="text-[var(--text-primary)]">{form.difficulty}</span></div>
        <div><span className="text-[var(--text-subtle)]">Duration:</span> <span className="text-[var(--text-primary)]">{form.estimatedDuration}</span></div>
        <div><span className="text-[var(--text-subtle)]">Sections:</span> <span className="text-[var(--text-primary)]">{form.sections.length}</span></div>
        <div><span className="text-[var(--text-subtle)]">Topics:</span> <span className="text-[var(--text-primary)]">{form.sections.reduce((acc: number, s: Section) => acc + s.topics.length, 0)}</span></div>
      </div>
      {form.sections.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Sections</p>
          {form.sections.map((s: Section, i: number) => (
            <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--bg-subtle)]">
              <span className="w-6 h-6 rounded-md bg-[var(--accent-dark)] text-[var(--accent-primary)] flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-sm text-[var(--text-primary)]">{s.title || '(Untitled)'}</span>
              <span className="text-xs text-[var(--text-subtle)] ml-auto">{s.topics.length} topics</span>
            </div>
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
