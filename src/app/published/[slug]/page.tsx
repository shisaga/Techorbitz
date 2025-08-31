import { notFound } from 'next/navigation';
import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function PublishedSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    // Read the published HTML file
    const publishedDir = join(process.cwd(), 'public', 'published', resolvedParams.slug);
    const htmlPath = join(publishedDir, 'index.html');
    
    let htmlContent: string;
    try {
      htmlContent = await readFile(htmlPath, 'utf-8');
    } catch {
      // If file doesn't exist, return 404
      notFound();
    }

    // Return the HTML content directly
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{ width: '100%', height: '100vh' }}
      />
    );
    
  } catch (error) {
    console.error('Error loading published site:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    // In a real app, you'd fetch this from the database
    console.log('Generating metadata for:', resolvedParams.slug);
    return {
      title: 'Published Website',
      description: 'Website created with TechOrbitze AI Website Builder',
      robots: 'index, follow'
    };
  } catch {
    return {
      title: 'Site Not Found',
      description: 'The requested site could not be found'
    };
  }
}
