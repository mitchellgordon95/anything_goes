import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

interface CrystallizeElement {
  name: string;
  system: string;
  description?: string;
}

interface CrystallizeRequest {
  elements: CrystallizeElement[];
  type: string; // Character, Location, Scene, Beat, Object, Relationship, Event, Theme
}

export async function POST(req: NextRequest) {
  try {
    const body: CrystallizeRequest = await req.json();
    const { elements, type } = body;

    if (!elements || elements.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 elements are required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    // Build elements list for prompt
    const elementsList = elements
      .map((el, idx) => `Element ${idx + 1}: "${el.name}" (${el.system})${el.description ? ` - ${el.description}` : ''}`)
      .join('\n');

    const prompt = `Crystallize these ${elements.length} story elements into a concrete ${type}:

${elementsList}

Create a specific, concrete ${type} that combines and embodies ALL the traits, qualities, and essences from these ${elements.length} elements. This should be a fully-realized, specific instance - not an abstract concept.

For example:
- If creating a Character, give them a specific name, personality, background
- If creating a Location, describe a specific place with concrete details
- If creating a Scene, describe a specific moment with concrete action
- If creating an Event, describe what specifically happens

IMPORTANT: The ${type} must include ALL traits from every element. Do not leave anything out - this should be a complete fusion that preserves everything.

Respond with ONLY a JSON object in this format:
{"name": "${type} Name", "description": "2-3 sentence concrete description of this specific ${type.toLowerCase()}, incorporating all element traits"}

The description should be specific and concrete, like describing a real person/place/thing, not abstract concepts.`;

    // Log the prompt for inspection
    console.log('=== CRYSTALLIZATION REQUEST ===');
    console.log('Type:', type);
    console.log('Elements:', elements.map(e => e.name).join(', '));
    console.log('\n=== PROMPT ===');
    console.log(prompt);
    console.log('================\n');

    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      prompt,
      maxTokens: 200,
      temperature: 0.9,
    });

    // Parse JSON response
    let resultName: string;
    let resultDescription: string;

    try {
      const parsed = JSON.parse(text.trim());
      resultName = parsed.name;
      resultDescription = parsed.description || '';
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      return NextResponse.json(
        { error: 'Failed to parse AI response', success: false },
        { status: 500 }
      );
    }

    // Log the response
    console.log('=== RESPONSE ===');
    console.log('Raw:', text);
    console.log('Name:', resultName);
    console.log('Description:', resultDescription);
    console.log('================\n');

    return NextResponse.json({
      name: resultName,
      description: resultDescription,
      success: true,
    });
  } catch (error) {
    console.error('Error crystallizing elements:', error);
    return NextResponse.json(
      { error: 'Failed to crystallize elements', success: false },
      { status: 500 }
    );
  }
}
