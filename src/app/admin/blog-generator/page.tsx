'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface GeneratedPost {
  title: string;
  slug: string;
  url: string;
  publishedAt: string;
}

export default function BlogGeneratorAdmin() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [postCount, setPostCount] = useState(2);
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    posts: GeneratedPost[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePosts = async () => {
    setIsGenerating(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: postCount }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to generate blog posts');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Blog Generator</h1>
          <p className="text-gray-600">
            Generate and publish AI-powered blog posts to your MongoDB database
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="postCount">Number of Posts</Label>
                <Input
                  id="postCount"
                  type="number"
                  min="1"
                  max="5"
                  value={postCount}
                  onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={generatePosts}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Posts...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate & Publish Posts
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status & Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Success</span>
                    </div>
                    <p className="text-green-600 mt-1">{results.message}</p>
                  </div>

                  {results.posts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Published Posts:</h3>
                      <div className="space-y-3">
                        {results.posts.map((post, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                          >
                            <h4 className="font-medium text-gray-900 mb-1">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>Slug: {post.slug}</span>
                              <span>•</span>
                              <span>
                                {new Date(post.publishedAt).toLocaleString()}
                              </span>
                            </div>
                            {post.url && (
                              <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Post
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No posts generated yet</p>
                  <p className="text-sm">Click "Generate & Publish Posts" to start</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Environment Variables</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• OPENAI_API_KEY</li>
                  <li>• NEWSAPI_KEY</li>
                  <li>• STABILITY_API_KEY (optional)</li>
                  <li>• PEXELS_API_KEY (optional)</li>
                  <li>• NEXT_PUBLIC_SITE_URL (optional)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scheduling</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• POSTS_PER_DAY: {process.env.NEXT_PUBLIC_POSTS_PER_DAY || '2'}</li>
                  <li>• PUBLISH_TIMES: {process.env.NEXT_PUBLIC_PUBLISH_TIMES || '08:00,20:00'}</li>
                  <li>• Cron endpoint: /api/cron/blog-generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
