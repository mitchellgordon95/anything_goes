import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

interface GenerateDescriptionRequest {
  name: string;
  system: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateDescriptionRequest = await req.json();
    const { name, system } = body;

    if (!name || !system) {
      return NextResponse.json(
        { error: 'Name and system are required' },
        { status: 400 }
      );
    }

    const prompt = `Create a trading card style flavor text description for this story element:

Element Name: "${name}"
System: ${system}

Write a concise, evocative 1-2 sentence description that captures the essence of this element. The description should be poetic and atmospheric, similar to flavor text on trading cards. Focus on the feeling, imagery, and narrative potential of this element.

Respond with ONLY the description text, nothing else.`;

    console.log('=== DESCRIPTION GENERATION REQUEST ===');
    console.log('Name:', name);
    console.log('System:', system);
    console.log('\n=== PROMPT ===');
    console.log(prompt);
    console.log('================\n');

    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      prompt,
      temperature: 0.8,
    });

    const description = text.trim();

    console.log('=== RESPONSE ===');
    console.log('Description:', description);
    console.log('================\n');

    return NextResponse.json({
      description,
      success: true,
    });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description', success: false },
      { status: 500 }
    );
  }
}
