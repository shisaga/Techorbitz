import { NextRequest, NextResponse } from 'next/server';
import { improveContent } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const improvedContent = await improveContent(content);
    
    if (!improvedContent) {
      return NextResponse.json(
        { error: 'Failed to improve content' },
        { status: 500 }
      );
    }

    return NextResponse.json({ improvedContent });

  } catch (error) {
    console.error('Error improving content:', error);
    return NextResponse.json(
      { error: 'Failed to improve content. Please check your OpenAI API key.' },
      { status: 500 }
    );
  }
}
