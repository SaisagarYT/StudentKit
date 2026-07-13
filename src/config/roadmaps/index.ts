import { Roadmap } from '@/types/roadmap';
import { frontendDeveloperRoadmap } from './frontend-developer';
import { backendDeveloperRoadmap } from './backend-developer';
import { fullStackDeveloperRoadmap } from './full-stack-developer';
import { placementPreparationRoadmap } from './placement-preparation';

export const roadmaps: Roadmap[] = [
  frontendDeveloperRoadmap,
  backendDeveloperRoadmap,
  fullStackDeveloperRoadmap,
  placementPreparationRoadmap,
];

export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return roadmaps.find((r) => r.slug === slug);
}
