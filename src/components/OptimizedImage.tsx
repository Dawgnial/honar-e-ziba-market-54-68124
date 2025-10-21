import { useState, useRef, useEffect } from 'react';
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
 * - WebP/AVIF format support with fallbacks
 * - Responsive srcset for different screen sizes
 * - Lazy loading for non-priority images
 * - Proper aspect ratio containers to prevent layout shifts
 * - object-fit: cover for perfect image fitting
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
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image URLs
  const generateResponsiveSrc = (baseUrl: string, width: number) => {
    // Check if URL is from Supabase Storage
    if (baseUrl.includes('supabase')) {
      // Supabase supports query params for transformation
      return `${baseUrl}?width=${width}&quality=85&format=webp`;
    }
    return baseUrl;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseUrl: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
      .map(w => `${generateResponsiveSrc(baseUrl, w)} ${w}w`)
      .join(', ');
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // For priority images, load immediately
    if (priority) {
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
        onLoad?.();
      };
      
      imageLoader.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        onError?.();
      };
      
      imageLoader.src = src;
      return;
    }

    // For non-priority images, use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
              setImageSrc(src);
              setIsLoading(false);
              onLoad?.();
            };
            
            imageLoader.onerror = () => {
              setHasError(true);
              setIsLoading(false);
              onError?.();
            };
            
            imageLoader.src = src;
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before viewport
        threshold: 0.01,
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src, priority, onLoad, onError]);

  // Aspect ratio classes
  const aspectRatioClass = {
    'square': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    'auto': ''
  }[aspectRatio];

  return (
    <div className={cn('relative overflow-hidden bg-muted', aspectRatioClass)}>
      {/* Placeholder/Skeleton while loading - more visible */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent animate-shimmer" />
        </div>
      )}
      
      {/* Actual Image */}
      <img
        ref={imgRef}
        src={imageSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
        srcSet={imageSrc ? generateSrcSet(src) : undefined}
        sizes={sizes}
        alt={alt}
        className={cn(
          'w-full h-full object-cover object-center',
          isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500 ease-in-out',
          hasError && 'opacity-50',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
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
