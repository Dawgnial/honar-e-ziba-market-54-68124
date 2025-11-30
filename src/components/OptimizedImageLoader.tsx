import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, getBlurDataURL, type OptimizedImageProps } from '@/utils/imageLoader';

/**
 * Optimized image component with lazy loading, blur placeholder, and WebP support
 */
export const OptimizedImageLoader = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const optimizedSrc = getOptimizedImageUrl(src);
  const placeholder = getBlurDataURL(width || 400, height || 400);

  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && imgRef.current) {
              imgRef.current.src = optimizedSrc;
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px' }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [priority, optimizedSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={priority ? optimizedSrc : placeholder}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`${className} ${!isLoaded ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
      }}
    />
  );
};
