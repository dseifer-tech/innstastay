'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BLUR_PLACEHOLDER } from '@/lib/constants';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;        // styles for the <img>
  wrapperClassName?: string; // styles for the wrapper div
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  wrapperClassName,
  priority = false,
  fill = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  
  // Check if this is a proxy URL
  const isProxy = src.startsWith('/api/hotel-images');
  
  // Use blur placeholder for better perceived performance
  const effectiveBlurDataURL = blurDataURL || (placeholder === 'blur' ? BLUR_PLACEHOLDER : undefined);

  // Fallback for error state
  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${wrapperClassName ?? ''}`}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${wrapperClassName ?? ''}`}
      style={!fill ? { width, height } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={effectiveBlurDataURL}
        unoptimized={isProxy}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={style}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setHasError(true);
        }}
        className={className} // applies directly to the <img>
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
