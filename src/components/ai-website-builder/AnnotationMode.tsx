'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Edit, Image, Plus, MessageSquare, Save, RotateCcw } from 'lucide-react';

interface AnnotationData {
  elementId: string;
  elementType: string;
  parentId?: string;
  currentContent?: string;
  action: 'comment' | 'update-text' | 'add-section' | 'replace-image';
  instruction: string;
  newContent?: string;
  imageFile?: File;
}

interface AnnotationModeProps {
  projectId: string;
  previewUrl: string;
  onAnnotationSubmit: (annotation: AnnotationData) => void;
  onClose: () => void;
}

export default function AnnotationMode({ projectId, previewUrl, onAnnotationSubmit, onClose }: AnnotationModeProps) {
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [annotationDialog, setAnnotationDialog] = useState(false);
  const [annotationData, setAnnotationData] = useState<AnnotationData | null>(null);
  const [action, setAction] = useState<'comment' | 'update-text' | 'add-section' | 'replace-image'>('comment');
  const [instruction, setInstruction] = useState('');
  const [newContent, setNewContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isAnnotationMode) {
      setupAnnotationMode();
    } else {
      cleanupAnnotationMode();
    }
  }, [isAnnotationMode]);

  const setupAnnotationMode = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Add annotation styles
    const style = iframeDoc.createElement('style');
    style.textContent = `
      .annotation-highlight {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
        position: relative !important;
      }
      .annotation-highlight:hover {
        outline-color: #1d4ed8 !important;
        background-color: rgba(59, 130, 246, 0.1) !important;
      }
      .annotation-popup {
        position: absolute;
        top: -40px;
        left: 0;
        background: #1f2937;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        white-space: nowrap;
      }
    `;
    iframeDoc.head.appendChild(style);

    // Add click handlers to all elements
    const addClickHandlers = () => {
      const elements = iframeDoc.querySelectorAll('*');
      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.addEventListener('click', handleElementClick);
          element.addEventListener('mouseenter', handleElementHover);
          element.addEventListener('mouseleave', handleElementLeave);
        }
      });
    };

    addClickHandlers();
  };

  const cleanupAnnotationMode = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Remove annotation styles and handlers
    const elements = iframeDoc.querySelectorAll('*');
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.classList.remove('annotation-highlight');
        element.removeEventListener('click', handleElementClick);
        element.removeEventListener('mouseenter', handleElementHover);
        element.removeEventListener('mouseleave', handleElementLeave);
      }
    });

    // Remove annotation styles
    const annotationStyle = iframeDoc.querySelector('style');
    if (annotationStyle) {
      annotationStyle.remove();
    }
  };

  const handleElementClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const element = e.target as HTMLElement;
    setSelectedElement(element);
    
    // Generate unique ID if not exists
    if (!element.id) {
      element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const annotationData: AnnotationData = {
      elementId: element.id,
      elementType: element.tagName.toLowerCase(),
      parentId: element.parentElement?.id || undefined,
      currentContent: element.textContent || undefined,
      action: 'comment',
      instruction: '',
    };

    setAnnotationData(annotationData);
    setAnnotationDialog(true);
  };

  const handleElementHover = (e: Event) => {
    const element = e.target as HTMLElement;
    element.classList.add('annotation-highlight');
    
    // Show popup with element info
    const popup = document.createElement('div');
    popup.className = 'annotation-popup';
    popup.textContent = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}`;
    element.appendChild(popup);
  };

  const handleElementLeave = (e: Event) => {
    const element = e.target as HTMLElement;
    element.classList.remove('annotation-highlight');
    
    // Remove popup
    const popup = element.querySelector('.annotation-popup');
    if (popup) {
      popup.remove();
    }
  };

  const handleAnnotationSubmit = () => {
    if (!annotationData || !instruction.trim()) return;

    const finalAnnotation: AnnotationData = {
      ...annotationData,
      action,
      instruction,
      newContent: action === 'update-text' || action === 'add-section' ? newContent : undefined,
      imageFile: action === 'replace-image' ? imageFile || undefined: undefined,
    };

    onAnnotationSubmit(finalAnnotation);
    setAnnotationDialog(false);
    setInstruction('');
    setNewContent('');
    setImageFile(null);
    setAction('comment');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <CardTitle>Annotation Mode - Edit Your Website</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnnotationMode(!isAnnotationMode)}
              >
                {isAnnotationMode ? 'Disable' : 'Enable'} Annotation Mode
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {isAnnotationMode 
              ? 'Click on any element to edit it. Hover to see element information.'
              : 'Enable annotation mode to start editing your website interactively.'
            }
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border rounded-lg"
              title="Website Preview"
            />
          </div>
        </CardContent>

        <Dialog open={annotationDialog} onOpenChange={setAnnotationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Element</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Element</Label>
                <p className="text-sm text-gray-600">
                  {annotationData?.elementType} {annotationData?.elementId && `#${annotationData.elementId}`}
                </p>
              </div>

              <div>
                <Label>Current Content</Label>
                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                  {annotationData?.currentContent || 'No text content'}
                </p>
              </div>

              <div>
                <Label>Action</Label>
                <Select value={action} onValueChange={(value: any) => setAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Add Comment
                      </div>
                    </SelectItem>
                    <SelectItem value="update-text">
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Update Text
                      </div>
                    </SelectItem>
                    <SelectItem value="add-section">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Section
                      </div>
                    </SelectItem>
                    <SelectItem value="replace-image">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Replace Image
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Instruction</Label>
                <Textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="What do you want to change here?"
                  rows={3}
                />
              </div>

              {(action === 'update-text' || action === 'add-section') && (
                <div>
                  <Label>New Content</Label>
                  <Textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter the new content..."
                    rows={3}
                  />
                </div>
              )}

              {action === 'replace-image' && (
                <div>
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAnnotationSubmit} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Submit
                </Button>
                <Button variant="outline" onClick={() => setAnnotationDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
