'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth';
import {
  roadmapService,
  projectService,
  projectRepository,
  type ProjectListItem,
  type Difficulty,
  type StageColor,
  type RoadmapCategory,
  type ResourceType,
} from '@/lib/cms';
import {
  ROADMAP_CATEGORIES,
  DIFFICULTIES,
  STAGE_COLORS,
} from '@/lib/cms/schemas';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Trash2,
  FolderOpen,
  X,
  PlusCircle,
  Upload,
  FileJson,
  Copy,
  Download,
  AlertCircle,
  Sparkles,
  MoveUp,
  MoveDown,
  RotateCcw,
  CheckCircle2,
  Save,
  FileText,
  Layers,
  Clock,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'sk_admin_roadmap_new_draft';

const SAMPLE_ROADMAP_TEMPLATE = {
  title: 'Full-Stack Web Development',
  slug: 'full-stack-web-development',
  shortDescription: 'Master modern full-stack web development from HTML/CSS to advanced backend systems.',
  description: '# Full-Stack Web Development\n\nA comprehensive career roadmap guiding you from web fundamentals to scalable cloud architectures.',
  category: 'web-development',
  difficulty: 'intermediate',
  estimatedDuration: '6 months',
  icon: '🚀',
  accent: '#C7FF3D',
  targetAudience: [
    'Aspiring software developers',
    'Computer science students',
    'Self-taught programmers transitioning to web dev',
  ],
  learningOutcomes: [
    'Build responsive, production-ready frontend web apps',
    'Design REST and GraphQL APIs with Node.js and TypeScript',
    'Model and manage relational and document databases',
    'Deploy and scale applications with CI/CD and containerization',
  ],
  prerequisites: [
    'Basic computer literacy',
    'Problem solving and algorithmic logic fundamentals',
  ],
  tags: ['react', 'typescript', 'nextjs', 'nodejs', 'postgresql', 'tailwind'],
  sections: [
    {
      id: 'frontend-fundamentals',
      title: 'Frontend Fundamentals',
      description: 'Core concepts of web presentation, user experience, and modern client scripting.',
      timeEstimate: '4 weeks',
      color: 'green',
      order: 0,
      projectIds: [],
      topics: [
        {
          id: 'modern-javascript',
          title: 'Modern JavaScript (ES6+)',
          description: 'Deep dive into asynchronous programming, closures, ES modules, and the DOM.',
          timeEstimate: '2 weeks',
          whatToLearn: [
            'Promises, async/await, and fetch API',
            'Destructuring, spread/rest, and arrow functions',
            'DOM events, event delegation, and bubbling',
            'ES Modules (import/export) and modular code structure',
          ],
          resources: [
            {
              title: 'JavaScript.info Modern Tutorial',
              url: 'https://javascript.info',
              type: 'article',
            },
            {
              title: 'MDN Web Docs - JavaScript Guide',
              url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
              type: 'docs',
            },
          ],
          project: {
            title: 'Interactive Kanban Task Board',
            description: 'Build a drag-and-drop task management board with localStorage persistence.',
          },
        },
      ],
    },
    {
      id: 'backend-apis',
      title: 'Backend & Database Architecture',
      description: 'Server runtime environments, RESTful API design, ORMs, and persistent data storage.',
      timeEstimate: '6 weeks',
      color: 'yellow',
      order: 1,
      projectIds: [],
      topics: [
        {
          id: 'nodejs-express-apis',
          title: 'Node.js & Express REST APIs',
          description: 'Build robust REST APIs with authentication, middleware, and request validation.',
          timeEstimate: '3 weeks',
          whatToLearn: [
            'Express routing, middleware pipeline, and error handling',
            'Authentication with JWT and secure cookies',
            'Data validation with Zod',
            'Database integration with PostgreSQL & Prisma',
          ],
          resources: [
            {
              title: 'Node.js Official Documentation',
              url: 'https://nodejs.org/en/docs',
              type: 'docs',
            },
          ],
          project: {
            title: 'E-commerce REST API',
            description: 'Develop a complete e-commerce backend with product catalog, cart, and checkout flow.',
          },
        },
      ],
    },
  ],
};

type Resource = {
  title: string;
  url: string;
  type: ResourceType;
};

type Topic = {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  whatToLearn: string[];
  resources: Resource[];
  project: {
    title: string;
    description: string;
  };
};

type Section = {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  color: StageColor;
  order: number;
  topics: Topic[];
  projectIds: string[];
};

type RoadmapFormState = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: RoadmapCategory;
  difficulty: Difficulty;
  estimatedDuration: string;
  icon: string;
  accent: string;
  targetAudience: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  tags: string[];
  sections: Section[];
};

