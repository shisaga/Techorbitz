'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import React from 'react';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="rich-text-content max-w-none">
      <style jsx>{`
        .rich-text-content {
          line-height: 1.7;
          color: #374151;
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
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
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
