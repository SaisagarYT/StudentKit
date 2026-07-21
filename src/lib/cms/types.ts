export type ContentStatus = 'draft' | 'published' | 'archived';

export type RoadmapCategory =
  | 'web-development'
  | 'mobile-development'
  | 'data-science'
  | 'devops'
  | 'cybersecurity'
  | 'computer-science'
  | 'career';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type RelationshipType =
  | 'prerequisite'
  | 'related'
  | 'next_step'
  | 'part_of'
  | 'specialization';

export type StageColor = 'green' | 'lime' | 'yellow' | 'orange' | 'red' | 'purple';

export type ResourceType = 'video' | 'article' | 'course' | 'docs';

// --- Roadmap Types ---

export interface RoadmapResource {
  title: string;
  url: string;
  type: ResourceType;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  whatToLearn: string[];
  resources: RoadmapResource[];
  project: { title: string; description: string };
  variant?: string;
}

export interface RoadmapSection {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  color: StageColor;
  order: number;
  topics: RoadmapTopic[];
  projectIds: string[];
}

export interface RoadmapVariant {
  id: string;
  label: string;
}

export interface RoadmapRelationship {
  targetId: string;
  type: RelationshipType;
  description: string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface CmsRoadmap {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: RoadmapCategory;
  difficulty: Difficulty;
  estimatedDuration: string;
  status: ContentStatus;
  featured: boolean;
  icon: string;
  accent: string;
  targetAudience: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  tags: string[];
  order: number;
  variants: RoadmapVariant[];
  relationships: RoadmapRelationship[];
  sections: RoadmapSection[];
  seo: SeoMetadata;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  createdBy: string;
  updatedBy: string;
}

// --- Project Types ---

export interface ProjectMilestone {
  title: string;
  description: string;
  order: number;
  objectives: string[];
  tasks: string[];
  estimatedDuration: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ExtensionIdea {
  level: 'beginner' | 'intermediate' | 'advanced';
  ideas: string[];
}

export interface CmsProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  estimatedDuration: string;
  status: ContentStatus;
  featured: boolean;
  projectType: string;
  experienceLevel: string;
  technologies: string[];
  skills: string[];
  learningOutcomes: string[];
  features: ProjectFeature[];
  requirements: string[];
  milestones: ProjectMilestone[];
  architecture: string;
  folderStructure: string;
  databaseConsiderations: string;
  apiConsiderations: string;
  testingGuidance: string;
  securityConsiderations: string;
  deploymentGuidance: string;
  extensionIdeas: ExtensionIdea[];
  tags: string[];
  seo: SeoMetadata;
  relatedRoadmapIds: string[];
  prerequisiteRoadmapIds: string[];
  relatedProjectIds: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  createdBy: string;
  updatedBy: string;
}

// --- Resource Types ---

export type ResourceCategory = 'dsa' | 'concepts' | 'guides' | 'career' | 'system-design';

export interface CodeBlock {
  language: string;
  code: string;
}

export interface ResourceApproach {
  name: string;
  explanation: string;
  code: CodeBlock[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface CmsResource {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ResourceCategory;
  difficulty: Difficulty;
  content: string;
  approaches: ResourceApproach[];
  tags: string[];
  relatedProblems: string[];
  relatedRoadmaps: string[];
  relatedResources: string[];
  prerequisites: string[];
  readTime: number;
  status: ContentStatus;
  featured: boolean;
  seo: SeoMetadata;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  createdBy: string;
  updatedBy: string;
}

export interface ResourceListItem {
  id: string;
  slug: string;
  title: string;
  category: ResourceCategory;
  difficulty: Difficulty;
  status: ContentStatus;
  featured: boolean;
  tags: string[];
  readTime: number;
  updatedAt: Date;
  publishedAt: Date | null;
}

// --- DSA Problem Types (dynamic, stored in Firestore) ---

export type DsaDifficulty = 'easy' | 'medium' | 'hard';

export type DsaCategory =
  | 'arrays-hashing'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'tries'
  | 'heap-priority-queue'
  | 'backtracking'
  | 'graphs'
  | 'dynamic-programming'
  | 'greedy'
  | 'intervals'
  | 'math-bit-manipulation';

export interface DsaProblemDoc {
  id: string;
  title: string;
  slug: string;
  difficulty: DsaDifficulty;
  category: DsaCategory;
  link: string;
  videoSolution: string;
  tags: string[];
  companies: string[];
  editorial: string;
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DsaProblemListItem {
  id: string;
  title: string;
  slug: string;
  difficulty: DsaDifficulty;
  category: DsaCategory;
  link: string;
  videoSolution: string;
  tags: string[];
  companies: string[];
  editorial: string;
  order: number;
  status: ContentStatus;
}

// --- List Item Types (for admin list views) ---

export interface RoadmapListItem {
  id: string;
  slug: string;
  title: string;
  icon: string;
  accent: string;
  status: ContentStatus;
  category: RoadmapCategory;
  featured: boolean;
  sectionCount: number;
  topicCount: number;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface ProjectListItem {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  category: string;
  difficulty: Difficulty;
  featured: boolean;
  technologies: string[];
  updatedAt: Date;
  publishedAt: Date | null;
}
