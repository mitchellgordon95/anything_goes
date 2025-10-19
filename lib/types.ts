export interface Element {
  id: string;
  name: string;
  system: SystemType;
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
  | 'emotional-chemistry'
  | 'story-particles'
  | 'character-fusion'
  | 'trope-alchemy'
  | 'sensory-worldbuilding'
  | 'momentum-engine';

export const SYSTEM_NAMES: Record<SystemType, string> = {
  'emotional-chemistry': 'Emotional Chemistry',
  'story-particles': 'Story Particles',
  'character-fusion': 'Character Fusion',
  'trope-alchemy': 'Trope Alchemy',
  'sensory-worldbuilding': 'Sensory World Building',
  'momentum-engine': 'Momentum Engine',
};

export const SYSTEM_COLORS: Record<SystemType, string> = {
  'emotional-chemistry': '#ec4899', // Pink/Rose
  'story-particles': '#06b6d4', // Cyan/Teal
  'character-fusion': '#a855f7', // Purple
  'trope-alchemy': '#f59e0b', // Amber/Gold
  'sensory-worldbuilding': '#10b981', // Emerald/Green
  'momentum-engine': '#f97316', // Orange/Red
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
