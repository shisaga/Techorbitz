import ProjectViewerClient from './client';

export default async function ProjectViewer({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  
  return <ProjectViewerClient projectId={projectId} />;
}

