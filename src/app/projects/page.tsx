'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-website-builder/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPreviewUrl = (projectId: string) => {
    // Generate preview URL based on project ID
    const hash = projectId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const port = 3001 + Math.abs(hash) % 999;
    return `http://localhost:${port}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Loading Projects</h2>
              <p className="text-gray-600">Fetching your projects...</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/ai-website-builder">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Builder
              </Button>
            </Link>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <p className="text-gray-600">View and manage your AI-generated websites</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
                <p className="text-gray-600 mb-4">You haven't created any projects yet.</p>
                <Link href="/ai-website-builder">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-500">{project.type.toUpperCase()}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => window.open(getPreviewUrl(project.id), '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/project-viewer/${project.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Full Preview
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

