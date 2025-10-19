import { Element, SystemType } from './types';

function createBaseElement(
  name: string,
  system: SystemType,
  index: number
): Element {
  return {
    id: `${system}-${index}`,
    name,
    system,
  };
}

export const BASE_ELEMENTS: Element[] = [
  // Emotional Chemistry (8 elements)
  createBaseElement('Joy', 'emotional-chemistry', 0),
  createBaseElement('Fear', 'emotional-chemistry', 1),
  createBaseElement('Anger', 'emotional-chemistry', 2),
  createBaseElement('Desire', 'emotional-chemistry', 3),
  createBaseElement('Shame', 'emotional-chemistry', 4),
  createBaseElement('Pride', 'emotional-chemistry', 5),
  createBaseElement('Loneliness', 'emotional-chemistry', 6),
  createBaseElement('Hope', 'emotional-chemistry', 7),

  // Story Particles (8 elements)
  createBaseElement('A glance', 'story-particles', 0),
  createBaseElement('A door', 'story-particles', 1),
  createBaseElement('A lie', 'story-particles', 2),
  createBaseElement('Rain', 'story-particles', 3),
  createBaseElement('A name', 'story-particles', 4),
  createBaseElement('Silence', 'story-particles', 5),
  createBaseElement('A scar', 'story-particles', 6),
  createBaseElement('Running', 'story-particles', 7),

  // Character Fusion (8 elements)
  createBaseElement('Ambitious', 'character-fusion', 0),
  createBaseElement('Wounded', 'character-fusion', 1),
  createBaseElement('Cheerful', 'character-fusion', 2),
  createBaseElement('Secretive', 'character-fusion', 3),
  createBaseElement('Loyal', 'character-fusion', 4),
  createBaseElement('Rebellious', 'character-fusion', 5),
  createBaseElement('Careful', 'character-fusion', 6),
  createBaseElement('Wild', 'character-fusion', 7),

  // Trope Alchemy (8 elements)
  createBaseElement('Fake Dating', 'trope-alchemy', 0),
  createBaseElement('Enemy', 'trope-alchemy', 1),
  createBaseElement('Amnesia', 'trope-alchemy', 2),
  createBaseElement('Prophecy', 'trope-alchemy', 3),
  createBaseElement('Heist', 'trope-alchemy', 4),
  createBaseElement('Masquerade', 'trope-alchemy', 5),
  createBaseElement('Deadline', 'trope-alchemy', 6),
  createBaseElement('Secret Identity', 'trope-alchemy', 7),

  // Sensory World Building (8 elements)
  createBaseElement('Smoke', 'sensory-worldbuilding', 0),
  createBaseElement('Silk', 'sensory-worldbuilding', 1),
  createBaseElement('Iron', 'sensory-worldbuilding', 2),
  createBaseElement('Honey', 'sensory-worldbuilding', 3),
  createBaseElement('Thunder', 'sensory-worldbuilding', 4),
  createBaseElement('Shadow', 'sensory-worldbuilding', 5),
  createBaseElement('Salt', 'sensory-worldbuilding', 6),
  createBaseElement('Starlight', 'sensory-worldbuilding', 7),

  // Momentum Engine (8 elements)
  createBaseElement('Chase', 'momentum-engine', 0),
  createBaseElement('Hide', 'momentum-engine', 1),
  createBaseElement('Reveal', 'momentum-engine', 2),
  createBaseElement('Betray', 'momentum-engine', 3),
  createBaseElement('Protect', 'momentum-engine', 4),
  createBaseElement('Destroy', 'momentum-engine', 5),
  createBaseElement('Create', 'momentum-engine', 6),
  createBaseElement('Wait', 'momentum-engine', 7),
];

// Helper to get elements by system
export function getElementsBySystem(system: SystemType): Element[] {
  return BASE_ELEMENTS.filter((el) => el.system === system);
}

// Helper to find element by ID
export function findElementById(id: string, allElements: Element[]): Element | undefined {
  return allElements.find((el) => el.id === id);
}
