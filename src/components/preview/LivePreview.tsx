'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Upload, 
  Smartphone, 
  Tablet, 
  Monitor,
  Loader,
  Check,
  AlertCircle
} from 'lucide-react';

interface Comment {
  id: string;
  elementId: string;
  elementType: string;
  comment: string;
  requestedChange: string;
  xPosition: number;
  yPosition: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  aiResponse?: string;
  createdAt: string;
}

interface LivePreviewProps {
  projectId: string;
  html: string;
  css: string;
  js?: string;
  onCommentAdded: (comment: Comment) => void;
  onPublish: () => void;
  canPublish: boolean;
  revisionsUsed: number;
  maxRevisions: number;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export default function LivePreview({
  projectId,
  html,
  css,
  js,
  onCommentAdded,
  onPublish,
  canPublish,
  revisionsUsed,
  maxRevisions
}: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{
    id: string;
    type: string;
    x: number;
    y: number;
  } | null>(null);
  const [comment, setComment] = useState('');
  const [requestedChange, setRequestedChange] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const viewModeStyles = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' }
  };

  // Fetch existing comments
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/website-builder/comments?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Create iframe content
  const createIframeContent = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Preview</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          [data-element-id] { 
            position: relative; 
            cursor: pointer;
            transition: all 0.2s ease;
          }
          [data-element-id]:hover { 
            outline: 2px solid #3b82f6; 
            outline-offset: 2px;
          }
          .comment-marker {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Add unique IDs to elements for commenting
          document.addEventListener('DOMContentLoaded', function() {
            const elements = document.querySelectorAll('h1, h2, h3, p, button, img, div, section, nav, footer');
            elements.forEach((el, index) => {
              if (!el.hasAttribute('data-element-id')) {
                el.setAttribute('data-element-id', 'element-' + index);
              }
            });

            // Handle element clicks
            document.addEventListener('click', function(e) {
              e.preventDefault();
              const target = e.target.closest('[data-element-id]');
              if (target) {
                const rect = target.getBoundingClientRect();
                const elementData = {
                  id: target.getAttribute('data-element-id'),
                  type: target.tagName.toLowerCase(),
                  x: e.clientX,
                  y: e.clientY,
                  text: target.textContent?.substring(0, 100) || '',
                  tagName: target.tagName
                };
                window.parent.postMessage({ type: 'elementClicked', data: elementData }, '*');
              }
            });
          });
          ${js || ''}
        </script>
      </body>
      </html>
    `;
  };

  // Handle iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'elementClicked') {
        const { id, type, x, y } = event.data.data;
        setSelectedElement({ id, type, x, y });
        setShowCommentDialog(true);
        setIsImageUpload(type === 'img');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!selectedElement || (!comment.trim() && !requestedChange.trim())) return;
    if (revisionsUsed >= maxRevisions) {
      alert('You have reached your revision limit. Please upgrade your plan.');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('elementId', selectedElement.id);
      formData.append('elementType', selectedElement.type);
      formData.append('comment', comment);
      formData.append('requestedChange', requestedChange);
      formData.append('xPosition', selectedElement.x.toString());
      formData.append('yPosition', selectedElement.y.toString());
      
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('/api/website-builder/comments', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newComment: Comment = {
          id: data.commentId,
          elementId: selectedElement.id,
          elementType: selectedElement.type,
          comment,
          requestedChange,
          xPosition: selectedElement.x,
          yPosition: selectedElement.y,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
        
        setComments(prev => [newComment, ...prev]);
        onCommentAdded(newComment);
        
        // Reset form
        setComment('');
        setRequestedChange('');
        setUploadedImage(null);
        setShowCommentDialog(false);
        setSelectedElement(null);
        
        // Process the comment automatically
        await processComment(data.commentId);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Process comment with AI
  const processComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/website-builder/comments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      if (response.ok) {
        // Refresh comments to get updated status
        await fetchComments();
        // Reload preview to show changes
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
      }
    } catch (error) {
      console.error('Error processing comment:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setRequestedChange(`Replace this image with the uploaded file: ${file.name}`);
    }
  };

  const getStatusIcon = (status: Comment['status']) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <X className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Website Preview</h2>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded-lg ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded-lg ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <Tablet className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded-lg ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Revisions: {revisionsUsed}/{maxRevisions}
              </div>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comments ({comments.length})</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPublish}
                disabled={!canPublish}
                className={`px-6 py-2 rounded-lg font-medium ${
                  canPublish 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Publish Website
              </motion.button>
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex justify-center">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={viewModeStyles[viewMode]}
            >
              <iframe
                ref={iframeRef}
                srcDoc={createIframeContent()}
                className="w-full h-full border-0"
                title="Website Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comments Sidebar */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 bg-white border-l border-gray-200 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Comments & Changes</h3>
              <p className="text-sm text-gray-600">Click any element to add feedback</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(comment.status)}
                      <span className="text-sm font-medium">#{comment.elementId}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
                  <p className="text-sm font-medium text-blue-600">{comment.requestedChange}</p>
                  
                  {comment.aiResponse && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      {comment.aiResponse}
                    </div>
                  )}
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet</p>
                  <p className="text-sm">Click any element to add feedback</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Dialog */}
      <AnimatePresence>
        {showCommentDialog && selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Comment</h3>
                <button
                  onClick={() => setShowCommentDialog(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Element: {selectedElement.type}#{selectedElement.id}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What would you like to change about this element?"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Change Request
                  </label>
                  <textarea
                    value={requestedChange}
                    onChange={(e) => setRequestedChange(e.target.value)}
                    placeholder="Be specific about what changes you want..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={2}
                  />
                </div>

                {isImageUpload && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload New Image
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <Upload className="w-5 h-5 mx-auto mb-2" />
                      {uploadedImage ? uploadedImage.name : 'Click to upload image'}
                    </button>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCommentDialog(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment || (!comment.trim() && !requestedChange.trim())}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmittingComment ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
