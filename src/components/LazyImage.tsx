import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  placeholderSrc = '/placeholder.svg',
  onLoad,
  onError 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentImg = entry.target as HTMLImageElement;
            
            const handleLoad = () => {
              setIsLoaded(true);
              onLoad?.();
            };
            
            const handleError = () => {
              setHasError(true);
              onError?.();
            };
            
            currentImg.addEventListener('load', handleLoad, { once: true });
            currentImg.addEventListener('error', handleError, { once: true });
            
            observer.unobserve(currentImg);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.01,
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src, onLoad, onError]);

  return (
    <div className="relative overflow-hidden aspect-square bg-muted/30">
      {/* Subtle loading background - stays behind image */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/20" />
      
      {/* Actual Image - always present, fades in when loaded */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          'relative w-full h-full object-cover object-center transition-opacity duration-700 ease-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50',
          className
        )}
        loading="lazy"
        decoding="async"
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">خطا در بارگذاری تصویر</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;