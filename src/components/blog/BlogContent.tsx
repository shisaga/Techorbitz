'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import React from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';

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

// Custom CodeBlock component with copy functionality
const CodeBlock = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback(async () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, []);

  return (
    <div className="relative group">
      <pre
        ref={codeRef}
        {...props}
        className="relative"
      >
        {children}
      </pre>
      <motion.button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  );
};

export default function BlogContent({ content }: BlogContentProps) {
  // Parse content and replace img tags and pre tags with React components
  const parsedContent = useMemo(() => {
    // Create a function to replace img tags and pre tags with React components
    const processContent = (html: string) => {
      const parts = [];
      let processedHtml = html;
      
      // Process pre tags first
      const preRegex = /<pre([^>]*?)>(.*?)<\/pre>/g;
      let preMatch;
      let preIndex = 0;
      
      while ((preMatch = preRegex.exec(html)) !== null) {
        // Add content before the pre tag
        if (preMatch.index > preIndex) {
          const beforeContent = html.slice(preIndex, preMatch.index);
          if (beforeContent.trim()) {
            parts.push(beforeContent);
          }
        }
        
        // Add the CodeBlock component
        const preProps = preMatch[1];
        const preContent = preMatch[2];
        parts.push(
          <CodeBlock key={`pre-${preMatch.index}`} dangerouslySetInnerHTML={{ __html: preContent }}>
            {preContent}
          </CodeBlock>
        );
        
        preIndex = preMatch.index + preMatch[0].length;
      }
      
      // Add remaining content after the last pre tag
      if (preIndex < html.length) {
        const remainingContent = html.slice(preIndex);
        if (remainingContent.trim()) {
          parts.push(remainingContent);
        }
      }
      
      // If no pre tags were found, process the original content
      if (parts.length === 0) {
        const imgRegex = /<img([^>]*?)src="([^"]*?)"([^>]*?)alt="([^"]*?)"([^>]*?)>/g;
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
          background: #f1f5f9;
          color: #e11d48;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }
        .rich-text-content pre {
          background: #0d1117;
          color: #e6edf3;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #30363d;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          position: relative;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .rich-text-content pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b47, #8b5cf6, #06b6d4);
          border-radius: 0.75rem 0.75rem 0 0;
        }
        .rich-text-content pre code {
          background: none;
          color: inherit;
          padding: 0;
          border: none;
          font-size: inherit;
          font-weight: inherit;
        }
        /* Syntax highlighting for common languages */
        .rich-text-content pre .token.comment,
        .rich-text-content pre .token.prolog,
        .rich-text-content pre .token.doctype,
        .rich-text-content pre .token.cdata {
          color: #7c3aed;
          font-style: italic;
        }
        .rich-text-content pre .token.punctuation {
          color: #e6edf3;
        }
        .rich-text-content pre .token.property,
        .rich-text-content pre .token.tag,
        .rich-text-content pre .token.boolean,
        .rich-text-content pre .token.number,
        .rich-text-content pre .token.constant,
        .rich-text-content pre .token.symbol,
        .rich-text-content pre .token.deleted {
          color: #f85149;
        }
        .rich-text-content pre .token.selector,
        .rich-text-content pre .token.attr-name,
        .rich-text-content pre .token.string,
        .rich-text-content pre .token.char,
        .rich-text-content pre .token.builtin,
        .rich-text-content pre .token.inserted {
          color: #a5d6ff;
        }
        .rich-text-content pre .token.operator,
        .rich-text-content pre .token.entity,
        .rich-text-content pre .token.url,
        .rich-text-content pre .language-css .token.string,
        .rich-text-content pre .style .token.string {
          color: #ffa657;
        }
        .rich-text-content pre .token.atrule,
        .rich-text-content pre .token.attr-value,
        .rich-text-content pre .token.keyword {
          color: #ff7b72;
          font-weight: 600;
        }
        .rich-text-content pre .token.function,
        .rich-text-content pre .token.class-name {
          color: #d2a8ff;
        }
        .rich-text-content pre .token.regex,
        .rich-text-content pre .token.important,
        .rich-text-content pre .token.variable {
          color: #ffd700;
        }
        /* Line numbers for better readability */
        .rich-text-content pre[data-line-numbers] {
          counter-reset: line;
        }
        .rich-text-content pre[data-line-numbers] > code {
          counter-increment: line;
        }
        .rich-text-content pre[data-line-numbers] > code::before {
          content: counter(line);
          position: absolute;
          left: -2.5rem;
          width: 2rem;
          text-align: right;
          color: #6e7681;
          font-size: 0.75rem;
          user-select: none;
        }
        /* Language indicator */
        .rich-text-content pre::after {
          content: attr(data-language);
          position: absolute;
          top: 0.75rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.1);
          color: #8b949e;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        /* Scrollbar styling for code blocks */
        .rich-text-content pre::-webkit-scrollbar {
          height: 8px;
        }
        .rich-text-content pre::-webkit-scrollbar-track {
          background: #161b22;
          border-radius: 4px;
        }
        .rich-text-content pre::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }
        .rich-text-content pre::-webkit-scrollbar-thumb:hover {
          background: #484f58;
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
