export interface Element {
  id: string;
  name: string;
  system: SystemType;
  description?: string;
  parents?: [string, string]; // IDs of elements that created this
  discoveredAt?: string; // ISO timestamp
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
  | 'momentum'
  | 'character'
  | 'location'
  | 'scene'
  | 'beat'
  | 'object'
  | 'relationship'
  | 'event'
  | 'theme';

export const SYSTEM_NAMES: Record<SystemType, string> = {
  'emotions': 'Emotions',
  'story-particles': 'Story Particles',
  'characteristics': 'Characteristics',
  'tropes': 'Tropes',
  'sensory': 'Sensory',
  'momentum': 'Momentum',
  'character': 'Character',
  'location': 'Location',
  'scene': 'Scene',
  'beat': 'Beat',
  'object': 'Object',
  'relationship': 'Relationship',
  'event': 'Event',
  'theme': 'Theme',
};

export const SYSTEM_COLORS: Record<SystemType, string> = {
  'emotions': '#ec4899', // Pink/Rose
  'story-particles': '#06b6d4', // Cyan/Teal
  'characteristics': '#a855f7', // Purple
  'tropes': '#f59e0b', // Amber/Gold
  'sensory': '#10b981', // Emerald/Green
  'momentum': '#f97316', // Orange/Red
  'character': '#a855f7', // Purple
  'location': '#10b981', // Green
  'scene': '#06b6d4', // Cyan
  'beat': '#f97316', // Orange
  'object': '#059669', // Emerald
  'relationship': '#ec4899', // Pink
  'event': '#f59e0b', // Amber
  'theme': '#6b7280', // Gray
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_key, displayName]) => displayName === name
  );
  return entry ? (entry[0] as SystemType) : undefined;
}

// Abstract systems (can be combined)
export const ABSTRACT_SYSTEMS: SystemType[] = [
  'emotions',
  'story-particles',
  'characteristics',
  'tropes',
  'sensory',
  'momentum',
];

// Concrete systems (result of crystallization)
const CONCRETE_SYSTEMS: SystemType[] = [
  'character',
  'location',
  'scene',
  'beat',
  'object',
  'relationship',
  'event',
  'theme',
];

// Helper to check if a system is abstract
export function isAbstractSystem(system: SystemType): boolean {
  return ABSTRACT_SYSTEMS.includes(system);
}

// Helper to check if a system is concrete
export function isConcreteSystem(system: SystemType): boolean {
  return CONCRETE_SYSTEMS.includes(system);
}