const INITIAL_FORM: RoadmapFormState = {
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
  sections: [],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeJsonData(parsed: Record<string, unknown>): RoadmapFormState {
  const title = String(parsed.title || parsed.name || '').trim();
  const slug = String(parsed.slug || slugify(title)).trim();
  const shortDescription = String(
    parsed.shortDescription || parsed.short_description || parsed.summary || parsed.tagline || ''
  ).trim();
  const description = String(
    parsed.description || parsed.overview || parsed.longDescription || parsed.content || ''
  ).trim();

  const validCategories = ROADMAP_CATEGORIES.map((c) => c.value);
  const categoryRaw = String(parsed.category || '').toLowerCase().trim();
  const category = (validCategories.includes(categoryRaw as RoadmapCategory)
    ? categoryRaw
    : 'web-development') as RoadmapCategory;

  const validDifficulties = DIFFICULTIES.map((d) => d.value);
  const difficultyRaw = String(parsed.difficulty || parsed.level || '').toLowerCase().trim();
  const difficulty = (validDifficulties.includes(difficultyRaw as Difficulty)
    ? difficultyRaw
    : 'beginner') as Difficulty;

  const estimatedDuration = String(
    parsed.estimatedDuration || parsed.estimated_duration || parsed.duration || parsed.timeEstimate || '3 months'
  ).trim();

  const icon = String(parsed.icon || '🗺️').trim();
  const accentRaw = String(parsed.accent || parsed.color || '#C7FF3D').trim();
  const accent = /^#[0-9A-Fa-f]{6}$/.test(accentRaw) ? accentRaw : '#C7FF3D';

  const toStrArr = (val: unknown): string[] => {
    if (Array.isArray(val)) {
      const filtered = val.map((v) => String(v || '').trim()).filter(Boolean);
      return filtered.length > 0 ? filtered : [''];
    }
    if (typeof val === 'string' && val.trim()) {
      return val.split('\n').map((v) => v.trim()).filter(Boolean);
    }
    return [''];
  };

  const targetAudience = toStrArr(parsed.targetAudience || parsed.target_audience || parsed.audience);
  const learningOutcomes = toStrArr(parsed.learningOutcomes || parsed.learning_outcomes || parsed.outcomes || parsed.goals);
  const prerequisites = toStrArr(parsed.prerequisites || parsed.requirements);
  const tags = toStrArr(parsed.tags || parsed.keywords || parsed.technologies);

  const rawSections =
    (parsed.sections as unknown[]) ||
    (parsed.milestones as unknown[]) ||
    (parsed.phases as unknown[]) ||
    (parsed.stages as unknown[]) ||
    [];

  const validColors: StageColor[] = ['green', 'lime', 'yellow', 'orange', 'red', 'purple'];

  const sections: Section[] = Array.isArray(rawSections)
    ? rawSections.map((secUnknown: unknown, sIdx: number) => {
        const sec = (secUnknown && typeof secUnknown === 'object' ? secUnknown : {}) as Record<string, unknown>;
        const secTitle = String(sec.title || sec.name || `Milestone ${sIdx + 1}`).trim();
        const secId = String(sec.id || slugify(secTitle) || `section-${sIdx + 1}`).trim();
        const secDesc = String(sec.description || sec.summary || '').trim();
        const secTime = String(sec.timeEstimate || sec.estimatedDuration || sec.duration || '2 weeks').trim();
        const secColorRaw = String(sec.color || '').toLowerCase().trim();
        const secColor = (validColors.includes(secColorRaw as StageColor) ? secColorRaw : validColors[sIdx % validColors.length]) as StageColor;

        const rawProjectIds = Array.isArray(sec.projectIds)
          ? sec.projectIds.map((p) => String(p).trim()).filter(Boolean)
          : Array.isArray(sec.projects)
          ? sec.projects.map((p) => (typeof p === 'object' && p !== null && 'id' in p ? String((p as { id: unknown }).id) : String(p)).trim()).filter(Boolean)
          : [];

        const rawTopics = (sec.topics as unknown[]) || (sec.items as unknown[]) || (sec.subtopics as unknown[]) || [];
        const topics: Topic[] = Array.isArray(rawTopics) && rawTopics.length > 0
          ? rawTopics.map((topUnknown: unknown, tIdx: number) => {
              const top = (topUnknown && typeof topUnknown === 'object' ? topUnknown : {}) as Record<string, unknown>;
              const topTitle = String(top.title || top.name || `Topic ${tIdx + 1}`).trim();
              const topId = String(top.id || slugify(topTitle) || `topic-${sIdx + 1}-${tIdx + 1}`).trim();
              const topDesc = String(top.description || top.summary || '').trim();
              const topTime = String(top.timeEstimate || top.duration || '1 week').trim();

              const whatToLearn = toStrArr(top.whatToLearn || top.what_to_learn || top.learningPoints || top.points || top.skills);

              const rawResources = Array.isArray(top.resources) ? top.resources : [];
              const resources: Resource[] = rawResources.map((resUnknown: unknown) => {
                const res = (resUnknown && typeof resUnknown === 'object' ? resUnknown : {}) as Record<string, unknown>;
                const validTypes: ResourceType[] = ['video', 'article', 'course', 'docs'];
                const resTypeRaw = String(res.type || 'article').toLowerCase().trim();
                const resType = (validTypes.includes(resTypeRaw as ResourceType) ? resTypeRaw : 'article') as ResourceType;
                return {
                  title: String(res.title || 'Official Resource').trim(),
                  url: String(res.url || 'https://developer.mozilla.org').trim(),
                  type: resType,
                };
              });

              if (resources.length === 0) {
                resources.push({
                  title: 'Documentation / Tutorial',
                  url: 'https://developer.mozilla.org',
                  type: 'docs',
                });
              }

              const rawProj = (top.project && typeof top.project === 'object' ? top.project : {}) as Record<string, unknown>;
              const project = {
                title: String(rawProj.title || rawProj.name || `${topTitle} Practice Project`).trim(),
                description: String(rawProj.description || rawProj.summary || 'Build a hands-on project to practice and reinforce these concepts.').trim(),
              };

              return {
                id: topId,
                title: topTitle,
                description: topDesc,
                timeEstimate: topTime,
                whatToLearn,
                resources,
                project,
              };
            })
          : [
              {
                id: `topic-${sIdx + 1}-1`,
                title: `${secTitle} Fundamentals`,
                description: `Core concepts and practical application for ${secTitle}.`,
                timeEstimate: '1 week',
                whatToLearn: ['Key concepts and terminology', 'Hands-on guided practice'],
                resources: [
                  {
                    title: 'Recommended Guide',
                    url: 'https://developer.mozilla.org',
                    type: 'docs',
                  },
                ],
                project: {
                  title: `${secTitle} Milestone Project`,
                  description: `Apply the principles learned in ${secTitle} into a working prototype.`,
                },
              },
            ];

        return {
          id: secId,
          title: secTitle,
          description: secDesc,
          timeEstimate: secTime,
          color: secColor,
          order: typeof sec.order === 'number' ? sec.order : sIdx,
          topics,
          projectIds: rawProjectIds,
        };
      })
    : [];

  return {
    slug,
    title,
    shortDescription,
    description,
    category,
    difficulty,
    estimatedDuration,
    icon,
    accent,
    targetAudience,
    learningOutcomes,
    prerequisites,
    tags,
    sections,
  };
}

export function RoadmapForm() {
  const router = useRouter();
  const { user } = useAuth();

  // Mode: 'import' (initial screen) | 'editor' (unified single-page editor)
  const [mode, setMode] = useState<'import' | 'editor'>('import');

  // Form State
  const [form, setForm] = useState<RoadmapFormState>(INITIAL_FORM);

  // JSON Import Screen States
  const [jsonText, setJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Persistence & Draft status
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Submission States
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Database Projects state
  const [allProjects, setAllProjects] = useState<ProjectListItem[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  // Inline project creator states
  const [creatingForSection, setCreatingForSection] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    difficulty: 'beginner',
    technologies: '',
    estimatedDuration: '',
  });
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState('');

  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Check for existing local draft & fetch database projects on mount
  useEffect(() => {
    // Fetch database projects
    projectRepository
      .list()
      .then((projs) => {
        setAllProjects(projs);
        setProjectsLoaded(true);
      })
      .catch(() => {
        setProjectsLoaded(true);
      });

    // Check localStorage
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form && (parsed.form.title || parsed.form.sections?.length > 0)) {
          setHasSavedDraft(true);
          if (parsed.savedAt) {
            setDraftSavedAt(new Date(parsed.savedAt).toLocaleTimeString());
          }
        }
      }
    } catch {
      // ignore JSON error
    }
  }, []);

  // 2. Debounced auto-save to localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only save if there's meaningful content or user is in editor mode
    const hasContent = form.title.trim() || form.sections.length > 0;
    if (!hasContent && mode === 'import') return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const payload = {
          form,
          mode,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        setDraftSavedAt(new Date().toLocaleTimeString());
        setSaveStatus('saved');
      } catch {
        setSaveStatus('idle');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [form, mode]);

  // Handle restoring saved draft
  const handleResumeDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form) {
          setForm(parsed.form);
          setMode('editor');
          if (parsed.savedAt) {
            setDraftSavedAt(new Date(parsed.savedAt).toLocaleTimeString());
          }
          setImportError('');
        }
      }
    } catch {
      setImportError('Failed to parse saved draft from local storage.');
    }
  }, []);

  // Handle clearing draft
  const handleClearDraft = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to discard this draft? All unsaved progress will be permanently lost.')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setForm(INITIAL_FORM);
      setHasSavedDraft(false);
      setDraftSavedAt(null);
      setJsonText('');
      setMode('import');
      setImportError('');
      setFormError('');
    }
  }, []);

  // Handle JSON file upload
  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setImportError('Please provide a valid .json file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setJsonText(content);
        processJson(content);
      } catch {
        setImportError('Failed to read the file.');
      }
    };
    reader.onerror = () => setImportError('Error reading file.');
    reader.readAsText(file);
  };

  // Process and Autofill JSON
  const processJson = (raw: string) => {
    setImportError('');
    if (!raw.trim()) {
      setImportError('Please select a JSON file or paste JSON content.');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('JSON root must be an object.');
      }

      const normalized = normalizeJsonData(parsed);

      if (!normalized.title) {
        normalized.title = 'Imported Roadmap';
        normalized.slug = 'imported-roadmap';
      }

      setForm(normalized);
      setMode('editor');
      setFormSuccess('Roadmap JSON imported successfully! All fields have been autofilled.');
      setTimeout(() => setFormSuccess(''), 5000);
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Invalid JSON format. Please verify syntax.');
    }
  };

  // Copy sample template to clipboard
  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_ROADMAP_TEMPLATE, null, 2));
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // Download sample template file
  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_ROADMAP_TEMPLATE, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-roadmap-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Start with blank form
  const handleStartBlank = () => {
    setForm(INITIAL_FORM);
    setMode('editor');
    setImportError('');
  };

  // Helper update function for form
  const updateForm = (fields: Partial<RoadmapFormState>) => {
    setForm((prev) => ({ ...prev, ...fields }));
    setFormError('');
  };

  // Multi-item field helpers
  const updateArrayItem = (
    field: 'targetAudience' | 'learningOutcomes' | 'prerequisites' | 'tags',
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: 'targetAudience' | 'learningOutcomes' | 'prerequisites' | 'tags') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (
    field: 'targetAudience' | 'learningOutcomes' | 'prerequisites' | 'tags',
    index: number
  ) => {
    setForm((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length > 0 ? arr : [''] };
    });
  };

  // Section helpers
  const addSection = () => {
    const nextOrder = form.sections.length;
    const newSec: Section = {
      id: `milestone-${nextOrder + 1}`,
      title: `Milestone ${nextOrder + 1}`,
      description: '',
      timeEstimate: '2 weeks',
      color: STAGE_COLORS[nextOrder % STAGE_COLORS.length].value,
      order: nextOrder,
      projectIds: [],
      topics: [
        {
          id: `topic-${nextOrder + 1}-1`,
          title: 'Core Fundamentals',
          description: '',
          timeEstimate: '1 week',
          whatToLearn: ['Key principles'],
          resources: [
            {
              title: 'Documentation',
              url: 'https://developer.mozilla.org',
              type: 'docs',
            },
          ],
          project: {
            title: 'Milestone Practical Exercise',
            description: 'Build a project applying this milestone.',
          },
        },
      ],
    };
    setForm((prev) => ({ ...prev, sections: [...prev.sections, newSec] }));
  };

  const updateSection = (sIdx: number, fields: Partial<Section>) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[sIdx] = { ...sections[sIdx], ...fields };
      return { ...prev, sections };
    });
  };

  const removeSection = (sIdx: number) => {
    setForm((prev) => {
      const sections = prev.sections.filter((_, i) => i !== sIdx).map((s, idx) => ({ ...s, order: idx }));
      return { ...prev, sections };
    });
  };

  const moveSection = (sIdx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? sIdx - 1 : sIdx + 1;
    if (targetIdx < 0 || targetIdx >= form.sections.length) return;
    setForm((prev) => {
      const sections = [...prev.sections];
      const temp = sections[sIdx];
      sections[sIdx] = sections[targetIdx];
      sections[targetIdx] = temp;
      return {
        ...prev,
        sections: sections.map((s, idx) => ({ ...s, order: idx })),
      };
    });
  };

  // Project linking in section
  const addProjectToSection = (sIdx: number, projectId: string) => {
    if (!projectId) return;
    setForm((prev) => {
      const sections = [...prev.sections];
      const existing = sections[sIdx].projectIds || [];
      if (!existing.includes(projectId)) {
        sections[sIdx] = { ...sections[sIdx], projectIds: [...existing, projectId] };
      }
      return { ...prev, sections };
    });
  };

  const removeProjectFromSection = (sIdx: number, projectId: string) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[sIdx] = {
        ...sections[sIdx],
        projectIds: (sections[sIdx].projectIds || []).filter((id) => id !== projectId),
      };
      return { ...prev, sections };
    });
  };

  // Quick inline project creator
  const handleCreateProject = async () => {
    if (creatingForSection === null || !user) return;
    if (!newProject.title.trim()) {
      setCreateError('Project title is required');
      return;
    }
    const slug = newProject.slug.trim() || slugify(newProject.title);
    if (!slug) {
      setCreateError('Valid slug is required');
      return;
    }

    setCreateSaving(true);
    setCreateError('');

    try {
      const payload = {
        title: newProject.title.trim(),
        slug,
        shortDescription: newProject.shortDescription.trim() || `${newProject.title} practical project`,
        description: `${newProject.title} project overview and instructions.`,
        category: 'web-development',
        difficulty: newProject.difficulty as Difficulty,
        estimatedDuration: newProject.estimatedDuration.trim() || '1-2 weeks',
        projectType: 'guided',
        experienceLevel: 'all',
        technologies: newProject.technologies
          ? newProject.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : ['TypeScript'],
        skills: [],
        learningOutcomes: [],
        features: [{ title: 'Core Functionality', description: 'Primary project requirements.' }],
        requirements: ['Basic development environment'],
        milestones: [{ title: 'Initial Setup', description: 'Scaffold project repository', order: 0, objectives: [], tasks: [], estimatedDuration: '2 days' }],
        phases: [{ phaseNumber: 1, title: 'Implementation', summary: 'Build core features', estimatedDuration: '1 week', content: '', objectives: [], checkpointTasks: [] }],
        architecture: '',
        folderStructure: '',
        databaseConsiderations: '',
        apiConsiderations: '',
        testingGuidance: '',
        securityConsiderations: '',
        deploymentGuidance: '',
        extensionIdeas: [{ level: 'beginner' as const, ideas: ['Add custom styling'] }],
        tags: [],
        relatedRoadmapIds: [],
        prerequisiteRoadmapIds: [],
        relatedProjectIds: [],
      };

      const id = await projectService.create(payload, user.uid);
      await projectService.publish(id, user.uid);

      const newEntry: ProjectListItem = {
        id,
        slug,
        title: newProject.title.trim(),
        status: 'published',
        category: 'web-development',
        difficulty: newProject.difficulty as Difficulty,
        featured: false,
        technologies: payload.technologies,
        updatedAt: new Date(),
        publishedAt: new Date(),
      };

      setAllProjects((prev) => [newEntry, ...prev]);
      addProjectToSection(creatingForSection, id);
      setCreatingForSection(null);
      setNewProject({
        title: '',
        slug: '',
        shortDescription: '',
        difficulty: 'beginner',
        technologies: '',
        estimatedDuration: '',
      });
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create project');
    } finally {
      setCreateSaving(false);
    }
  };

  // Topic helpers
  const addTopic = (sIdx: number) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      const tLen = sections[sIdx].topics.length;
      const newTopic: Topic = {
        id: `topic-${sIdx + 1}-${tLen + 1}`,
        title: '',
        description: '',
        timeEstimate: '1 week',
        whatToLearn: [''],
        resources: [
          {
            title: 'Documentation',
            url: 'https://developer.mozilla.org',
            type: 'docs',
          },
        ],
        project: {
          title: '',
          description: '',
        },
      };
      sections[sIdx] = { ...sections[sIdx], topics: [...sections[sIdx].topics, newTopic] };
      return { ...prev, sections };
    });
  };

  const updateTopic = (sIdx: number, tIdx: number, fields: Partial<Topic>) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      const topics = [...sections[sIdx].topics];
      topics[tIdx] = { ...topics[tIdx], ...fields };
      sections[sIdx] = { ...sections[sIdx], topics };
      return { ...prev, sections };
    });
  };

  const removeTopic = (sIdx: number, tIdx: number) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      const topics = sections[sIdx].topics.filter((_, i) => i !== tIdx);
      sections[sIdx] = { ...sections[sIdx], topics };
      return { ...prev, sections };
    });
  };

  // Save / Publish
  const handleSubmit = async (publishImmediately: boolean) => {
    if (!user) {
      setFormError('You must be logged in as an administrator to save.');
      return;
    }

    setFormError('');

    // Validations
    if (!form.title.trim()) {
      setFormError('Roadmap title is required.');
      return;
    }
    const finalSlug = form.slug.trim() || slugify(form.title);
    if (!/^[a-z0-9-]+$/.test(finalSlug)) {
      setFormError('Slug must contain only lowercase letters, numbers, and hyphens.');
      return;
    }
    if (!form.shortDescription.trim() || form.shortDescription.length < 10) {
      setFormError('Short description must be at least 10 characters.');
      return;
    }
    if (!form.description.trim() || form.description.length < 10) {
      setFormError('Full description must be at least 10 characters.');
      return;
    }
    if (form.sections.length === 0) {
      setFormError('Roadmap must have at least one milestone or section.');
      return;
    }

    for (let i = 0; i < form.sections.length; i++) {
      const s = form.sections[i];
      if (!s.title.trim()) {
        setFormError(`Section ${i + 1} requires a title.`);
        return;
      }
      if (!s.description.trim()) {
        setFormError(`Section ${i + 1} (${s.title}) requires a description.`);
        return;
      }
      if (s.topics.length === 0) {
        setFormError(`Section ${i + 1} (${s.title}) requires at least one topic.`);
        return;
      }
      for (let j = 0; j < s.topics.length; j++) {
        const t = s.topics[j];
        if (!t.title.trim()) {
          setFormError(`Section ${i + 1}, Topic ${j + 1} requires a title.`);
          return;
        }
        if (!t.description.trim()) {
          setFormError(`Section ${i + 1}, Topic "${t.title}" requires a description.`);
          return;
        }
        const validLearn = t.whatToLearn.filter((w) => w.trim());
        if (validLearn.length === 0) {
          setFormError(`Topic "${t.title}" requires at least one learning outcome point.`);
          return;
        }
        if (t.resources.length === 0 || !t.resources[0].url.trim()) {
          setFormError(`Topic "${t.title}" requires at least one resource with a valid URL.`);
          return;
        }
        if (!t.project.title.trim() || !t.project.description.trim()) {
          setFormError(`Topic "${t.title}" requires a mini-project title and description.`);
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const cleanSections = form.sections.map((s, sIdx) => ({
        id: s.id || `sec-${sIdx + 1}`,
        title: s.title.trim(),
        description: s.description.trim(),
        timeEstimate: s.timeEstimate.trim() || '2 weeks',
        color: s.color,
        order: sIdx,
        projectIds: s.projectIds || [],
        topics: s.topics.map((t, tIdx) => ({
          id: t.id || `topic-${sIdx + 1}-${tIdx + 1}`,
          title: t.title.trim(),
          description: t.description.trim(),
          timeEstimate: t.timeEstimate.trim() || '1 week',
          whatToLearn: t.whatToLearn.filter((w) => w.trim()),
          resources: t.resources.map((r) => ({
            title: r.title.trim() || 'Resource',
            url: r.url.trim(),
            type: r.type || 'docs',
          })),
          project: {
            title: t.project.title.trim(),
            description: t.project.description.trim(),
          },
        })),
      }));

      const payload = {
        slug: finalSlug,
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        category: form.category,
        difficulty: form.difficulty,
        estimatedDuration: form.estimatedDuration.trim() || '3 months',
        icon: form.icon.trim() || '🗺️',
        accent: form.accent.trim() || '#C7FF3D',
        targetAudience: form.targetAudience.filter((a) => a.trim()),
        learningOutcomes: form.learningOutcomes.filter((o) => o.trim()),
        prerequisites: form.prerequisites.filter((p) => p.trim()),
        tags: form.tags.filter((t) => t.trim()),
        sections: cleanSections,
        variants: [],
        relationships: [],
        seo: {
          title: form.title.trim(),
          description: form.shortDescription.trim(),
        },
      };

      const newId = await roadmapService.create(payload, user.uid);

      if (publishImmediately) {
        await roadmapService.publish(newId, user.uid);
      }

      // Clear draft upon successful creation
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      router.push('/admin/roadmaps');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save roadmap.');
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // RENDER: SCREEN 1 - DRAG & DROP / IMPORT JSON SCREEN
  // =========================================================================
  if (mode === 'import') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-soft)]">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/roadmaps"
              className="p-2 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
              title="Back to Roadmaps"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Create Roadmap</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Import JSON data or drag & drop to autofill every field across the roadmap curriculum.
              </p>
            </div>
          </div>
          <button
            onClick={handleStartBlank}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-4 transition-colors"
          >
            Or start with blank form &rarr;
          </button>
        </div>

        {/* Unsaved draft resume banner */}
        {hasSavedDraft && (
          <div className="rounded-sm border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Unsaved Roadmap Draft Found
                </p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                  You have an in-progress draft {draftSavedAt ? `last auto-saved at ${draftSavedAt}` : 'in local storage'}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleResumeDraft}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" /> Resume Draft
              </button>
              <button
                onClick={handleClearDraft}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
              >
                Discard Draft
              </button>
            </div>
          </div>
        )}

        {/* Error notice */}
        {importError && (
          <div className="rounded-sm border border-rose-500/30 bg-rose-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-700 dark:text-rose-300">
              <span className="font-semibold">Import Error: </span>
              {importError}
            </div>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`rounded-sm border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)]/5 scale-[0.99]'
              : 'border-[var(--border-default)] hover:border-[var(--accent-dark)] bg-[var(--bg-surface)]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--accent-dark)] mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Drag and drop your Roadmap JSON file here, or{' '}
            <span className="text-[var(--accent-dark)] underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-[var(--text-subtle)] mt-1">
            Accepts valid JSON file containing roadmap metadata, milestones, topics, and learning resources.
          </p>
        </div>

        {/* Or Paste JSON Direct */}
        <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-[var(--accent-dark)]" />
              <h2 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                Or Paste Raw JSON Below
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-medium border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
              >
                {copiedTemplate ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedTemplate ? 'Copied!' : 'Copy Template'}
              </button>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-medium border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
              >
                <Download className="w-3 h-3" /> Download Template
              </button>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Paste JSON here... e.g. { "title": "...", "sections": [...] }'
            rows={8}
            className="input-field font-mono text-xs resize-y"
          />

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-[var(--text-subtle)]">
              Flexible parsing: Accepts `sections`, `milestones`, or `phases` keys with automatic normalization.
            </p>
            <button
              onClick={() => processJson(jsonText)}
              disabled={!jsonText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-40 transition-opacity shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Autofill & Continue to Roadmap Editor
            </button>
          </div>
        </div>

        {/* Schema Information / Helper card */}
        <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/50 p-4 text-xs text-[var(--text-secondary)] space-y-2">
          <div className="flex items-center gap-2 font-medium text-[var(--text-primary)]">
            <Layers className="w-4 h-4 text-[var(--accent-dark)]" />
            <span>How the JSON autofill works</span>
          </div>
          <p className="leading-relaxed">
            1. All roadmap metadata (title, slug, difficulty, category, duration, tags, prerequisites) is auto-populated.
          </p>
          <p className="leading-relaxed">
            2. Every milestone/section and nested topic, what to learn bullets, resources, and mini-projects are generated.
          </p>
          <p className="leading-relaxed">
            3. You will immediately land on the <strong>single-page editor</strong> where you can review, edit, or select project associations fetched from your database.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: SCREEN 2 - UNIFIED SINGLE-PAGE EDITOR (NO STEP-BY-STEP NAV)
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Sticky Header Top Bar */}
      <div className="sticky top-0 z-20 bg-[var(--bg-surface)]/95 backdrop-blur-sm border-b border-[var(--border-soft)] -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/roadmaps"
              className="p-1.5 rounded-sm hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
              title="Back to Roadmaps List"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[var(--text-primary)] truncate max-w-sm sm:max-w-md">
                  {form.title ? form.title : 'New Learning Roadmap'}
                </h1>
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Single-Page Editor
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-subtle)]">
                {saveStatus === 'saving' && (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving draft...
                  </span>
                )}
                {saveStatus === 'saved' && draftSavedAt && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Auto-saved at {draftSavedAt}
                  </span>
                )}
                {saveStatus === 'idle' && draftSavedAt && (
                  <span>Draft saved at {draftSavedAt}</span>
                )}
                <span>&bull;</span>
                <span>{form.sections.length} Milestones</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setMode('import')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] transition-colors"
              title="Re-import or load another JSON file"
            >
              <Upload className="w-3.5 h-3.5" /> Re-import JSON
            </button>
            <button
              type="button"
              onClick={handleClearDraft}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-medium border border-[var(--border-soft)] hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-[var(--text-subtle)] transition-colors"
              title="Clear draft and start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] disabled:opacity-50 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Publish Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {formError && (
        <div className="rounded-sm border border-rose-500/30 bg-rose-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-700 dark:text-rose-300">
            <span className="font-semibold">Validation Error: </span>
            {formError}
          </div>
        </div>
      )}

      {formSuccess && (
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{formSuccess}</p>
        </div>
      )}

      {/* CARD 1: Core Details */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-soft)]">
          <FileText className="w-4 h-4 text-[var(--accent-dark)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">1. Core Roadmap Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-medium text-[var(--text-primary)]">Title *</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                const val = e.target.value;
                updateForm({
                  title: val,
                  slug: form.slug ? form.slug : slugify(val),
                });
              }}
              placeholder="e.g. Full-Stack Web Development"
              className="input-field mt-1"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-[var(--text-primary)]">Slug *</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateForm({ slug: slugify(e.target.value) })}
              placeholder="e.g. full-stack-web-development"
              className="input-field mt-1 font-mono text-xs"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[var(--text-primary)]">Category</span>
            <Select
              value={form.category}
              onValueChange={(val) => updateForm({ category: val as RoadmapCategory })}
            >
              <SelectTrigger className="mt-1 h-9">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {ROADMAP_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-[var(--text-primary)]">Difficulty</span>
            <Select
              value={form.difficulty}
              onValueChange={(val) => updateForm({ difficulty: val as Difficulty })}
            >
              <SelectTrigger className="mt-1 h-9">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-[var(--text-primary)]">Duration</span>
            <input
              type="text"
              value={form.estimatedDuration}
              onChange={(e) => updateForm({ estimatedDuration: e.target.value })}
              placeholder="e.g. 6 months"
              className="input-field mt-1"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs font-medium text-[var(--text-primary)]">Icon</span>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => updateForm({ icon: e.target.value })}
                className="input-field mt-1 text-center"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-[var(--text-primary)]">Accent</span>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => updateForm({ accent: e.target.value })}
                  className="w-8 h-9 rounded-sm border border-[var(--border-default)] cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={form.accent}
                  onChange={(e) => updateForm({ accent: e.target.value })}
                  className="input-field text-xs font-mono px-1.5"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* CARD 2: Descriptions & Overview */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-soft)]">
          <FileText className="w-4 h-4 text-[var(--accent-dark)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">2. Descriptions & Overview</h2>
        </div>

        <label className="block">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-primary)]">Short Summary *</span>
            <span className="text-[11px] text-[var(--text-subtle)]">
              {form.shortDescription.length} / 200 characters (min 10)
            </span>
          </div>
          <textarea
            value={form.shortDescription}
            onChange={(e) => updateForm({ shortDescription: e.target.value })}
            placeholder="A concise summary of the roadmap for search cards and metadata..."
            rows={2}
            className="input-field mt-1 resize-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-[var(--text-primary)]">
            Full Markdown Overview / Curriculum Description *
          </span>
          <textarea
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="# Curriculum Overview&#10;&#10;Explain what the student will learn throughout this roadmap..."
            rows={6}
            className="input-field mt-1 font-mono text-xs resize-y"
          />
        </label>
      </div>

      {/* CARD 3: Audience, Outcomes & Taxonomy */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-soft)]">
          <Sparkles className="w-4 h-4 text-[var(--accent-dark)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            3. Audience, Learning Outcomes, Prerequisites & Tags
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Audience */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-primary)]">Target Audience</span>
              <button
                type="button"
                onClick={() => addArrayItem('targetAudience')}
                className="text-xs text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            {form.targetAudience.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('targetAudience', idx, e.target.value)}
                  placeholder="e.g. Aspiring web developers"
                  className="input-field text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('targetAudience', idx)}
                  className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-primary)]">Learning Outcomes</span>
              <button
                type="button"
                onClick={() => addArrayItem('learningOutcomes')}
                className="text-xs text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            {form.learningOutcomes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('learningOutcomes', idx, e.target.value)}
                  placeholder="e.g. Build production-ready full-stack apps"
                  className="input-field text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('learningOutcomes', idx)}
                  className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-primary)]">Prerequisites</span>
              <button
                type="button"
                onClick={() => addArrayItem('prerequisites')}
                className="text-xs text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            {form.prerequisites.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('prerequisites', idx, e.target.value)}
                  placeholder="e.g. Basic programming logic"
                  className="input-field text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('prerequisites', idx)}
                  className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-primary)]">Tags / Technologies</span>
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="text-xs text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            {form.tags.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem('tags', idx, e.target.value)}
                  placeholder="e.g. react, nodejs, postgresql"
                  className="input-field text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', idx)}
                  className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARD 4: Curriculum Milestones / Sections */}
      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-soft)]">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent-dark)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                4. Curriculum Milestones & Sections ({form.sections.length})
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Each milestone represents a major stage of learning. You can associate projects from your database or leave them blank to link later.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>

        {form.sections.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[var(--border-default)] rounded-sm">
            <p className="text-xs text-[var(--text-secondary)]">No milestones added yet.</p>
            <button
              type="button"
              onClick={addSection}
              className="mt-2 text-xs font-medium text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Click here to create first milestone
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {form.sections.map((section, sIdx) => (
              <div
                key={section.id || sIdx}
                className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/30 p-5 space-y-4"
              >
                {/* Milestone Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-soft)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold uppercase bg-[var(--accent-dark)] text-[var(--text-inverse)]">
                      Milestone {sIdx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {section.title || `Milestone ${sIdx + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(sIdx, 'up')}
                      disabled={sIdx === 0}
                      className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(sIdx, 'down')}
                      disabled={sIdx === form.sections.length - 1}
                      className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(sIdx)}
                      className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-rose-600 transition-colors"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Milestone Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <span className="text-xs font-medium text-[var(--text-primary)]">Milestone Title *</span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sIdx, { title: e.target.value })}
                      placeholder="e.g. Frontend Foundations"
                      className="input-field mt-1 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-[var(--text-primary)]">Color Theme</span>
                    <Select
                      value={section.color}
                      onValueChange={(val) => updateSection(sIdx, { color: val as StageColor })}
                    >
                      <SelectTrigger className="mt-1 h-9 text-xs">
                        <SelectValue placeholder="Select Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGE_COLORS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: c.value }}
                              />
                              <span>{c.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-[var(--text-primary)]">Time Estimate</span>
                    <input
                      type="text"
                      value={section.timeEstimate}
                      onChange={(e) => updateSection(sIdx, { timeEstimate: e.target.value })}
                      placeholder="e.g. 3 weeks"
                      className="input-field mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-[var(--text-primary)]">Milestone Description *</span>
                  <textarea
                    value={section.description}
                    onChange={(e) => updateSection(sIdx, { description: e.target.value })}
                    placeholder="Describe what this milestone covers and its learning objectives..."
                    rows={2}
                    className="input-field mt-1 text-xs resize-none"
                  />
                </div>

                {/* Database Projects Association (Optional as requested) */}
                <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        Linked Projects (Optional)
                      </span>
                      <span className="text-[10px] text-[var(--text-subtle)]">
                        {section.projectIds.length} linked
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCreatingForSection(sIdx);
                        setNewProject({
                          title: '',
                          slug: '',
                          shortDescription: '',
                          difficulty: 'beginner',
                          technologies: '',
                          estimatedDuration: '',
                        });
                        setCreateError('');
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-soft)] transition-colors"
                    >
                      <PlusCircle className="w-3 h-3 text-[var(--accent-dark)]" /> Quick Create Project
                    </button>
                  </div>

                  {/* Linked Project Badges */}
                  {section.projectIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {section.projectIds.map((pid) => {
                        const proj = allProjects.find((p) => p.id === pid);
                        return (
                          <span
                            key={pid}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                          >
                            <span>{proj ? proj.title : pid}</span>
                            {proj && (
                              <span className="text-[10px] text-[var(--text-subtle)] uppercase">
                                ({proj.difficulty})
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeProjectFromSection(sIdx, pid)}
                              className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors"
                              title="Unlink project"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Dropdown fetched from database */}
                  {projectsLoaded && allProjects.length > 0 ? (
                    <div className="space-y-1">
                      <Select
                        value=""
                        onValueChange={(val) => {
                          if (val) {
                            addProjectToSection(sIdx, val);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="+ Link a project from database..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allProjects
                            .filter((p) => !section.projectIds.includes(p.id))
                            .map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className="flex items-center justify-between gap-3 w-full">
                                  <span className="font-medium text-[var(--text-primary)]">{p.title}</span>
                                  <span className="text-[10px] text-[var(--text-subtle)] uppercase">
                                    {p.difficulty} &bull; {p.category}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-[var(--text-subtle)] mt-1">
                        Select an existing project from the database to link to this milestone. You can also leave this blank and link projects later when editing.
                      </p>
                    </div>
                  ) : projectsLoaded ? (
                    <p className="text-xs text-[var(--text-subtle)] italic">
                      No published projects found in database. Linking projects is completely optional &mdash; you can leave this blank and link projects later by editing this roadmap after creating projects.
                    </p>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading projects from database...
                    </div>
                  )}

                  {/* Inline quick create project drawer */}
                  {creatingForSection === sIdx && (
                    <div className="mt-3 p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          Quick Create Project
                        </span>
                        <button
                          type="button"
                          onClick={() => setCreatingForSection(null)}
                          className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {createError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                          {createError}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => {
                            const t = e.target.value;
                            setNewProject((p) => ({
                              ...p,
                              title: t,
                              slug: p.slug ? p.slug : slugify(t),
                            }));
                          }}
                          placeholder="Project title *"
                          className="input-field text-xs"
                        />
                        <input
                          type="text"
                          value={newProject.slug}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, slug: slugify(e.target.value) }))
                          }
                          placeholder="slug *"
                          className="input-field text-xs font-mono"
                        />
                      </div>

                      <textarea
                        value={newProject.shortDescription}
                        onChange={(e) =>
                          setNewProject((p) => ({ ...p, shortDescription: e.target.value }))
                        }
                        placeholder="Short summary of the project..."
                        rows={2}
                        className="input-field text-xs resize-none"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <Select
                            value={newProject.difficulty}
                            onValueChange={(val) =>
                              setNewProject((p) => ({ ...p, difficulty: val }))
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {DIFFICULTIES.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <input
                          type="text"
                          value={newProject.technologies}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, technologies: e.target.value }))
                          }
                          placeholder="Tech (comma-sep)"
                          className="input-field text-xs"
                        />
                        <input
                          type="text"
                          value={newProject.estimatedDuration}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, estimatedDuration: e.target.value }))
                          }
                          placeholder="e.g. 1-2 weeks"
                          className="input-field text-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateProject}
                        disabled={createSaving}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {createSaving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        {createSaving ? 'Creating Project...' : 'Create & Link'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Topics in Milestone */}
                <div className="pl-3 sm:pl-4 border-l-2 border-[var(--border-soft)] space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                      Topics in this Milestone ({section.topics.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => addTopic(sIdx)}
                      className="text-xs text-[var(--accent-dark)] hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Topic
                    </button>
                  </div>

                  {section.topics.map((topic, tIdx) => (
                    <div
                      key={topic.id || tIdx}
                      className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3.5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[var(--text-subtle)] uppercase">
                          Topic {tIdx + 1}: {topic.title || 'Untitled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTopic(sIdx, tIdx)}
                          className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1"
                          title="Remove Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) => updateTopic(sIdx, tIdx, { title: e.target.value })}
                          placeholder="Topic title *"
                          className="input-field text-xs sm:col-span-2"
                        />
                        <input
                          type="text"
                          value={topic.timeEstimate}
                          onChange={(e) => updateTopic(sIdx, tIdx, { timeEstimate: e.target.value })}
                          placeholder="Time (e.g. 1 week)"
                          className="input-field text-xs"
                        />
                      </div>

                      <textarea
                        value={topic.description}
                        onChange={(e) => updateTopic(sIdx, tIdx, { description: e.target.value })}
                        placeholder="Topic description and scope *"
                        rows={2}
                        className="input-field text-xs resize-none"
                      />

                      {/* What to learn */}
                      <div>
                        <span className="text-[11px] font-medium text-[var(--text-subtle)]">
                          What to learn (one point per line):
                        </span>
                        <textarea
                          value={topic.whatToLearn.join('\n')}
                          onChange={(e) =>
                            updateTopic(sIdx, tIdx, {
                              whatToLearn: e.target.value.split('\n'),
                            })
                          }
                          placeholder="Promises and async/await&#10;ES Modules&#10;DOM Event Delegation"
                          rows={3}
                          className="input-field text-xs font-mono resize-y mt-1"
                        />
                      </div>

                      {/* Mini Project */}
                      <div className="rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]/50 p-2.5 space-y-2">
                        <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                          Topic Practice Mini-Project
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={topic.project.title}
                            onChange={(e) =>
                              updateTopic(sIdx, tIdx, {
                                project: { ...topic.project, title: e.target.value },
                              })
                            }
                            placeholder="Mini-project title *"
                            className="input-field text-xs"
                          />
                          <input
                            type="text"
                            value={topic.project.description}
                            onChange={(e) =>
                              updateTopic(sIdx, tIdx, {
                                project: { ...topic.project, description: e.target.value },
                              })
                            }
                            placeholder="Mini-project description *"
                            className="input-field text-xs"
                          />
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                            Resources ({topic.resources.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newRes: Resource = {
                                title: 'Documentation',
                                url: 'https://developer.mozilla.org',
                                type: 'docs',
                              };
                              updateTopic(sIdx, tIdx, {
                                resources: [...topic.resources, newRes],
                              });
                            }}
                            className="text-[11px] text-[var(--accent-dark)] hover:underline inline-flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Add resource
                          </button>
                        </div>

                        {topic.resources.map((res, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
                            <input
                              type="text"
                              value={res.title}
                              onChange={(e) => {
                                const resources = [...topic.resources];
                                resources[rIdx] = { ...resources[rIdx], title: e.target.value };
                                updateTopic(sIdx, tIdx, { resources });
                              }}
                              placeholder="Resource title"
                              className="input-field text-xs sm:col-span-5"
                            />
                            <input
                              type="text"
                              value={res.url}
                              onChange={(e) => {
                                const resources = [...topic.resources];
                                resources[rIdx] = { ...resources[rIdx], url: e.target.value };
                                updateTopic(sIdx, tIdx, { resources });
                              }}
                              placeholder="https://..."
                              className="input-field text-xs sm:col-span-4 font-mono"
                            />
                            <div className="sm:col-span-2">
                              <Select
                                value={res.type}
                                onValueChange={(val) => {
                                  const resources = [...topic.resources];
                                  resources[rIdx] = {
                                    ...resources[rIdx],
                                    type: val as ResourceType,
                                  };
                                  updateTopic(sIdx, tIdx, { resources });
                                }}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="article">Article</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="course">Course</SelectItem>
                                  <SelectItem value="docs">Docs</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const resources = topic.resources.filter((_, i) => i !== rIdx);
                                updateTopic(sIdx, tIdx, {
                                  resources: resources.length > 0 ? resources : [
                                    { title: 'Docs', url: 'https://developer.mozilla.org', type: 'docs' },
                                  ],
                                });
                              }}
                              className="text-[var(--text-subtle)] hover:text-rose-600 transition-colors p-1 sm:col-span-1 text-center"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-[var(--bg-surface)]/95 backdrop-blur-sm border-t border-[var(--border-soft)] py-3 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)]">
            <Layers className="w-4 h-4 text-[var(--accent-dark)]" />
            <span className="hidden sm:inline">
              Single-page Roadmap Creator &bull; {form.sections.length} Milestones
            </span>
            {draftSavedAt && (
              <span className="text-emerald-600 dark:text-emerald-400">
                (Draft auto-saved {draftSavedAt})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] disabled:opacity-50 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-sm text-xs font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Publish Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
