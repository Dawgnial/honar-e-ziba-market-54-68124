/**
 * Performance optimization utilities
 */

/**
 * Prefetch critical resources on page load
 */
export const prefetchCriticalResources = () => {
  // Prefetch fonts
  const fonts = [
    '/fonts/vazirmatn.woff2',
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = font;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images with IntersectionObserver
 */
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    return imageObserver;
  }
};

/**
 * Optimize third-party scripts
 */
export const optimizeThirdPartyScripts = () => {
  // Defer non-critical scripts
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach(script => {
    script.setAttribute('defer', '');
  });
};

/**
 * Enable resource hints
 */
export const enableResourceHints = () => {
  // DNS prefetch for external domains
  const externalDomains = [
    'https://nwlwrtntkgzzxfczqdbc.supabase.co',
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://nwlwrtntkgzzxfczqdbc.supabase.co',
  ];

  criticalOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  // Run after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enableResourceHints();
      prefetchCriticalResources();
      setupLazyLoading();
      optimizeThirdPartyScripts();
    });
  } else {
    enableResourceHints();
    prefetchCriticalResources();
    setupLazyLoading();
    optimizeThirdPartyScripts();
  }
};
