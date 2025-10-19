import { Element, SystemType } from './types';

function createBaseElement(
  name: string,
  system: SystemType,
  index: number,
  description: string
): Element {
  return {
    id: `${system}-${index}`,
    name,
    system,
    description,
  };
}

export const BASE_ELEMENTS: Element[] = [
  // Emotions (8 elements)
  createBaseElement('Joy', 'emotions', 0, 'Pure, unfiltered happiness that lights up everything it touches. The foundation of connection and celebration.'),
  createBaseElement('Fear', 'emotions', 1, 'The primal instinct that keeps us alive, but can also cage us. A powerful motivator wrapped in uncertainty.'),
  createBaseElement('Anger', 'emotions', 2, 'Fire in the veins that demands justice and change. A force that can destroy or transform.'),
  createBaseElement('Desire', 'emotions', 3, 'The yearning that pulls us forward, promising fulfillment. What we want reveals who we are.'),
  createBaseElement('Shame', 'emotions', 4, 'The weight of not being enough, carried in silence. A shadow that shapes how we hide ourselves.'),
  createBaseElement('Pride', 'emotions', 5, 'The armor of self-worth that can become a prison. Confidence teetering on the edge of arrogance.'),
  createBaseElement('Loneliness', 'emotions', 6, 'The ache of disconnection in a crowded room. An emptiness that hunger for belonging.'),
  createBaseElement('Hope', 'emotions', 7, 'The stubborn belief that tomorrow could be different. A fragile light that refuses to die.'),

  // Story Particles (8 elements)
  createBaseElement('A glance', 'story-particles', 0, 'A fleeting moment of eye contact that says everything words cannot. Universes collide in a single look.'),
  createBaseElement('A door', 'story-particles', 1, 'The threshold between worlds, between choices. Every door holds both an exit and an entrance.'),
  createBaseElement('A lie', 'story-particles', 2, 'A small untruth that grows roots. What starts as protection often becomes a cage.'),
  createBaseElement('Rain', 'story-particles', 3, 'The sky weeping or washing clean, depending on who you ask. Nature\'s way of making everything feel more dramatic.'),
  createBaseElement('A name', 'story-particles', 4, 'Identity wrapped in syllables, carrying history and expectation. To name something is to give it power.'),
  createBaseElement('Silence', 'story-particles', 5, 'The absence of sound that speaks louder than words. What isn\'t said often matters most.'),
  createBaseElement('A scar', 'story-particles', 6, 'Proof that something wounded you and you survived. Every mark tells a story written in flesh.'),
  createBaseElement('Running', 'story-particles', 7, 'Flight toward or away from something. Movement as instinct, as desperation, as freedom.'),

  // Characteristics (8 elements)
  createBaseElement('Ambitious', 'characteristics', 0, 'Driven by visions of what could be, willing to sacrifice for the climb. Success is oxygen.'),
  createBaseElement('Wounded', 'characteristics', 1, 'Carrying pain that shaped them, for better or worse. Past trauma colors every present moment.'),
  createBaseElement('Cheerful', 'characteristics', 2, 'Radiating optimism that could be genuine or armor. Brightness that either heals or deflects.'),
  createBaseElement('Secretive', 'characteristics', 3, 'Guarding truths behind practiced smiles and careful words. Privacy is survival.'),
  createBaseElement('Loyal', 'characteristics', 4, 'Steadfast to a fault, standing beside chosen people through storms. Devotion as both strength and weakness.'),
  createBaseElement('Rebellious', 'characteristics', 5, 'Challenging authority and breaking rules on principle. Freedom fighter or troublemaker, depending on perspective.'),
  createBaseElement('Careful', 'characteristics', 6, 'Weighing every risk, planning three moves ahead. Safety through control.'),
  createBaseElement('Wild', 'characteristics', 7, 'Untamed and unpredictable, following instinct over reason. Chaos as a form of honesty.'),

  // Tropes (8 elements)
  createBaseElement('Fake Dating', 'tropes', 0, 'Pretending to be in love for practical reasons. Feelings that were supposed to stay fake rarely do.'),
  createBaseElement('Enemy', 'tropes', 1, 'Opposition and conflict that defines both sides. The line between enemy and obsession is razor-thin.'),
  createBaseElement('Amnesia', 'tropes', 2, 'The past erased, identity rebuilt from fragments. Who are you when you can\'t remember?'),
  createBaseElement('Prophecy', 'tropes', 3, 'Destiny written before birth, fate as a cage or calling. Fighting or fulfilling what was foretold.'),
  createBaseElement('Heist', 'tropes', 4, 'The elaborate plan, the perfect team, the impossible target. Everything depends on timing.'),
  createBaseElement('Masquerade', 'tropes', 5, 'Hidden faces and hidden motives, dancing through deception. Everyone is pretending to be someone else.'),
  createBaseElement('Deadline', 'tropes', 6, 'Time running out, pressure mounting with every tick. The clock becomes the enemy.'),
  createBaseElement('Secret Identity', 'tropes', 7, 'Living two lives, wearing two faces. The exhaustion of never being fully yourself.'),

  // Sensory (8 elements)
  createBaseElement('Smoke', 'sensory', 0, 'Curling wisps that obscure and reveal, carrying scent memory. The ghost of fire.'),
  createBaseElement('Silk', 'sensory', 1, 'Luxury that whispers against skin, promise of wealth or seduction. Softness hiding strength.'),
  createBaseElement('Iron', 'sensory', 2, 'The taste of blood, the weight of chains, the strength of will. Cold, hard reality.'),
  createBaseElement('Honey', 'sensory', 3, 'Golden sweetness, slow and rich and sticky. Comfort that can trap.'),
  createBaseElement('Thunder', 'sensory', 4, 'Sky-splitting roar that shakes bones and announces power. The warning before the strike.'),
  createBaseElement('Shadow', 'sensory', 5, 'Absence of light where things hide. Darkness as shelter or threat.'),
  createBaseElement('Salt', 'sensory', 6, 'Tears, ocean, earth. The taste of life preserved or wounds opened.'),
  createBaseElement('Starlight', 'sensory', 7, 'Ancient light touching skin, distant and cold but beautiful. Hope from dead things.'),

  // Momentum (8 elements)
  createBaseElement('Chase', 'momentum', 0, 'Pursuit with everything on the line, hunter and hunted locked in motion. Speed becomes survival.'),
  createBaseElement('Hide', 'momentum', 1, 'Disappearing into shadows, becoming invisible, holding breath. Safety in stillness and silence.'),
  createBaseElement('Reveal', 'momentum', 2, 'The moment truth comes to light, secrets exposed. Everything changes when seen.'),
  createBaseElement('Betray', 'momentum', 3, 'The knife in the back from a trusted hand. Trust shattered becomes a weapon.'),
  createBaseElement('Protect', 'momentum', 4, 'Standing between loved ones and danger, shield raised. Love expressed through sacrifice.'),
  createBaseElement('Destroy', 'momentum', 5, 'Tearing down what was built, burning bridges, breaking bonds. Sometimes creation requires destruction.'),
  createBaseElement('Create', 'momentum', 6, 'Building something from nothing, breathing life into ideas. The power to shape reality.'),
  createBaseElement('Wait', 'momentum', 7, 'Patience as strategy, stillness as strength. Sometimes the hardest action is inaction.'),
];

// Helper to get elements by system
export function getElementsBySystem(system: SystemType): Element[] {
  return BASE_ELEMENTS.filter((el) => el.system === system);
}

// Helper to find element by ID
export function findElementById(id: string, allElements: Element[]): Element | undefined {
  return allElements.find((el) => el.id === id);
}
