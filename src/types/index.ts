export interface ResourceNode {
  id: string;
  name: string;
  resourceType: 'video' | 'pdf' | 'book' | 'article' | 'website' | 'other';
  topicTag?: string | null;
  link: string;
  nodeType: 'resource';
  position?: { x: number; y: number };
}

export interface QuestionNode {
  id: string;
  question: string;
  topicTag?: string|null;
  answeredLevel: number; // 0 to 1
  note?: string|null;
  nodeType: 'question';
  position?: { x: number; y: number };
}

export type AppNode = ResourceNode | QuestionNode;

export interface AppEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}