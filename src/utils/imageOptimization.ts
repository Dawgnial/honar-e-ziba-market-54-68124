/**
 * Image Optimization Utilities
 * 
 * Provides functions for:
 * - Converting images to WebP format
 * - Compressing images with optimal quality
 * - Resizing images to appropriate dimensions
 * - Generating responsive image URLs
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  targetFileSize?: number; // in bytes
}

/**
 * Convert and optimize an image file to WebP format
 * This significantly reduces file size while maintaining quality
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    format = 'webp',
    targetFileSize = 1 * 1024 * 1024 // 1MB default
  } = options;

  return new Promise((resolve, reject) => {
    // Adjust quality based on original file size
    let adjustedQuality = quality;
    if (file.size > 5 * 1024 * 1024) {
      adjustedQuality = 0.75; // Lower quality for large files
    } else if (file.size > 10 * 1024 * 1024) {
      adjustedQuality = 0.65; // Even lower for very large files
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      
      // Calculate new dimensions while maintaining aspect ratio
      let newWidth = width;
      let newHeight = height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        newWidth = Math.floor(width * ratio);
        newHeight = Math.floor(height * ratio);
      }
      
      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob with specified format
      const mimeType = format === 'webp' ? 'image/webp' : 
                      format === 'jpeg' ? 'image/jpeg' : 'image/png';
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Check if we achieved target file size
            if (blob.size <= targetFileSize || adjustedQuality <= 0.5) {
              resolve(blob);
            } else {
              // Try again with lower quality
              const newQuality = Math.max(0.5, adjustedQuality - 0.1);
              canvas.toBlob(
                (retryBlob) => resolve(retryBlob || blob),
                mimeType,
                newQuality
              );
            }
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        mimeType,
        adjustedQuality
      );
      
      // Clean up
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Optimize image specifically for product images
 * Uses settings optimized for e-commerce product display
 */
export const optimizeProductImage = async (file: File): Promise<Blob> => {
  return optimizeImage(file, {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    format: 'webp',
    targetFileSize: 800 * 1024 // 800KB target for products
  });
};

/**
 * Optimize image for category thumbnails
 * Smaller size since categories don't need huge images
 */
export const optimizeCategoryImage = async (file: File): Promise<Blob> => {
  return optimizeImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    format: 'webp',
    targetFileSize: 400 * 1024 // 400KB target for categories
  });
};

/**
 * Generate a thumbnail from an image file
 * Perfect for preview images
 */
export const generateThumbnail = async (
  file: File,
  size: number = 200
): Promise<Blob> => {
  return optimizeImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.8,
    format: 'webp',
    targetFileSize: 100 * 1024 // 100KB for thumbnails
  });
};

/**
 * Calculate optimal dimensions for an image
 * while maintaining aspect ratio
 */
export const calculateOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  
  if (ratio >= 1) {
    return { width: originalWidth, height: originalHeight };
  }
  
  return {
    width: Math.floor(originalWidth * ratio),
    height: Math.floor(originalHeight * ratio)
  };
};

/**
 * Check if browser supports WebP format
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Get file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
