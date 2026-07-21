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
  CmsResource,
  RoadmapListItem,
  ProjectListItem,
  ResourceListItem,
  ContentStatus,
  DsaProblemDoc,
  DsaProblemListItem,
  DsaCategory,
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

// --- Resource Repository ---

function docToResource(id: string, data: Record<string, any>): CmsResource {
  return {
    id,
    slug: data.slug ?? '',
    title: data.title ?? '',
    shortDescription: data.shortDescription ?? '',
    category: data.category ?? 'dsa',
    difficulty: data.difficulty ?? 'beginner',
    content: data.content ?? '',
    approaches: data.approaches ?? [],
    tags: data.tags ?? [],
    relatedProblems: data.relatedProblems ?? [],
    relatedRoadmaps: data.relatedRoadmaps ?? [],
    relatedResources: data.relatedResources ?? [],
    prerequisites: data.prerequisites ?? [],
    readTime: data.readTime ?? 5,
    status: data.status ?? 'draft',
    featured: data.featured ?? false,
    seo: data.seo ?? {},
    order: data.order ?? 0,
    createdAt: toDate(data.createdAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    publishedAt: toDate(data.publishedAt),
    createdBy: data.createdBy ?? '',
    updatedBy: data.updatedBy ?? '',
  };
}

export const resourceRepository = {
  async getById(id: string): Promise<CmsResource | null> {
    const snap = await getDoc(doc(getFirebaseDb(), 'resources', id));
    if (!snap.exists()) return null;
    return docToResource(snap.id, snap.data());
  },

  async getBySlug(slug: string): Promise<CmsResource | null> {
    const q = query(
      collection(getFirebaseDb(), 'resources'),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return docToResource(d.id, d.data());
  },

  async list(filters?: { status?: ContentStatus; category?: string }): Promise<ResourceListItem[]> {
    let snap;
    try {
      let q;
      if (filters?.status) {
        q = query(collection(getFirebaseDb(), 'resources'), where('status', '==', filters.status), orderBy('updatedAt', 'desc'));
      } else {
        q = query(collection(getFirebaseDb(), 'resources'), orderBy('updatedAt', 'desc'));
      }
      snap = await getDocs(q);
    } catch {
      // Fallback without orderBy if index not ready
      let q;
      if (filters?.status) {
        q = query(collection(getFirebaseDb(), 'resources'), where('status', '==', filters.status));
      } else {
        q = query(collection(getFirebaseDb(), 'resources'));
      }
      snap = await getDocs(q);
    }
    let items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        slug: data.slug,
        title: data.title,
        category: data.category ?? 'dsa',
        difficulty: data.difficulty ?? 'beginner',
        status: data.status,
        featured: data.featured ?? false,
        tags: data.tags ?? [],
        readTime: data.readTime ?? 5,
        updatedAt: toDate(data.updatedAt) ?? new Date(),
        publishedAt: toDate(data.publishedAt),
      };
    });
    if (filters?.category) {
      items = items.filter(i => i.category === filters.category);
    }
    return items;
  },

  async listPublished(category?: string): Promise<ResourceListItem[]> {
    try {
      return await this.list({ status: 'published', category });
    } catch {
      // Fallback if composite index isn't ready yet
      const q = query(collection(getFirebaseDb(), 'resources'), where('status', '==', 'published'));
      const snap = await getDocs(q);
      let items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          slug: data.slug,
          title: data.title,
          category: data.category ?? 'dsa',
          difficulty: data.difficulty ?? 'beginner',
          status: data.status as 'published',
          featured: data.featured ?? false,
          tags: data.tags ?? [],
          readTime: data.readTime ?? 5,
          updatedAt: toDate(data.updatedAt) ?? new Date(),
          publishedAt: toDate(data.publishedAt),
        };
      });
      if (category) items = items.filter(i => i.category === category);
      return items;
    }
  },

  async create(data: Record<string, any>, userId: string): Promise<string> {
    const ref = await addDoc(collection(getFirebaseDb(), 'resources'), {
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
    await updateDoc(doc(getFirebaseDb(), 'resources', id), {
      ...data,
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async publish(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'resources', id), {
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async unpublish(id: string, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'resources', id), {
      status: 'draft',
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(getFirebaseDb(), 'resources', id));
  },
};

// --- DSA Problem Repository ---

function docToDsaProblem(id: string, data: Record<string, any>): DsaProblemDoc {
  return {
    id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    difficulty: data.difficulty ?? 'medium',
    category: data.category ?? 'arrays-hashing',
    link: data.link ?? '',
    videoSolution: data.videoSolution ?? '',
    tags: data.tags ?? [],
    companies: data.companies ?? [],
    editorial: data.editorial ?? '',
    order: data.order ?? 0,
    status: data.status ?? 'published',
    createdAt: toDate(data.createdAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    createdBy: data.createdBy ?? '',
  };
}

export const dsaProblemRepository = {
  async list(category?: DsaCategory): Promise<DsaProblemListItem[]> {
    let snap;
    try {
      let q;
      if (category) {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), where('category', '==', category), orderBy('order', 'asc'));
      } else {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), orderBy('order', 'asc'));
      }
      snap = await getDocs(q);
    } catch {
      let q;
      if (category) {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), where('category', '==', category));
      } else {
        q = query(collection(getFirebaseDb(), 'dsa-problems'));
      }
      snap = await getDocs(q);
    }
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? '',
        slug: data.slug ?? '',
        difficulty: data.difficulty ?? 'medium',
        category: data.category ?? 'arrays-hashing',
        link: data.link ?? '',
        videoSolution: data.videoSolution ?? '',
        tags: data.tags ?? [],
        companies: data.companies ?? [],
        editorial: data.editorial ?? '',
        order: data.order ?? 0,
        status: data.status ?? 'published',
      };
    });
  },

  async listPublished(category?: DsaCategory): Promise<DsaProblemListItem[]> {
    let snap;
    try {
      let q;
      if (category) {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), where('status', '==', 'published'), where('category', '==', category), orderBy('order', 'asc'));
      } else {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), where('status', '==', 'published'), orderBy('order', 'asc'));
      }
      snap = await getDocs(q);
    } catch {
      let q;
      if (category) {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), where('status', '==', 'published'), where('category', '==', category));
      } else {
        q = query(collection(getFirebaseDb(), 'dsa-problems'), where('status', '==', 'published'));
      }
      snap = await getDocs(q);
    }
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? '',
        slug: data.slug ?? '',
        difficulty: data.difficulty ?? 'medium',
        category: data.category ?? 'arrays-hashing',
        link: data.link ?? '',
        videoSolution: data.videoSolution ?? '',
        tags: data.tags ?? [],
        companies: data.companies ?? [],
        editorial: data.editorial ?? '',
        order: data.order ?? 0,
        status: data.status as 'published',
      };
    });
  },

  async getById(id: string): Promise<DsaProblemDoc | null> {
    const snap = await getDoc(doc(getFirebaseDb(), 'dsa-problems', id));
    if (!snap.exists()) return null;
    return docToDsaProblem(snap.id, snap.data());
  },

  async create(data: Record<string, any>, userId: string): Promise<string> {
    const ref = await addDoc(collection(getFirebaseDb(), 'dsa-problems'), {
      ...data,
      status: 'published',
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Record<string, any>, userId: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), 'dsa-problems', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(getFirebaseDb(), 'dsa-problems', id));
  },
};
