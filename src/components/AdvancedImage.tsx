import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: 'square' | '16/9' | '4/3' | 'auto';
}

/**
 * Advanced Image Component with:
 * - WebP format support with fallback
 * - Responsive srcset for different screen sizes
 * - Blur placeholder for smooth loading
 * - Native lazy loading
 * - Priority loading for above-the-fold
 * - IntersectionObserver for precise loading control
 */
const AdvancedImage = ({ 
  src, 
  alt, 
  className,
  priority = false,
  blurDataURL,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  onLoad,
  onError,
  aspectRatio = 'square'
}: AdvancedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    const element = document.getElementById(`img-${src}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate WebP and fallback URLs
  const getImageUrls = (url: string) => {
    const isExternal = url.startsWith('http');
    if (isExternal) return { webp: url, fallback: url };
    
    const ext = url.split('.').pop();
    const base = url.replace(`.${ext}`, '');
    return {
      webp: `${base}.webp`,
      fallback: url
    };
  };

  const { webp, fallback } = getImageUrls(src);

  // Aspect ratio classes
  const aspectRatioClass = {
    'square': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    'auto': ''
  }[aspectRatio];

  return (
    <div 
      id={`img-${src}`}
      className={cn('relative overflow-hidden bg-muted/30', aspectRatioClass)}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && !hasError && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          aria-hidden="true"
        />
      )}

      {/* Loading shimmer */}
      {!isLoaded && !hasError && !blurDataURL && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 animate-shimmer bg-[length:200%_100%]" />
      )}
      
      {/* Actual Image with WebP support */}
      {isInView && (
        <picture>
          <source srcSet={webp} type="image/webp" sizes={sizes} />
          <img
            src={fallback}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            sizes={sizes}
            className={cn(
              'relative w-full h-full object-cover object-center transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              hasError && 'opacity-50',
              className
            )}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
          />
        </picture>
      )}
      
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

export default AdvancedImage;
