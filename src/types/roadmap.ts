export interface RoadmapResource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'docs';
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  whatToLearn: string[];
  resources: RoadmapResource[];
  project: {
    title: string;
    description: string;
  };
  variant?: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  color: 'green' | 'lime' | 'yellow' | 'orange' | 'red' | 'purple';
  topics: RoadmapTopic[];
}

export interface RelatedRoadmap {
  slug: string;
  relation: 'prerequisite' | 'builds-on' | 'shared-topics' | 'alternative';
  description: string;
}

export interface RoadmapVariant {
  id: string;
  label: string;
}

export interface Roadmap {
  slug: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  totalTime: string;
  languages?: string[];
  variants?: RoadmapVariant[];
  relatedRoadmaps?: RelatedRoadmap[];
  stages: RoadmapStage[];
}
