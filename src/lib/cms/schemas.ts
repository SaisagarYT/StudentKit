import { z } from 'zod';

// --- Shared ---

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});

// --- Roadmap Schemas ---

const resourceSchema = z.object({
  title: z.string().min(1, 'Resource title required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['video', 'article', 'course', 'docs']),
});

const topicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Topic title required'),
  description: z.string().min(1, 'Topic description required'),
  timeEstimate: z.string().min(1, 'Time estimate required'),
  whatToLearn: z.array(z.string().min(1)).min(1, 'At least one learning point'),
  resources: z.array(resourceSchema).min(1, 'At least one resource'),
  project: z.object({
    title: z.string().min(1, 'Project title required'),
    description: z.string().min(1, 'Project description required'),
  }),
  variant: z.string().optional(),
});

const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Section title required'),
  description: z.string().min(1, 'Section description required'),
  timeEstimate: z.string().min(1, 'Time estimate required'),
  color: z.enum(['green', 'lime', 'yellow', 'orange', 'red', 'purple']),
  order: z.number().int().min(0),
  topics: z.array(topicSchema).min(1, 'At least one topic'),
  projectIds: z.array(z.string()).default([]),
});

const variantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const relationshipSchema = z.object({
  targetId: z.string().min(1),
  type: z.enum(['prerequisite', 'related', 'next_step', 'part_of', 'specialization']),
  description: z.string().min(1),
});

export const createRoadmapSchema = z.object({
  slug: z.string().min(3).max(60).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  title: z.string().min(3).max(100),
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(10),
  category: z.enum(['web-development', 'mobile-development', 'data-science', 'devops', 'cybersecurity', 'computer-science', 'career']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  estimatedDuration: z.string().min(1),
  icon: z.string().min(1),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be hex color'),
  targetAudience: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  variants: z.array(variantSchema).default([]),
  relationships: z.array(relationshipSchema).default([]),
  sections: z.array(sectionSchema).min(1, 'At least one section'),
  seo: seoSchema.default({}),
});

export const updateRoadmapSchema = createRoadmapSchema.partial().extend({
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// --- Project Schemas ---

const milestoneSchema = z.object({
  title: z.string().min(1, 'Milestone title required'),
  description: z.string().min(1),
  order: z.number().int().min(0),
  objectives: z.array(z.string()).default([]),
  tasks: z.array(z.string()).default([]),
  estimatedDuration: z.string().default(''),
});

const featureSchema = z.object({
  title: z.string().min(1, 'Feature title required'),
  description: z.string().min(1),
});

const extensionIdeaSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  ideas: z.array(z.string().min(1)).min(1),
});

export const createProjectSchema = z.object({
  slug: z.string().min(3).max(60).regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'),
  title: z.string().min(3).max(100),
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(10),
  category: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  estimatedDuration: z.string().min(1),
  projectType: z.string().min(1),
  experienceLevel: z.string().min(1),
  technologies: z.array(z.string()).min(1, 'At least one technology'),
  skills: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  features: z.array(featureSchema).default([]),
  requirements: z.array(z.string()).default([]),
  milestones: z.array(milestoneSchema).default([]),
  architecture: z.string().default(''),
  folderStructure: z.string().default(''),
  databaseConsiderations: z.string().default(''),
  apiConsiderations: z.string().default(''),
  testingGuidance: z.string().default(''),
  securityConsiderations: z.string().default(''),
  deploymentGuidance: z.string().default(''),
  extensionIdeas: z.array(extensionIdeaSchema).default([]),
  tags: z.array(z.string()).default([]),
  seo: seoSchema.default({}),
  relatedRoadmapIds: z.array(z.string()).default([]),
  prerequisiteRoadmapIds: z.array(z.string()).default([]),
  relatedProjectIds: z.array(z.string()).default([]),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// --- Constants ---

export const ROADMAP_CATEGORIES = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science & AI' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'career', label: 'Career & Preparation' },
] as const;

export const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
] as const;

export const STAGE_COLORS = [
  { value: 'green', label: 'Green' },
  { value: 'lime', label: 'Lime' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
] as const;

export const RELATIONSHIP_TYPES = [
  { value: 'prerequisite', label: 'Prerequisite' },
  { value: 'related', label: 'Related' },
  { value: 'next_step', label: 'Next Step' },
  { value: 'part_of', label: 'Part Of' },
  { value: 'specialization', label: 'Specialization' },
] as const;

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type UpdateRoadmapInput = z.infer<typeof updateRoadmapSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
