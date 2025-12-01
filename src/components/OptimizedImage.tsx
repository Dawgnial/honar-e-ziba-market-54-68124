import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // For main images - no lazy load
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: 'square' | '16/9' | '4/3' | 'auto';
}

/**
 * Optimized Image Component with:
 * - Fast loading with native browser lazy loading
 * - Priority loading for above-the-fold images
 * - Proper aspect ratio containers to prevent layout shifts
 * - Minimal transitions for instant display
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  onLoad,
  onError,
  aspectRatio = 'square'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Aspect ratio classes
  const aspectRatioClass = {
    'square': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    'auto': ''
  }[aspectRatio];

  return (
    <div className={cn('relative overflow-hidden bg-muted/30', aspectRatioClass)}>
      {/* Subtle loading background - only show while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/20 animate-pulse" />
      )}
      
      {/* Actual Image - fast display with minimal transition */}
      <img
        src={src}
        sizes={sizes}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        className={cn(
          'relative w-full h-full object-cover object-center transition-opacity duration-150',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground p-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">خطا در بارگذاری تصویر</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
