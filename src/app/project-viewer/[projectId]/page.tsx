'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ProjectViewer({ params }: { params: Promise<{ projectId: string }> }) {
  const [project, setProject] = useState<Project | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    // Resolve the async params
    params.then(resolvedParams => {
      setProjectId(resolvedParams.projectId);
    });
  }, [params]);

  const loadProject = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get preview URL
      const previewResponse = await fetch(`/api/ai-website-builder/preview/${projectId}`);
      if (!previewResponse.ok) {
        throw new Error('Failed to get preview URL');
      }

      const previewData = await previewResponse.json();
      setPreviewUrl(previewData.previewUrl);

      // Load project metadata
      const projectResponse = await fetch(`/api/ai-website-builder/project/${projectId}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setProject(projectData);
      }
    } catch (err) {
      setError('Failed to load project preview');
      console.error('Error loading project:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId, loadProject]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Loading Project Preview</h2>
              <p className="text-gray-600">Starting the preview server...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Project</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={loadProject} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Link href="/ai-website-builder">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Builder
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/ai-website-builder">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Builder
              </Button>
            </Link>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">{project?.name || 'Project Preview'}</h1>
            <p className="text-gray-600">{project?.description}</p>
          </div>
        </div>

        {/* Preview Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.open(previewUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button 
                variant="outline"
                onClick={loadProject}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Preview URL: <code className="bg-gray-100 px-2 py-1 rounded">{previewUrl}</code>
            </p>
          </CardContent>
        </Card>

        {/* Direct Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-white rounded-lg border overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

