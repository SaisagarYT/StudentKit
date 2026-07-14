import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase/client';
import type {
  CmsRoadmap,
  CmsProject,
  RoadmapListItem,
  ProjectListItem,
  ContentStatus,
} from './types';

function toDate(ts: Timestamp | null | undefined): Date | null {
  return ts ? ts.toDate() : null;
}

function docToRoadmap(id: string, data: Record<string, any>): CmsRoadmap {
  return {
    id,
    slug: data.slug ?? '',
    title: data.title ?? '',
    shortDescription: data.shortDescription ?? '',
    description: data.description ?? '',
    category: data.category ?? 'web-development',
    difficulty: data.difficulty ?? 'beginner',
    estimatedDuration: data.estimatedDuration ?? '',
    status: data.status ?? 'draft',
    featured: data.featured ?? false,
    icon: data.icon ?? 'Map',
    accent: data.accent ?? '#C7FF3D',
    targetAudience: data.targetAudience ?? [],
    learningOutcomes: data.learningOutcomes ?? [],
    prerequisites: data.prerequisites ?? [],
    tags: data.tags ?? [],
    order: data.order ?? 0,
    variants: data.variants ?? [],
    relationships: data.relationships ?? [],
    sections: data.sections ?? [],
    seo: data.seo ?? {},
    createdAt: toDate(data.createdAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    publishedAt: toDate(data.publishedAt),
    createdBy: data.createdBy ?? '',
    updatedBy: data.updatedBy ?? '',
  };
}

function docToProject(id: string, data: Record<string, any>): CmsProject {
  return {
    id,
    slug: data.slug ?? '',
    title: data.title ?? '',
    shortDescription: data.shortDescription ?? '',
    description: data.description ?? '',
    category: data.category ?? '',
    difficulty: data.difficulty ?? 'beginner',
    estimatedDuration: data.estimatedDuration ?? '',
    status: data.status ?? 'draft',
    featured: data.featured ?? false,
    projectType: data.projectType ?? '',
    experienceLevel: data.experienceLevel ?? '',
    technologies: data.technologies ?? [],
    skills: data.skills ?? [],
    learningOutcomes: data.learningOutcomes ?? [],
    features: data.features ?? [],
    requirements: data.requirements ?? [],
    milestones: data.milestones ?? [],
    architecture: data.architecture ?? '',
    folderStructure: data.folderStructure ?? '',
    databaseConsiderations: data.databaseConsiderations ?? '',
    apiConsiderations: data.apiConsiderations ?? '',
    testingGuidance: data.testingGuidance ?? '',
    securityConsiderations: data.securityConsiderations ?? '',
    deploymentGuidance: data.deploymentGuidance ?? '',
    extensionIdeas: data.extensionIdeas ?? [],
    tags: data.tags ?? [],
    seo: data.seo ?? {},
    relatedRoadmapIds: data.relatedRoadmapIds ?? [],
    prerequisiteRoadmapIds: data.prerequisiteRoadmapIds ?? [],
    relatedProjectIds: data.relatedProjectIds ?? [],
    order: data.order ?? 0,
    createdAt: toDate(data.createdAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    publishedAt: toDate(data.publishedAt),
    createdBy: data.createdBy ?? '',
    updatedBy: data.updatedBy ?? '',
  };
}

// --- Roadmap Repository ---

export const roadmapRepository = {
  async getById(id: string): Promise<CmsRoadmap | null> {
    const snap = await getDoc(doc(getFirebaseDb(), 'roadmaps', id));
    if (!snap.exists()) return null;
    return docToRoadmap(snap.id, snap.data());
  },

  async getBySlug(slug: string): Promise<CmsRoadmap | null> {
    const q = query(collection(getFirebaseDb(), 'roadmaps'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return docToRoadmap(d.id, d.data());
  },

  async list(filters?: { status?: ContentStatus }): Promise<RoadmapListItem[]> {
    let q;
    if (filters?.status) {
      q = query(collection(getFirebaseDb(), 'roadmaps'), where('status', '==', filters.status), orderBy('updatedAt', 'desc'));
    } else {
      q = query(collection(getFirebaseDb(), 'roadmaps'), orderBy('updatedAt', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      const sections = data.sections ?? [];
      return {
        id: d.id,
        slug: data.slug,
        title: data.title,
        icon: data.icon ?? 'Map',
        accent: data.accent ?? '#C7FF3D',
        status: data.status,
        category: data.category,
        featured: data.featured ?? false,
        sectionCount: sections.length,
        topicCount: sections.reduce((sum: number, s: any) => sum + (s.topics?.length ?? 0), 0),
        updatedAt: toDate(data.updatedAt) ?? new Date(),
        publishedAt: toDate(data.publishedAt),
      };
    });
  },

  async create(data: Record<string, any>, userId: string): Promise<string> {
    const ref = await addDoc(collection(getFirebaseDb(), 'roadmaps'), {
      ...data,
      status: 'draft',
      featured: false,
      order: 0,
      createdBy: userId,
      updatedBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: null,
    });
    return ref.id;
  },

  async update(id: string, data: Record<string, any>, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'roadmaps', id), {
      ...data,
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async publish(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'roadmaps', id), {
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async unpublish(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'roadmaps', id), {
      status: 'draft',
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async archive(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'roadmaps', id), {
      status: 'archived',
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(getFirebaseDb(), 'roadmaps', id));
  },
};

// --- Project Repository ---

export const projectRepository = {
  async getById(id: string): Promise<CmsProject | null> {
    const snap = await getDoc(doc(getFirebaseDb(), 'projects', id));
    if (!snap.exists()) return null;
    return docToProject(snap.id, snap.data());
  },

  async getBySlug(slug: string): Promise<CmsProject | null> {
    const q = query(collection(getFirebaseDb(), 'projects'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return docToProject(d.id, d.data());
  },

  async list(filters?: { status?: ContentStatus }): Promise<ProjectListItem[]> {
    let q;
    if (filters?.status) {
      q = query(collection(getFirebaseDb(), 'projects'), where('status', '==', filters.status), orderBy('updatedAt', 'desc'));
    } else {
      q = query(collection(getFirebaseDb(), 'projects'), orderBy('updatedAt', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        slug: data.slug,
        title: data.title,
        status: data.status,
        category: data.category ?? '',
        difficulty: data.difficulty ?? 'beginner',
        featured: data.featured ?? false,
        technologies: data.technologies ?? [],
        updatedAt: toDate(data.updatedAt) ?? new Date(),
        publishedAt: toDate(data.publishedAt),
      };
    });
  },

  async create(data: Record<string, any>, userId: string): Promise<string> {
    const ref = await addDoc(collection(getFirebaseDb(), 'projects'), {
      ...data,
      status: 'draft',
      featured: false,
      order: 0,
      createdBy: userId,
      updatedBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: null,
    });
    return ref.id;
  },

  async update(id: string, data: Record<string, any>, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'projects', id), {
      ...data,
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async publish(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'projects', id), {
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async unpublish(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'projects', id), {
      status: 'draft',
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async archive(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'projects', id), {
      status: 'archived',
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(getFirebaseDb(), 'projects', id));
  },
};
