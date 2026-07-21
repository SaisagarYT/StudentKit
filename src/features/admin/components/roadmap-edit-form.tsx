'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { roadmapService, projectRepository, type ProjectListItem } from '@/lib/cms';
import { ROADMAP_CATEGORIES, DIFFICULTIES, STAGE_COLORS } from '@/lib/cms/schemas';
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Save,
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

export function RoadmapEditForm() {
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

  useEffect(() => {
    if (!id) { setError('No roadmap ID provided'); setLoading(false); return; }
    async function load() {
      try {
        const roadmap = await roadmapService.getById(id!);
        setForm({
          slug: roadmap.slug,
          title: roadmap.title,
          shortDescription: roadmap.shortDescription,
          description: roadmap.description,
          category: roadmap.category,
          difficulty: roadmap.difficulty,
          estimatedDuration: roadmap.estimatedDuration,
          icon: roadmap.icon,
          accent: roadmap.accent,
          targetAudience: roadmap.targetAudience.length > 0 ? roadmap.targetAudience : [''],
          learningOutcomes: roadmap.learningOutcomes.length > 0 ? roadmap.learningOutcomes : [''],
          prerequisites: roadmap.prerequisites.length > 0 ? roadmap.prerequisites : [''],
          tags: roadmap.tags.length > 0 ? roadmap.tags : [''],
          sections: roadmap.sections.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            timeEstimate: s.timeEstimate,
            color: s.color,
            order: s.order,
            topics: s.topics.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              timeEstimate: t.timeEstimate,
              whatToLearn: t.whatToLearn.length > 0 ? t.whatToLearn : [''],
              resources: t.resources.length > 0 ? t.resources : [{ title: '', url: '', type: 'article' }],
              project: t.project,
            })),
            projectIds: s.projectIds || [],
          })),
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load roadmap');
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

  function addSection() {
    update({
      sections: [...form.sections, { id: `section-${Date.now()}`, title: '', description: '', timeEstimate: '', color: 'green', order: form.sections.length, topics: [], projectIds: [] }],
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
    sections[sectionIdx].topics.push({ id: `topic-${Date.now()}`, title: '', description: '', timeEstimate: '', whatToLearn: [''], resources: [{ title: '', url: '', type: 'article' }], project: { title: '', description: '' } });
    update({ sections });
  }

  function updateTopic(sectionIdx: number, topicIdx: number, fields: Partial<Topic>) {
    const sections = [...form.sections];
    sections[sectionIdx].topics[topicIdx] = { ...sections[sectionIdx].topics[topicIdx], ...fields };
    update({ sections });
  }

  function removeTopic(sectionIdx: number, topicIdx: number) {
    const sections = [...form.sections];
    sections[sectionIdx].topics = sections[sectionIdx].topics.filter((_, i) => i !== topicIdx);
    update({ sections });
  }

  async function handleSave() {
    if (!id || !user) return;
    setSaving(true);
    setError('');
    setSuccess('');
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
            : [{ title: 'Documentation', url: 'https://example.com', type: 'docs' }],
          timeEstimate: t.timeEstimate || '1-2 hours',
          project: { title: t.project.title || `Build a ${t.title} project`, description: t.project.description || `Practice ${t.title}` },
        })),
      }));

      await roadmapService.update(id, {
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
          <button onClick={() => router.push('/admin/roadmaps')} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Roadmap</h1>
            <p className="text-sm text-[var(--text-secondary)]">{form.title || 'Untitled'}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">{success}</div>}

      {/* Basic Info */}
      <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 mb-6">
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
              <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="input-field">
                {ROADMAP_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select value={form.difficulty} onChange={(e) => update({ difficulty: e.target.value })} className="input-field">
                {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Duration"><input value={form.estimatedDuration} onChange={(e) => update({ estimatedDuration: e.target.value })} className="input-field" /></Field>
            <Field label="Accent">
              <div className="flex gap-2">
                <input type="color" value={form.accent} onChange={(e) => update({ accent: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                <input value={form.accent} onChange={(e) => update({ accent: e.target.value })} className="input-field flex-1 font-mono text-sm" />
              </div>
            </Field>
          </div>
          <Field label="Tags (comma-separated)"><input value={form.tags.join(', ')} onChange={(e) => update({ tags: e.target.value.split(',').map((t) => t.trim()) })} className="input-field" /></Field>
        </div>
      </div>

      {/* Sections */}
      <SectionsEditor
        form={form}
        addSection={addSection}
        updateSection={updateSection}
        removeSection={removeSection}
        addTopic={addTopic}
        updateTopic={updateTopic}
        removeTopic={removeTopic}
      />

      {/* Bottom save */}
      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function SectionsEditor({ form, addSection, updateSection, removeSection, addTopic, updateTopic, removeTopic }: any) {
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState<ProjectListItem[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [creatingForSection, setCreatingForSection] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ title: '', slug: '', shortDescription: '', difficulty: 'beginner', technologies: '', estimatedDuration: '' });
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    projectRepository.list({ status: 'published' as any }).then((p) => {
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

  async function handleCreateProject() {
    if (!user || creatingForSection === null) return;
    if (!newProject.title || !newProject.slug) { setCreateError('Title and slug are required.'); return; }
    setCreateSaving(true);
    setCreateError('');
    try {
      const id = await projectRepository.create({
        title: newProject.title,
        slug: newProject.slug,
        shortDescription: newProject.shortDescription || `Learn by building: ${newProject.title}`,
        description: newProject.shortDescription || `Learn by building: ${newProject.title}`,
        category: 'web',
        difficulty: newProject.difficulty,
        estimatedDuration: newProject.estimatedDuration || '1-2 weeks',
        technologies: newProject.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
        projectType: 'guided',
        experienceLevel: newProject.difficulty,
        skills: [], learningOutcomes: [], features: [], requirements: [], milestones: [],
        architecture: '', folderStructure: '', databaseConsiderations: '', apiConsiderations: '',
        testingGuidance: '', securityConsiderations: '', deploymentGuidance: '',
        extensionIdeas: [], tags: [], seo: {},
        relatedRoadmapIds: [], prerequisiteRoadmapIds: [], relatedProjectIds: [],
      }, user.uid);
      await projectRepository.publish(id, user.uid);
      const newEntry: ProjectListItem = { id, slug: newProject.slug, title: newProject.title, status: 'published', category: 'web', difficulty: newProject.difficulty as any, featured: false, technologies: newProject.technologies.split(',').map((t: string) => t.trim()).filter(Boolean), updatedAt: new Date(), publishedAt: new Date() };
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
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Sections ({form.sections.length})</h2>
        <button onClick={addSection} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)]">
          <Plus className="w-3.5 h-3.5" /> Add Section
        </button>
      </div>

      <div className="space-y-4">
        {form.sections.map((section: Section, sIdx: number) => (
          <div key={section.id} className="border border-[var(--border-soft)] rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-[var(--text-subtle)]" />
                <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase">Section {sIdx + 1}</span>
              </div>
              <button onClick={() => removeSection(sIdx)} className="p-1.5 rounded-md hover:bg-red-50 text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input value={section.title} onChange={(e: any) => updateSection(sIdx, { title: e.target.value })} placeholder="Title" className="input-field col-span-1" />
              <select value={section.color} onChange={(e: any) => updateSection(sIdx, { color: e.target.value })} className="input-field">
                {STAGE_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <input value={section.timeEstimate} onChange={(e: any) => updateSection(sIdx, { timeEstimate: e.target.value })} placeholder="e.g. 2 weeks" className="input-field" />
            </div>
            <textarea value={section.description} onChange={(e: any) => updateSection(sIdx, { description: e.target.value })} placeholder="Description" rows={2} className="input-field resize-none" />

            {/* Linked Projects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="text-xs font-medium text-[var(--text-primary)]">Linked Projects</span>
                </div>
                <button
                  onClick={() => { setCreatingForSection(sIdx); setNewProject({ title: '', slug: '', shortDescription: '', difficulty: 'beginner', technologies: '', estimatedDuration: '' }); setCreateError(''); }}
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
                        <button onClick={() => removeProjectFromSection(sIdx, pid)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    );
                  })}
                </div>
              )}
              {projectsLoaded && allProjects.length > 0 ? (
                <select value="" onChange={(e) => { if (e.target.value) addProjectToSection(sIdx, e.target.value); }} className="input-field text-xs">
                  <option value="">+ Link an existing project...</option>
                  {allProjects.filter((p) => !section.projectIds.includes(p.id)).map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
                  ))}
                </select>
              ) : projectsLoaded ? (
                <p className="text-[10px] text-[var(--text-subtle)]">No published projects yet. Use &quot;Create New&quot; to add one.</p>
              ) : null}

              {creatingForSection === sIdx && (
                <div className="mt-3 p-4 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">Quick Create Project</span>
                    <button onClick={() => setCreatingForSection(null)} className="text-[var(--text-subtle)] hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  {createError && <p className="text-[10px] text-red-500">{createError}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    <input value={newProject.title} onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))} placeholder="Project title *" className="input-field" />
                    <input value={newProject.slug} onChange={(e) => setNewProject(p => ({ ...p, slug: e.target.value }))} placeholder="slug *" className="input-field font-mono text-xs" />
                  </div>
                  <textarea value={newProject.shortDescription} onChange={(e) => setNewProject(p => ({ ...p, shortDescription: e.target.value }))} placeholder="Short description" rows={2} className="input-field resize-none" />
                  <div className="grid grid-cols-3 gap-2">
                    <select value={newProject.difficulty} onChange={(e) => setNewProject(p => ({ ...p, difficulty: e.target.value }))} className="input-field text-xs">
                      {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <input value={newProject.technologies} onChange={(e) => setNewProject(p => ({ ...p, technologies: e.target.value }))} placeholder="Tech (comma-sep)" className="input-field text-xs" />
                    <input value={newProject.estimatedDuration} onChange={(e) => setNewProject(p => ({ ...p, estimatedDuration: e.target.value }))} placeholder="e.g. 1-2 weeks" className="input-field text-xs" />
                  </div>
                  <button onClick={handleCreateProject} disabled={createSaving} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-dark)] text-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {createSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    {createSaving ? 'Creating...' : 'Create & Link'}
                  </button>
                </div>
              )}
            </div>

            {/* Topics */}
            <div className="pl-4 border-l-2 border-[var(--border-soft)] space-y-3 mt-3">
              {section.topics.map((topic: Topic, tIdx: number) => (
                <div key={topic.id} className="bg-[var(--bg-subtle)] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-subtle)]">Topic {tIdx + 1}</span>
                    <button onClick={() => removeTopic(sIdx, tIdx)} className="text-[var(--text-subtle)] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={topic.title} onChange={(e: any) => updateTopic(sIdx, tIdx, { title: e.target.value })} placeholder="Title" className="input-field" />
                    <input value={topic.timeEstimate} onChange={(e: any) => updateTopic(sIdx, tIdx, { timeEstimate: e.target.value })} placeholder="Time" className="input-field" />
                  </div>
                  <textarea value={topic.description} onChange={(e: any) => updateTopic(sIdx, tIdx, { description: e.target.value })} placeholder="Description" rows={2} className="input-field resize-none" />
                  <textarea value={topic.whatToLearn.join('\n')} onChange={(e: any) => updateTopic(sIdx, tIdx, { whatToLearn: e.target.value.split('\n') })} placeholder="What to learn (one per line)" rows={3} className="input-field resize-none font-mono text-xs" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={topic.project.title} onChange={(e: any) => updateTopic(sIdx, tIdx, { project: { ...topic.project, title: e.target.value } })} placeholder="Mini-project title" className="input-field" />
                    <input value={topic.project.description} onChange={(e: any) => updateTopic(sIdx, tIdx, { project: { ...topic.project, description: e.target.value } })} placeholder="Mini-project desc" className="input-field" />
                  </div>
                </div>
              ))}
              <button onClick={() => addTopic(sIdx)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border border-dashed border-[var(--border-default)]">
                <Plus className="w-3 h-3" /> Add Topic
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
