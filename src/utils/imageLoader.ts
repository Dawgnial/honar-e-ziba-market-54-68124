/**
 * Optimized image loading utilities
 * Provides WebP support, lazy loading, and progressive image enhancement
 */

/**
 * Check if browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Get optimized image URL with WebP fallback
 */
export const getOptimizedImageUrl = (url: string): string => {
  if (!url) return '/placeholder.svg';
  
  // If it's a Supabase storage URL, we can potentially optimize it
  if (url.includes('supabase.co/storage')) {
    // Supabase doesn't have built-in image optimization, but we prepare for future
    return url;
  }
  
  return url;
};

/**
 * Create a blur placeholder for progressive image loading
 */
export const getBlurDataURL = (width: number = 10, height: number = 10): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='${width}' height='${height}' fill='%23f0f0f0' filter='url(%23b)'/%3E%3C/svg%3E`;
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (img: HTMLImageElement): void => {
  const src = img.dataset.src;
  if (!src) return;
  
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading support
    img.loading = 'lazy';
    img.src = src;
  } else {
    // Fallback to Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px',
    });
    
    observer.observe(img);
  }
};

/**
 * Preload critical images
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Get responsive image srcset
 */
export const getResponsiveSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
};

/**
 * Optimized image component props
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}
