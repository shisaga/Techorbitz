'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import React from 'react';
import Image from 'next/image';

interface BlogContentProps {
  content: string;
}

// Custom Image component for blog content
const BlogImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative my-6 overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-coral-light to-coral-primary/20 animate-pulse rounded-lg" />
      )}
      <Image
        src={hasError ? '/images/blog-placeholder.jpg' : src}
        alt={alt}
        width={800}
        height={400}
        className={`transition-opacity duration-300 rounded-lg shadow-lg ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </div>
  );
};

export default function BlogContent({ content }: BlogContentProps) {
  // Parse content and replace img tags with React components
  const parsedContent = useMemo(() => {
    // Create a function to replace img tags with React components
    const processContent = (html: string) => {
      const imgRegex = /<img([^>]*?)src="([^"]*?)"([^>]*?)alt="([^"]*?)"([^>]*?)>/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = imgRegex.exec(html)) !== null) {
        // Add text before the image
        if (match.index > lastIndex) {
          parts.push(html.slice(lastIndex, match.index));
        }
        
        // Add the image component
        const src = match[2];
        const alt = match[4];
        parts.push(
          <BlogImage key={match.index} src={src} alt={alt} />
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < html.length) {
        parts.push(html.slice(lastIndex));
      }
      
      return parts;
    };

    return processContent(content);
  }, [content]);

  // Optimize animations
  const fadeInUp = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }), []);

  return (
    <div className="rich-text-content max-w-none">
      <style jsx>{`
        .rich-text-content {
          line-height: 1.7;
          color: #374151;
          contain: content;
        }
        .rich-text-content h1 {
          color: #1f2937;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
          margin-top: 2rem;
        }
        .rich-text-content h2 {
          color: #374151;
          font-size: 1.875rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          margin-top: 2rem;
        }
        .rich-text-content h3 {
          color: #4b5563;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
        }
        .rich-text-content p {
          margin-bottom: 1.5rem;
          color: #374151;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        .rich-text-content strong {
          color: #1f2937;
          font-weight: 700;
        }
        .rich-text-content em {
          color: #7c3aed;
          font-style: italic;
        }
        .rich-text-content blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          font-style: italic;
          color: #4b5563;
        }
        .rich-text-content ul, .rich-text-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .rich-text-content li {
          margin-bottom: 0.5rem;
          color: #374151;
          line-height: 1.6;
        }
        .rich-text-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .rich-text-content th {
          background: #f3f4f6;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }
        .rich-text-content td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }
        .rich-text-content tr:nth-child(even) {
          background: #f9fafb;
        }
        .rich-text-content a {
          color: #ff6b47;
          text-decoration: none;
          font-weight: 600;
        }
        .rich-text-content a:hover {
          color: #e55a3a;
          text-decoration: underline;
        }
        .rich-text-content code {
          background: #f3f4f6;
          color: #ff6b47;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        .rich-text-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .rich-text-content pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        .rich-text-content img {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 1.5rem 0;
          max-width: 100%;
          height: auto;
        }
      `}</style>
      <motion.div 
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        {parsedContent.map((part, index) => {
          if (typeof part === 'string') {
            return (
              <div 
                key={index}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            );
          }
          return part;
        })}
      </motion.div>
      
      {/* Reading Time Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 p-6 bg-gradient-to-r mb-2 from-coral-light/50 to-blue-50/50 rounded-2xl border border-coral-primary/20 text-center"
      >
        <div className="text-coral-primary font-semibold mb-2">📚 Article Complete</div>
        <p className="text-gray-600">
          Thanks for reading! Found this helpful? Share it with your network.
        </p>
      </motion.div>
    </div>
  );
}
