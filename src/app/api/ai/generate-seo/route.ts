import { NextRequest, NextResponse } from 'next/server';
import { generateSEODescription } from '@/lib/ai';

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

    const seoDescription = await generateSEODescription(title, content);
    
    if (!seoDescription) {
      return NextResponse.json(
        { error: 'Failed to generate SEO description' },
        { status: 500 }
      );
    }

    return NextResponse.json({ seoDescription });

  } catch (error) {
    console.error('Error generating SEO description:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO description. Please check your OpenAI API key.' },
      { status: 500 }
    );
  }
}
