export interface RoadmapResource {
  title: string;
  url: string;
}

export type RoadmapNodeStatus = "not_started" | "in_progress" | "completed";

export interface RoadmapNode {
  id: string;
  title: string;
  details: string;
  resources: RoadmapResource[];
  position?: { x: number; y: number };
  progress: RoadmapNodeStatus;
}

export interface RoadmapDependency {
  source: string;
  target: string;
}

export interface RoadmapMetadata {
  id: string;
  userId: string;
  targetRole: string;
  generatedAt: string;
  version: number;
}

export interface JobProfile {
  title: string;
  description: string;
}

export interface FullRoadmapData {
  roadmap: RoadmapMetadata;
  nodes: RoadmapNode[];
  dependencies: RoadmapDependency[];
}
