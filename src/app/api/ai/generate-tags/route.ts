import { NextRequest, NextResponse } from 'next/server';
import { generateTags } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const result = await generateTags(title, content);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate tags' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error generating tags:', error);
    return NextResponse.json(
      { error: 'Failed to generate tags. Please check your OpenAI API key.' },
      { status: 500 }
    );
  }
}
