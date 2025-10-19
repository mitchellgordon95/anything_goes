export type ConcreteElementType =
  | 'Character'
  | 'Location'
  | 'Scene'
  | 'Beat'
  | 'Object'
  | 'Relationship'
  | 'Event'
  | 'Theme';

export interface Element {
  id: string;
  name: string;
  system: SystemType;
  description?: string;
  parents?: [string, string]; // IDs of elements that created this
  discoveredAt?: string; // ISO timestamp
  concreteType?: ConcreteElementType; // Set when element is crystallized
}

export interface Combination {
  element1Id: string;
  element2Id: string;
  resultId: string;
  discoveredByUser: boolean;
}

export type SystemType =
  | 'emotions'
  | 'story-particles'
  | 'characteristics'
  | 'tropes'
  | 'sensory'
  | 'momentum';

export const SYSTEM_NAMES: Record<SystemType, string> = {
  'emotions': 'Emotions',
  'story-particles': 'Story Particles',
  'characteristics': 'Characteristics',
  'tropes': 'Tropes',
  'sensory': 'Sensory',
  'momentum': 'Momentum',
};

export const SYSTEM_COLORS: Record<SystemType, string> = {
  'emotions': '#ec4899', // Pink/Rose
  'story-particles': '#06b6d4', // Cyan/Teal
  'characteristics': '#a855f7', // Purple
  'tropes': '#f59e0b', // Amber/Gold
  'sensory': '#10b981', // Emerald/Green
  'momentum': '#f97316', // Orange/Red
};

export interface Position {
  x: number;
  y: number;
}

export interface CanvasElement {
  element: Element;
  position: Position;
}

// Helper to convert from display name to system type
export function getSystemTypeFromName(name: string): SystemType | undefined {
  const entry = Object.entries(SYSTEM_NAMES).find(
    ([_, displayName]) => displayName === name
  );
  return entry ? (entry[0] as SystemType) : undefined;
}
