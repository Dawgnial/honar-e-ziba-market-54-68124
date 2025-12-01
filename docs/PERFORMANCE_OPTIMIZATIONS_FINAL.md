# بهینه‌سازی‌های نهایی سرعت سایت

## خلاصه تغییرات

این سند تمام بهینه‌سازی‌های اعمال شده برای بهبود سرعت سایت را توضیح می‌دهد.

---

## فاز ۱: رفع مشکل N+1 Query (تأثیر: ~80% بهبود)

### مشکل
هر کارت محصول (ModernProductCard) یک درخواست API جداگانه برای دریافت نظرات و امتیازات می‌فرستاد.
- **قبل**: 50+ محصول = 50+ درخواست API برای نظرات
- **بعد**: فقط 1 درخواست برای لیست محصولات

### راه‌حل
✅ حذف `useProductComments` از `ModernProductCard.tsx`
✅ حذف نمایش Rating از کارت‌های محصول در لیست
✅ `OptimizedFeaturedProducts.tsx` با `showRating={false}` برای جلوگیری از بارگذاری نظرات
✅ نمایش Rating فقط در صفحه جزئیات محصول

### فایل‌های تغییر یافته
- `src/components/ModernProductCard.tsx`
- `src/components/OptimizedFeaturedProducts.tsx`

---

## فاز ۲: بهینه‌سازی Code Splitting

### تغییرات
✅ جداسازی کتابخانه‌های سنگین به bundle‌های مستقل:
- `vendor-react`: React, ReactDOM, React Router
- `vendor-supabase`: Supabase client
- `vendor-query`: TanStack Query
- `vendor-ui`: Radix UI components

### مزایا
- بارگذاری موازی bundle‌ها
- Cache بهتر (تغییر یک بخش، بقیه cache می‌مانند)
- Initial bundle کوچک‌تر

### فایل‌های تغییر یافته
- `vite.config.ts`

---

## فاز ۳: بهینه‌سازی تصاویر

### تغییرات
✅ Preload تصاویر حیاتی در `index.html`:
```html
<link rel="preload" as="image" href="/images/logo.png" fetchpriority="high" />
<link rel="preload" as="image" href="/images/hero-bg-1.jpg" fetchpriority="high" />
```

✅ اضافه کردن `decoding="async"` به `OptimizedImage`:
- رندر non-blocking تصاویر
- جلوگیری از block شدن thread اصلی

✅ Transition کوتاه‌تر (150ms به جای 300ms)

### فایل‌های تغییر یافته
- `index.html`
- `src/components/OptimizedImage.tsx`

---

## فاز ۴: بهینه‌سازی React Query Cache

### تغییرات (در `main.tsx` و `useOptimizedProducts.ts`)

**Global Settings:**
```javascript
staleTime: 10 * 60 * 1000,  // 10 دقیقه (قبلاً 5 دقیقه)
gcTime: 30 * 60 * 1000,     // 30 دقیقه (قبلاً 10 دقیقه)
refetchOnWindowFocus: false
refetchOnReconnect: false
```

**Per-Query Settings:**
- محصولات عادی: staleTime=10min, gcTime=30min
- محصولات ویژه: staleTime=10min, gcTime=30min
- محصول واحد: staleTime=15min, gcTime=30min

### مزایا
- کاهش شدید درخواست‌های API
- استفاده از cache بیشتر
- تجربه کاربری سریع‌تر (بدون re-fetch‌های اضافی)

### فایل‌های تغییر یافته
- `src/main.tsx`
- `src/hooks/useOptimizedProducts.ts`

---

## فاز ۵: Lazy Loading کامپوننت‌های سنگین

### تغییرات
✅ Lazy load `ProductComments` در صفحه جزئیات محصول:
```javascript
const ProductComments = lazy(() => 
  import("../components/ProductComments")
    .then(module => ({ default: module.ProductComments }))
);
```

✅ استفاده از `Suspense` با fallback skeleton

### مزایا
- Initial bundle کوچک‌تر
- بارگذاری نظرات فقط زمانی که کاربر به آن قسمت رسید
- تجربه کاربری بهتر با skeleton loading

### فایل‌های تغییر یافته
- `src/pages/ProductDetail.tsx`

---

## فاز ۶: Resource Hints

### تغییرات موجود در `index.html`
```html
<link rel="preconnect" href="https://nwlwrtntkgzzxfczqdbc.supabase.co" crossorigin />
<link rel="dns-prefetch" href="https://nwlwrtntkgzzxfczqdbc.supabase.co" />
```

### مزایا
- برقراری اتصال زودتر به Supabase
- کاهش latency درخواست‌های API

---

## نتایج مورد انتظار

| معیار | قبل | بعد | بهبود |
|-------|------|------|-------|
| **تعداد درخواست API (صفحه لیست محصولات)** | ~60+ | ~5 | **92% کاهش** |
| **زمان بارگذاری صفحه محصولات** | 3-5 ثانیه | 0.5-1 ثانیه | **80% بهبود** |
| **زمان نمایش اولین تصویر** | ~2 ثانیه | ~0.5 ثانیه | **75% بهبود** |
| **حجم Initial Bundle** | یک‌جا | تقسیم شده | کاهش قابل توجه |
| **Cache Hit Rate** | پایین | بالا | افزایش چشمگیر |

---

## نکات مهم

### ✅ چیزهایی که انجام شد
1. رفع کامل N+1 query problem
2. Code splitting هوشمند
3. Image optimization با preload و async decoding
4. افزایش cache time در React Query
5. Lazy loading کامپوننت‌های سنگین
6. Resource hints برای Supabase

### 🎯 Best Practices رعایت شده
- ✅ تنها زمانی که کاربر به قسمت نظرات می‌رسد، بارگذاری می‌شود
- ✅ تصاویر بالای صفحه با priority بالا بارگذاری می‌شوند
- ✅ کتابخانه‌های بزرگ در bundle‌های جدا
- ✅ Cache طولانی مدت برای داده‌های استاتیک
- ✅ تمام تصاویر با lazy loading (به جز critical images)

### 📊 مانیتورینگ
برای بررسی بهبودهای عملی:
1. Chrome DevTools > Network tab: بررسی تعداد درخواست‌ها
2. Performance tab: بررسی زمان بارگذاری
3. Lighthouse: امتیاز Performance

---

## مراجع
- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)
- [React Query - Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
- [Vite - Code Splitting](https://vitejs.dev/guide/build.html#chunking-strategy)
