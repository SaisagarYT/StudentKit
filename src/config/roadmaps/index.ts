import { Roadmap } from '@/types/roadmap';
import { frontendDeveloperRoadmap } from './frontend-developer';
import { backendDeveloperRoadmap } from './backend-developer';
import { fullStackDeveloperRoadmap } from './full-stack-developer';
import { aiEngineerRoadmap } from './ai-engineer';
import { mobileDeveloperRoadmap } from './mobile-developer';
import { devopsEngineerRoadmap } from './devops-engineer';
import { cybersecurityRoadmap } from './cybersecurity';
import { placementPreparationRoadmap } from './placement-preparation';
import { oopRoadmap } from './object-oriented-programming';

export const roadmaps: Roadmap[] = [
  frontendDeveloperRoadmap,
  backendDeveloperRoadmap,
  fullStackDeveloperRoadmap,
  aiEngineerRoadmap,
  mobileDeveloperRoadmap,
  devopsEngineerRoadmap,
  cybersecurityRoadmap,
  placementPreparationRoadmap,
  oopRoadmap,
];

export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return roadmaps.find((r) => r.slug === slug);
}
