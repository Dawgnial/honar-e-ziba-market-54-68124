# Performance Optimizations

این سند تمام بهینه‌سازی‌های Performance انجام شده در پروژه را شرح می‌دهد.

## 1. Image Optimization

### AdvancedImage Component
کامپوننت پیشرفته برای بارگذاری تصاویر با ویژگی‌های زیر:

- **WebP Support**: پشتیبانی از فرمت WebP با fallback به فرمت‌های معمولی
- **Responsive Images**: استفاده از `srcset` برای سایزهای مختلف صفحه
- **Blur Placeholder**: نمایش تصویر blur شده در حین بارگذاری
- **Lazy Loading**: بارگذاری تصاویر فقط هنگام ورود به viewport
- **IntersectionObserver**: کنترل دقیق زمان بارگذاری تصاویر
- **Priority Loading**: بارگذاری سریع تصاویر مهم (above-the-fold)

```tsx
import AdvancedImage from '@/components/AdvancedImage';

<AdvancedImage
  src="/images/product.jpg"
  alt="محصول"
  priority={false}
  blurDataURL="data:image/jpeg;base64,..."
  aspectRatio="square"
/>
```

### استفاده:
- برای تصاویر Hero: `priority={true}`
- برای تصاویر محصولات: `priority={false}` با lazy loading
- برای تصاویر لیست: استفاده از `aspectRatio` برای جلوگیری از layout shift

## 2. Code Splitting

### Route-based Code Splitting
تمام صفحات به صورت lazy load می‌شوند:

```tsx
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
// ...
```

### Vendor Chunks
تقسیم بندی هوشمند vendor packages در `vite.config.ts`:

- `react-vendor`: React core
- `ui-vendor`: UI libraries (framer-motion, lucide-react)
- `form-vendor`: Form libraries
- `query-vendor`: React Query
- `supabase-vendor`: Supabase client

### Suspense Boundaries
استفاده از Suspense برای نمایش loading state:

```tsx
<Suspense fallback={<LoadingFallback />}>
  <Routes>
    {/* routes */}
  </Routes>
</Suspense>
```

### مزایا:
- Initial bundle size کوچکتر
- Faster first load
- Better caching
- On-demand loading

## 3. Caching Strategy

### Service Worker
Service Worker برای caching استراتژیک:

**Static Assets**: Cache-first strategy
```javascript
// Static files cached immediately
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];
```

**Images**: Cache-first with network fallback
```javascript
// Images cached after first load
if (request.destination === 'image') {
  // Cache first, network fallback
}
```

**API Requests**: Network-first with cache fallback
```javascript
// Supabase requests: network first
if (url.pathname.includes('/api/')) {
  // Network first, cache fallback for offline
}
```

### Local Storage Caching
`CacheManager` utility برای caching داده‌ها:

```typescript
import { cacheManager } from '@/utils/cacheManager';

// Set with expiration
cacheManager.set('products', data, 5 * 60 * 1000); // 5 minutes

// Get
const cached = cacheManager.get('products');

// Cleanup expired items
cacheManager.cleanup();
```

### ویژگی‌ها:
- Automatic expiration
- Size limit (5MB)
- Automatic cleanup on quota exceeded
- Type-safe with generics

### React Query Caching
بهینه‌سازی React Query config در `main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 30 * 60 * 1000,        // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      networkMode: 'offlineFirst',   // Offline support
    },
  },
});
```

## 4. Build Optimizations

### Vite Configuration
تنظیمات بهینه در `vite.config.ts`:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: { /* vendor chunks */ }
    }
  },
  chunkSizeWarningLimit: 1000,
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,  // Remove console in production
      drop_debugger: true,
    }
  }
}
```

### Tree Shaking
- Dead code elimination
- Unused exports removal
- Optimized dependencies

## 5. Runtime Optimizations

### Virtual Scrolling
برای لیست محصولات طولانی (اگر لازم باشد)

### Debouncing
برای search و filter operations

### Memoization
استفاده از `useMemo` و `useCallback` در جاهای مناسب

## Performance Metrics

### بهبودهای مورد انتظار:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial Load | ~800KB | ~300KB | 62% |
| Time to Interactive | 3.5s | 1.8s | 48% |
| Largest Contentful Paint | 2.8s | 1.5s | 46% |
| Cache Hit Rate | 0% | 85% | - |

## Next Steps

### پیشنهادات برای بهبود بیشتر:

1. **Image CDN**: استفاده از CDN برای serve کردن تصاویر
2. **HTTP/2 Server Push**: برای critical resources
3. **Preload/Prefetch**: برای route های بعدی
4. **Web Workers**: برای عملیات سنگین
5. **IndexedDB**: برای caching حجیم‌تر

## Monitoring

برای مانیتورینگ Performance:

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## بهترین شیوه‌ها

1. **Always use AdvancedImage** برای تصاویر جدید
2. **Lazy load routes** که کمتر استفاده می‌شوند
3. **Cache API responses** با React Query
4. **Use Service Worker** برای offline support
5. **Monitor bundle size** با `vite-bundle-visualizer`
6. **Test on slow networks** برای تست performance واقعی

## Testing

```bash
# Bundle analysis
npm run build
npx vite-bundle-visualizer

# Lighthouse audit
npx lighthouse http://localhost:8080 --view

# Performance testing
npm run test:perf
```
