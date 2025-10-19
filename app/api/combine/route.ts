import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

interface CombineRequest {
  element1: {
    name: string;
    system: string;
  };
  element2: {
    name: string;
    system: string;
  };
  rejectedNames?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: CombineRequest = await req.json();
    const { element1, element2, rejectedNames = [] } = body;

    if (!element1 || !element2) {
      return NextResponse.json(
        { error: 'Both elements are required' },
        { status: 400 }
      );
    }

    const isSameSystem = element1.system === element2.system;

    // Build rejected names section if any exist
    const rejectedSection = rejectedNames.length > 0
      ? `\n\nDo NOT use any of these previously rejected names:\n${rejectedNames.map(name => `- "${name}"`).join('\n')}`
      : '';

    // Generate prompt based on whether it's same-system or cross-system
    const prompt = isSameSystem
      ? `Combine these two story elements into a new, more complex element:
Element 1: "${element1.name}" (from ${element1.system})
Element 2: "${element2.name}" (from ${element2.system})

Create a name and description for what emerges when these combine. The result should feel like a natural evolution or synthesis.

IMPORTANT: The combined element must include ALL traits from both elements. Do not leave anything out - the result should be a complete fusion that preserves everything from both inputs.${rejectedSection}

Respond with ONLY a JSON object in this format:
{"name": "Element Name", "description": "1-2 sentence trading card style flavor text"}

Keep the description concise and evocative, like flavor text on a trading card.`
      : `Combine these two story elements from different systems:
Element 1: "${element1.name}" (from ${element1.system})
Element 2: "${element2.name}" (from ${element2.system})

The combined element must belong to one of the two input systems:
- ${element1.system}
- ${element2.system}

IMPORTANT: The combined element must include ALL traits from both elements. Do not leave anything out - the result should be a complete fusion that preserves everything from both inputs.${rejectedSection}

Decide which of these two systems the combined element belongs to and create a name and description for it.
Respond with ONLY a JSON object in this format:
{"system": "system-name", "name": "Element Name", "description": "1-2 sentence trading card style flavor text"}

Use exactly one of the two system names listed above. Keep the description concise and evocative.`;

    // Log the prompt for inspection
    console.log('=== COMBINATION REQUEST ===');
    console.log('Element 1:', element1.name, `(${element1.system})`);
    console.log('Element 2:', element2.name, `(${element2.system})`);
    console.log('Same system:', isSameSystem);
    console.log('\n=== PROMPT ===');
    console.log(prompt);
    console.log('================\n');

    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      prompt,
      maxTokens: 150,
      temperature: 0.8,
    });

    // Parse response - both types now return JSON
    let resultName: string;
    let resultDescription: string;
    let resultSystem: string | undefined;

    try {
      const parsed = JSON.parse(text.trim());
      resultName = parsed.name;
      resultDescription = parsed.description || '';
      resultSystem = parsed.system; // Only present for cross-system
    } catch (e) {
      // Fallback if JSON parsing fails
      console.error('Failed to parse JSON response:', e);
      resultName = text.trim().replace(/^["']|["']$/g, '');
      resultDescription = '';
    }

    // Log the response
    console.log('=== RESPONSE ===');
    console.log('Raw:', text);
    console.log('Name:', resultName);
    console.log('Description:', resultDescription);
    if (resultSystem) console.log('System:', resultSystem);
    console.log('================\n');

    return NextResponse.json({
      name: resultName,
      description: resultDescription,
      system: resultSystem,
      success: true,
    });
  } catch (error) {
    console.error('Error combining elements:', error);
    return NextResponse.json(
      { error: 'Failed to combine elements', success: false },
      { status: 500 }
    );
  }
}
