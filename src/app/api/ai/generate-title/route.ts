import { NextRequest, NextResponse } from 'next/server';
import { generateBlogTitle } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, topic } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const title = await generateBlogTitle(content, topic);
    
    if (!title) {
      return NextResponse.json(
        { error: 'Failed to generate title' },
        { status: 500 }
      );
    }

    return NextResponse.json({ title });

  } catch (error) {
    console.error('Error generating title:', error);
    return NextResponse.json(
      { error: 'Failed to generate title. Please check your OpenAI API key.' },
      { status: 500 }
    );
  }
}
