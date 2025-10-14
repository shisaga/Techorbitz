'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link, Mail, Share2 } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SocialShare({ url, title, description, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || '');
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${shareTitle}&body=${shareDescription}%20${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openShareWindow = (url: string) => {
    window.open(
      url,
      'share-dialog',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <div className={`social-share ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Share this content:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Facebook Share */}
        <button
          onClick={() => openShareWindow(shareLinks.facebook)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </button>

        {/* Twitter Share */}
        <button
          onClick={() => openShareWindow(shareLinks.twitter)}
          className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
          <span>Twitter</span>
        </button>

        {/* LinkedIn Share */}
        <button
          onClick={() => openShareWindow(shareLinks.linkedin)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </button>

        {/* Email Share */}
        <button
          onClick={() => window.location.href = shareLinks.email}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          aria-label="Share via Email"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label="Copy link"
        >
          <Link className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>

      {/* Native Share API (for mobile devices) */}
      {typeof window !== 'undefined' && navigator.share && (
        <button
          onClick={() => {
            navigator.share({
              title,
              text: description,
              url: shareUrl,
            });
          }}
          className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Native Share</span>
        </button>
      )}
    </div>
  );
}
