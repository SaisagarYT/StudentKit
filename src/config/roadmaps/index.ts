import { Roadmap } from '@/types/roadmap';
import { frontendDeveloperRoadmap } from './frontend-developer';
import { placementPreparationRoadmap } from './placement-preparation';

export const roadmaps: Roadmap[] = [
  frontendDeveloperRoadmap,
  placementPreparationRoadmap,
];

export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return roadmaps.find((r) => r.slug === slug);
}
