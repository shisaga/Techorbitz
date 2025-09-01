'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Save, Eye, Wand2, Tag, Calendar, Image, 
  FileText, Settings, ArrowLeft, Sparkles,
  Brain, Zap, Target
} from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import InputField from '@/components/ui/InputField';
import RichTextEditor from '@/components/ui/RichTextEditor';
import AdminLayout from '@/components/admin/AdminLayout';


export default function BlogEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [coverImage, setCoverImage] = useState('');
  const [showcaseImage, setShowcaseImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isImprovingContent, setIsImprovingContent] = useState(false);
  const [isGeneratingCoverImage, setIsGeneratingCoverImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const generateAITitle = async () => {
    if (!content.trim()) {
      alert('Please write some content first before generating a title.');
      return;
    }
    
    setIsGeneratingTitle(true);
    try {
      const response = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, topic: category }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate title');
      }

      const data = await response.json();
      if (data.title) {
        setTitle(data.title);
      } else {
        alert('Failed to generate title. Please try again.');
      }
    } catch (error) {
      console.error('Error generating title:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        alert('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else {
        alert(errorMessage || 'Error generating title. Please check your OpenAI API key.');
      }
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const generateSEODescription = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and some content first before generating SEO description.');
      return;
    }
    
    setIsGeneratingSEO(true);
    try {
      const response = await fetch('/api/ai/generate-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate SEO description');
      }

      const data = await response.json();
      if (data.seoDescription) {
        setExcerpt(data.seoDescription);
        setSeoDescription(data.seoDescription);
      } else {
        alert('Failed to generate SEO description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating SEO description:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        alert('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else {
        alert(errorMessage || 'Error generating SEO description. Please check your OpenAI API key.');
      }
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  // Load existing post if editing
  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to load post');
      
      const post = await response.json();
      console.log('Loaded post data:', post); // Debug log
      
      setTitle(post.title || '');
      setContent(post.content || '');
      setExcerpt(post.excerpt || '');
      setStatus(post.status || 'DRAFT');
      setCoverImage(post.coverImage || '');
      setShowcaseImage(post.showcaseImage || '');
      setSeoTitle(post.seoTitle || '');
      setSeoDescription(post.seoDescription || '');
      setTags(post.tags?.map((tag: any) => tag.name) || []);
      setCategory(post.categories?.[0]?.name || '');
      
      console.log('Content set to:', post.content); // Debug log
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (publishStatus?: string) => {
    try {
      setIsSaving(true);
      
      const postData = {
        title,
        content,
        excerpt,
        status: publishStatus || status,
        coverImage,
        showcaseImage,
        seoTitle,
        seoDescription,
        category: category, // Send as category name, not categoryIds
        tagNames: tags,
        authorId: '1' // Will be handled by API to create/get admin user
      };

      const url = postId ? `/api/admin/posts/${postId}` : '/api/admin/posts';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to save post');
      
      const savedPost = await response.json();
      
      if (!postId) {
        // Redirect to edit mode for new posts
        router.push(`/admin/editor?postId=${savedPost.id}`);
      }
      
      alert('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const improveContentWithAI = async () => {
    if (!content.trim()) {
      alert('Please write some content first before improving it.');
      return;
    }
    
    setIsImprovingContent(true);
    try {
      const response = await fetch('/api/ai/improve-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to improve content');
      }

      const data = await response.json();
      if (data.improvedContent) {
        setContent(data.improvedContent);
      } else {
        alert('Failed to improve content. Please try again.');
      }
    } catch (error) {
      console.error('Error improving content:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        alert('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else {
        alert(errorMessage || 'Error improving content. Please check your OpenAI API key.');
      }
    } finally {
      setIsImprovingContent(false);
    }
  };

  const generateTagsWithAI = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and some content first before generating tags.');
      return;
    }
    
    try {
      const response = await fetch('/api/ai/generate-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate tags');
      }

      const result = await response.json();
      if (result && result.tags) {
        setTags(result.tags);
        if (result.category) {
          setCategory(result.category);
        }
      } else {
        alert('Failed to generate tags. Please try again.');
      }
    } catch (error) {
      console.error('Error generating tags:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        alert('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else {
        alert(errorMessage || 'Error generating tags. Please check your OpenAI API key.');
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, GIF)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCoverImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (url: string) => {
    if (!url.trim()) return;

    // Validate URL format
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid image URL');
      return;
    }

    // Check if it's an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const isImageUrl = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext) || 
      url.includes('data:image/') ||
      url.includes('blob:') ||
      url.includes('https://oaidalleapiprodscus.blob.core.windows.net/') // DALL-E images
    );

    if (!isImageUrl) {
      alert('Please enter a valid image URL (must end with .jpg, .png, .gif, etc.)');
      return;
    }

    // Additional validation for text content
    if (url.length > 200 && !url.includes('data:image/') && !url.includes('blob:') && !url.includes('https://')) {
      alert('This appears to be text content, not an image URL. Please provide a valid image URL.');
      return;
    }

    setCoverImage(url);
  };

  const generateAICoverImage = async () => {
    if (!title.trim()) {
      alert('Please add a title first before generating a cover image.');
      return;
    }
    
    setIsGeneratingCoverImage(true);
    try {
      const response = await fetch('/api/ai/generate-cover-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          content: content.substring(0, 500), // Send first 500 chars for context
          category 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate cover image');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setCoverImage(data.imageUrl);
      } else {
        alert('Failed to generate cover image. Please try again.');
      }
    } catch (error) {
      console.error('Error generating cover image:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        alert('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else {
        alert(errorMessage || 'Error generating cover image. Please check your OpenAI API key.');
      }
    } finally {
      setIsGeneratingCoverImage(false);
    }
  };

  return (
    <AdminLayout title="Blog Editor" subtitle="Create and edit your blog posts">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title Section with AI */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Blog Title
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateAITitle}
                  disabled={isGeneratingTitle}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {isGeneratingTitle ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700"></div>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  AI Generate
                </motion.button>
              </div>
              <InputField
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title..."
                size="lg"
                variant="default"
                className="w-full"
                inputClassName="text-xl font-semibold text-gray-900"
              />
            </div>

            {/* Cover Image - Main Blog Image */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Image (Main Blog Image)</h3>
              <p className="text-sm text-gray-600 mb-4">
                This image will be displayed at the top of your blog post as the main cover image.
              </p>
              
              {coverImage ? (
                <div className="relative">
                  <img 
                    src={coverImage} 
                    alt="Cover" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Upload */}
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-coral-primary transition-colors cursor-pointer">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload image file
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Or add image from URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-coral-primary placeholder-gray-500 text-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleImageUrl(e.currentTarget.value);
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleImageUrl(input.value);
                        }}
                        className="absolute inset-y-0 right-0 px-4 flex items-center bg-coral-primary text-white rounded-r-lg hover:bg-coral-secondary transition-colors font-medium text-sm"
                      >
                        Add URL
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supports: JPG, PNG, GIF, WebP formats
                    </p>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateAICoverImage}
                disabled={isGeneratingCoverImage}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isGeneratingCoverImage ? 'Generating...' : 'Generate AI Cover Image'}
              </motion.button>
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={improveContentWithAI}
                    disabled={isImprovingContent}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    {isImprovingContent ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    AI Improve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    AI Expand
                  </motion.button>
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-primary"></div>
                  <span className="ml-2">Loading content...</span>
                </div>
              ) : (
                <RichTextEditor
                  key={postId || 'new-post'} // Force re-render when postId changes
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your blog post..."
                  className="w-full"
                />
              )}
              <div className="mt-2 text-sm text-gray-500">
                Word count: {content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length} • 
                Reading time: ~{Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, '').split(' ').length / 200))} min
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  SEO Excerpt
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateSEODescription}
                  disabled={isGeneratingSEO}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                >
                  {isGeneratingSEO ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-700"></div>
                  ) : (
                    <Target className="w-4 h-4" />
                  )}
                  AI SEO
                </motion.button>
              </div>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a compelling excerpt for SEO and social sharing..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent outline-none text-gray-900"
              />
              <div className="mt-2 text-sm text-gray-500">
                {excerpt.length}/160 characters (optimal for meta description)
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="space-y-6"
          >
            {/* Publish Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <CustomSelect
                    options={[
                      { value: 'DRAFT', label: 'Draft', emoji: '📝' },
                      { value: 'PUBLISHED', label: 'Published', emoji: '✅' },
                      { value: 'SCHEDULED', label: 'Scheduled', emoji: '⏰' }
                    ]}
                    value={status}
                    onChange={setStatus}
                    placeholder="Select Status"
                    width="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <CustomSelect
                    options={[
                      { value: '', label: 'Select Category', emoji: '📂' },
                      { value: 'ai-technology', label: 'AI & Technology', emoji: '🤖' },
                      { value: 'web-development', label: 'Web Development', emoji: '💻' },
                      { value: 'cloud-infrastructure', label: 'Cloud & Infrastructure', emoji: '☁️' },
                      { value: 'mobile-development', label: 'Mobile Development', emoji: '📱' },
                      { value: 'database', label: 'Database', emoji: '🗄️' },
                      { value: 'healthcare', label: 'Healthcare & IoT', emoji: '🏥' },
                      { value: 'design', label: 'Design & UX', emoji: '🎨' }
                    ]}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select Category"
                    width="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateTagsWithAI}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Generate
                    </motion.button>
                  </div>
                  <input
                    type="text"
                    placeholder="Add tags (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent outline-none text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !tags.includes(value)) {
                          setTags([...tags, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-coral-light text-coral-primary rounded text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="text-coral-primary hover:text-coral-secondary"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-500" />
                AI Writing Assistant
              </h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateAITitle}
                  disabled={isGeneratingTitle}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">Generate Title Ideas</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateSEODescription}
                  disabled={isGeneratingSEO}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">Generate SEO Description</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={improveContentWithAI}
                  disabled={isImprovingContent}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">Improve Content</span>
                </motion.button>

                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    💡 <strong>AI Tips:</strong> Write your content first, then use AI to enhance titles, 
                    improve readability, and optimize for SEO.
                  </p>
                </div>
              </div>
            </div>



            {/* Showcase Image - Card Image */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Showcase Image (Card Image)</h3>
              <p className="text-sm text-gray-600 mb-4">
                This image will be displayed in blog cards, listings, and featured sections as the main thumbnail.
              </p>
              
              {showcaseImage ? (
                <div className="relative">
                  <img 
                    src={showcaseImage} 
                    alt="Showcase" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setShowcaseImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Upload */}
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-coral-primary transition-colors cursor-pointer">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload showcase image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setShowcaseImage(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Or add image from URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/showcase.jpg"
                        className="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-coral-primary placeholder-gray-500 text-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = e.currentTarget.value;
                            if (url.trim()) {
                              try {
                                new URL(url);
                                setShowcaseImage(url);
                              } catch {
                                alert('Please enter a valid image URL');
                              }
                            }
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          const url = input.value;
                          if (url.trim()) {
                            try {
                              new URL(url);
                              setShowcaseImage(url);
                            } catch {
                              alert('Please enter a valid image URL');
                            }
                          }
                        }}
                        className="absolute inset-y-0 right-0 px-4 flex items-center bg-coral-primary text-white rounded-r-lg hover:bg-coral-secondary transition-colors font-medium text-sm"
                      >
                        Add URL
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Recommended: 1200x630px for optimal display
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SEO Preview */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Preview</h3>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-blue-600 text-lg font-medium mb-1 truncate">
                  {title || 'Your Blog Title Here'}
                </div>
                <div className="text-green-600 text-sm mb-2">
                  techonigx.com/blog/{title ? title.toLowerCase().replace(/\s+/g, '-') : 'your-post-slug'}
                </div>
                <div className="text-gray-600 text-sm line-clamp-2">
                  {excerpt || 'Your SEO description will appear here. Make it compelling and under 160 characters.'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar continues... */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Words</span>
                  <span className="text-sm font-medium">{content.split(' ').filter(w => w.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Characters</span>
                  <span className="text-sm font-medium">{content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reading Time</span>
                  <span className="text-sm font-medium">~{Math.max(1, Math.ceil(content.split(' ').length / 200))} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SEO Score</span>
                  <span className="text-sm font-medium text-green-600">85/100</span>
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => savePost('PUBLISHED')}
                  disabled={isSaving}
                  className="w-full bg-coral-primary text-white py-3 rounded-lg font-medium hover:bg-coral-secondary transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Publishing...' : 'Publish Now'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => savePost('SCHEDULED')}
                  disabled={isSaving}
                  className="w-full border border-coral-primary text-coral-primary py-3 rounded-lg font-medium hover:bg-coral-light transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Scheduling...' : 'Schedule for Later'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => savePost('DRAFT')}
                  disabled={isSaving}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Blog Post Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl mx-auto">
                  {/* Cover Image */}
                  {(coverImage || showcaseImage) && (
                    <div className="mb-8">
                      <img 
                        src={showcaseImage || coverImage} 
                        alt="Cover" 
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {title || 'Your Blog Title Here'}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-black mb-8">
                    <span>By Admin</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>~{Math.max(1, Math.ceil(content.split(' ').length / 200))} min read</span>
                    {category && (
                      <>
                        <span>•</span>
                        <span className="bg-coral-primary text-white px-2 py-1 rounded-full text-xs">
                          {category}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex gap-2 mb-8">
                      {tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <div 
                    className="prose prose-lg max-w-none text-black [&_*]:text-black [&_p]:text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_li]:text-black [&_blockquote]:text-black [&_strong]:text-black [&_em]:text-black"
                    dangerouslySetInnerHTML={{ __html: content || '<p>Your content will appear here...</p>' }}
                  />

                  {/* Excerpt */}
                  {excerpt && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-black mb-2">Summary</h3>
                      <p className="text-black">{excerpt}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
