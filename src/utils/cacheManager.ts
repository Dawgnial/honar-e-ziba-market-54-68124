/**
 * Cache Manager for localStorage-based caching
 * Handles expiration, size limits, and cache invalidation
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private prefix = 'app_cache_';
  private maxSize = 5 * 1024 * 1024; // 5MB limit

  /**
   * Set item in cache with expiration
   */
  set<T>(key: string, data: T, expiresInMs: number = 5 * 60 * 1000): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMs,
      };

      const serialized = JSON.stringify(cacheItem);
      
      // Check size
      if (this.getStorageSize() + serialized.length > this.maxSize) {
        this.cleanup();
      }

      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.warn('Cache set failed:', error);
      // If quota exceeded, cleanup and retry
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanup();
        try {
          localStorage.setItem(this.prefix + key, JSON.stringify({ data, timestamp: Date.now(), expiresIn: expiresInMs }));
        } catch {
          console.error('Cache set failed after cleanup');
        }
      }
    }
  }

  /**
   * Get item from cache if not expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;

      if (isExpired) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Cleanup expired items
   */
  cleanup(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item);
            const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;
            if (isExpired) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  }

  /**
   * Get current storage size
   */
  private getStorageSize(): number {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const item = localStorage.getItem(key);
        if (item) size += item.length;
      }
    });
    return size;
  }

  /**
   * Check if cache has item
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cacheManager = new CacheManager();
