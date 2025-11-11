'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Optimized Image Component with lazy loading and blur placeholder
 * Automatically handles Next.js Image optimization
 */
export default function ImageOptimized({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL
}: ImageOptimizedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="0%" />
          <stop stop-color="#edeef1" offset="20%" />
          <stop stop-color="#f6f7f8" offset="40%" />
          <stop stop-color="#f6f7f8" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(
    shimmer(width || 700, height || 475)
  )}`;

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width: width || '100%', height: height || 'auto' }}
      >
        <div className="text-center p-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isLoading ? 'animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        quality={quality}
        priority={priority}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        className={className}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

/**
 * Responsive Image Component
 * Automatically adjusts to container size
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  priority = false,
  quality = 75
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
}) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <ImageOptimized
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        className="object-cover rounded-lg"
      />
    </div>
  );
}

/**
 * Avatar Image Component
 * Optimized for profile pictures
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  className = ''
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <ImageOptimized
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      quality={90}
    />
  );
}

/**
 * Blog Post Cover Image
 * Optimized for blog post headers
 */
export function BlogCoverImage({
  src,
  alt,
  priority = false
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      aspectRatio="16/9"
      priority={priority}
      quality={85}
      className="mb-8"
    />
  );
}

