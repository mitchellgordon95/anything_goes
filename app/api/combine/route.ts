import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

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

Create a brief 2-4 word name for what emerges when these combine.
The result should feel like a natural evolution or synthesis.
Only respond with the name, nothing else.`
      : `Combine these two story elements from different systems:
Element 1: "${element1.name}" (from ${element1.system})
Element 2: "${element2.name}" (from ${element2.system})

Find a poetic or metaphorical connection between them.
Create a 2-4 word name that captures this synthesis.
Be creative - even unusual combinations can create something meaningful.
Only respond with the name, nothing else.`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      maxTokens: 50,
      temperature: 0.8,
    });

    // Clean up the response
    const resultName = text.trim().replace(/^["']|["']$/g, '');

    return NextResponse.json({
      name: resultName,
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
