import { roadmapRepository, projectRepository } from './repository';
import { createRoadmapSchema, updateRoadmapSchema, createProjectSchema, updateProjectSchema } from './schemas';
import type { CmsRoadmap, CmsProject, RoadmapListItem, ProjectListItem, ContentStatus } from './types';

export class CmsError extends Error {
  constructor(message: string, public code: 'VALIDATION' | 'NOT_FOUND' | 'DUPLICATE_SLUG' | 'INVALID_STATE' | 'SELF_REFERENCE' | 'BROKEN_REFERENCE') {
    super(message);
    this.name = 'CmsError';
  }
}

// --- Roadmap Service ---

export const roadmapService = {
  async list(filters?: { status?: ContentStatus }): Promise<RoadmapListItem[]> {
    return roadmapRepository.list(filters);
  },

  async getById(id: string): Promise<CmsRoadmap> {
    const roadmap = await roadmapRepository.getById(id);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');
    return roadmap;
  },

  async getBySlug(slug: string): Promise<CmsRoadmap> {
    const roadmap = await roadmapRepository.getBySlug(slug);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');
    return roadmap;
  },

  async create(input: unknown, userId: string): Promise<string> {
    const result = createRoadmapSchema.safeParse(input);
    if (!result.success) {
      throw new CmsError(result.error.issues.map((i) => i.message).join('; '), 'VALIDATION');
    }
    const existing = await roadmapRepository.getBySlug(result.data.slug);
    if (existing) throw new CmsError(`Slug "${result.data.slug}" already exists`, 'DUPLICATE_SLUG');
    return roadmapRepository.create(result.data, userId);
  },

  async update(id: string, input: unknown, userId: string): Promise<void> {
    const roadmap = await roadmapRepository.getById(id);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');

    const result = updateRoadmapSchema.safeParse(input);
    if (!result.success) {
      throw new CmsError(result.error.issues.map((i) => i.message).join('; '), 'VALIDATION');
    }

    if (result.data.slug && result.data.slug !== roadmap.slug) {
      const existing = await roadmapRepository.getBySlug(result.data.slug);
      if (existing) throw new CmsError(`Slug "${result.data.slug}" already exists`, 'DUPLICATE_SLUG');
    }

    // Validate no self-references in relationships
    if (result.data.relationships) {
      const selfRef = result.data.relationships.find((r) => r.targetId === id);
      if (selfRef) throw new CmsError('Roadmap cannot reference itself', 'SELF_REFERENCE');
    }

    await roadmapRepository.update(id, result.data, userId);
  },

  async publish(id: string, userId: string): Promise<void> {
    const roadmap = await roadmapRepository.getById(id);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');
    if (roadmap.status === 'published') throw new CmsError('Already published', 'INVALID_STATE');
    if (roadmap.sections.length === 0) throw new CmsError('Cannot publish with no sections', 'VALIDATION');
    await roadmapRepository.publish(id, userId);
  },

  async unpublish(id: string, userId: string): Promise<void> {
    const roadmap = await roadmapRepository.getById(id);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');
    if (roadmap.status !== 'published') throw new CmsError('Not published', 'INVALID_STATE');
    await roadmapRepository.unpublish(id, userId);
  },

  async archive(id: string, userId: string): Promise<void> {
    const roadmap = await roadmapRepository.getById(id);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');
    if (roadmap.status === 'archived') throw new CmsError('Already archived', 'INVALID_STATE');
    await roadmapRepository.archive(id, userId);
  },

  async remove(id: string): Promise<void> {
    const roadmap = await roadmapRepository.getById(id);
    if (!roadmap) throw new CmsError('Roadmap not found', 'NOT_FOUND');
    if (roadmap.status === 'published') throw new CmsError('Cannot delete published roadmap', 'INVALID_STATE');
    await roadmapRepository.remove(id);
  },
};

// --- Project Service ---

export const projectService = {
  async list(filters?: { status?: ContentStatus }): Promise<ProjectListItem[]> {
    return projectRepository.list(filters);
  },

  async getById(id: string): Promise<CmsProject> {
    const project = await projectRepository.getById(id);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');
    return project;
  },

  async getBySlug(slug: string): Promise<CmsProject> {
    const project = await projectRepository.getBySlug(slug);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');
    return project;
  },

  async create(input: unknown, userId: string): Promise<string> {
    const result = createProjectSchema.safeParse(input);
    if (!result.success) {
      throw new CmsError(result.error.issues.map((i) => i.message).join('; '), 'VALIDATION');
    }
    const existing = await projectRepository.getBySlug(result.data.slug);
    if (existing) throw new CmsError(`Slug "${result.data.slug}" already exists`, 'DUPLICATE_SLUG');

    // Validate no self-references
    if (result.data.relatedProjectIds?.includes('')) {
      throw new CmsError('Invalid project reference', 'BROKEN_REFERENCE');
    }

    return projectRepository.create(result.data, userId);
  },

  async update(id: string, input: unknown, userId: string): Promise<void> {
    const project = await projectRepository.getById(id);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');

    const result = updateProjectSchema.safeParse(input);
    if (!result.success) {
      throw new CmsError(result.error.issues.map((i) => i.message).join('; '), 'VALIDATION');
    }

    if (result.data.slug && result.data.slug !== project.slug) {
      const existing = await projectRepository.getBySlug(result.data.slug);
      if (existing) throw new CmsError(`Slug "${result.data.slug}" already exists`, 'DUPLICATE_SLUG');
    }

    // Validate no self-references
    if (result.data.relatedProjectIds?.includes(id)) {
      throw new CmsError('Project cannot reference itself', 'SELF_REFERENCE');
    }

    await projectRepository.update(id, result.data, userId);
  },

  async publish(id: string, userId: string): Promise<void> {
    const project = await projectRepository.getById(id);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');
    if (project.status === 'published') throw new CmsError('Already published', 'INVALID_STATE');
    await projectRepository.publish(id, userId);
  },

  async unpublish(id: string, userId: string): Promise<void> {
    const project = await projectRepository.getById(id);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');
    if (project.status !== 'published') throw new CmsError('Not published', 'INVALID_STATE');
    await projectRepository.unpublish(id, userId);
  },

  async archive(id: string, userId: string): Promise<void> {
    const project = await projectRepository.getById(id);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');
    if (project.status === 'archived') throw new CmsError('Already archived', 'INVALID_STATE');
    await projectRepository.archive(id, userId);
  },

  async remove(id: string): Promise<void> {
    const project = await projectRepository.getById(id);
    if (!project) throw new CmsError('Project not found', 'NOT_FOUND');
    if (project.status === 'published') throw new CmsError('Cannot delete published project', 'INVALID_STATE');
    await projectRepository.remove(id);
  },
};
