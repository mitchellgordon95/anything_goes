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
}

export async function POST(req: NextRequest) {
  try {
    const body: CombineRequest = await req.json();
    const { element1, element2 } = body;

    if (!element1 || !element2) {
      return NextResponse.json(
        { error: 'Both elements are required' },
        { status: 400 }
      );
    }

    const isSameSystem = element1.system === element2.system;

    // Generate prompt based on whether it's same-system or cross-system
    const prompt = isSameSystem
      ? `Combine these two story elements into a new, more complex element:
Element 1: "${element1.name}" (from ${element1.system})
Element 2: "${element2.name}" (from ${element2.system})

Create a name for what emerges when these combine. The result should feel like a natural evolution or synthesis.
Only respond with the name, nothing else.`
      : `Combine these two story elements from different systems:
Element 1: "${element1.name}" (from ${element1.system})
Element 2: "${element2.name}" (from ${element2.system})

The combined element must belong to one of the two input systems:
- ${element1.system}
- ${element2.system}

Decide which of these two systems the combined element belongs to and create a name for it.
Respond with ONLY a JSON object in this format:
{"system": "system-name", "name": "Element Name"}

Use exactly one of the two system names listed above.`;

    // Log the prompt for inspection
    console.log('=== COMBINATION REQUEST ===');
    console.log('Element 1:', element1.name, `(${element1.system})`);
    console.log('Element 2:', element2.name, `(${element2.system})`);
    console.log('Same system:', isSameSystem);
    console.log('\n=== PROMPT ===');
    console.log(prompt);
    console.log('================\n');

    const { text } = await generateText({
      model: anthropic('claude-3-5-haiku-20241022'),
      prompt,
      maxTokens: 100,
      temperature: 0.8,
    });

    // Parse response based on combination type
    let resultName: string;
    let resultSystem: string | undefined;

    if (isSameSystem) {
      // Simple text response
      resultName = text.trim().replace(/^["']|["']$/g, '');
    } else {
      // JSON response for cross-system
      try {
        const parsed = JSON.parse(text.trim());
        resultName = parsed.name;
        resultSystem = parsed.system;
      } catch (e) {
        // Fallback if JSON parsing fails
        console.error('Failed to parse JSON response:', e);
        resultName = text.trim().replace(/^["']|["']$/g, '');
      }
    }

    // Log the response
    console.log('=== RESPONSE ===');
    console.log('Raw:', text);
    console.log('Name:', resultName);
    if (resultSystem) console.log('System:', resultSystem);
    console.log('================\n');

    return NextResponse.json({
      name: resultName,
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
