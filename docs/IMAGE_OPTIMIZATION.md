# سیستم بهینه‌سازی تصاویر / Image Optimization System

## خلاصه / Overview

این پروژه از یک سیستم پیشرفته بهینه‌سازی تصاویر استفاده می‌کند که باعث:
- **کاهش 50-80% حجم فایل‌ها** با تبدیل به WebP
- **بارگذاری سریع‌تر** با lazy loading و priority loading
- **صرفه‌جویی در Supabase Storage** با فشرده‌سازی هوشمند
- **تجربه کاربری بهتر** با جلوگیری از layout shift

---

## ویژگی‌های کلیدی / Key Features

### 1. تبدیل خودکار به WebP
تمام تصاویر آپلود شده (محصولات و دسته‌بندی‌ها) به صورت خودکار به فرمت WebP تبدیل می‌شوند:

```typescript
// محصولات: حداکثر 1200x1200 پیکسل، کیفیت 85%
const blob = await optimizeProductImage(file);

// دسته‌بندی‌ها: حداکثر 800x800 پیکسل، کیفیت 85%
const blob = await optimizeCategoryImage(file);
```

**نتیجه:**
- تصویر 5MB PNG → تقریباً 400-800KB WebP
- تصویر 3MB JPG → تقریباً 200-500KB WebP

### 2. تصاویر Responsive با srcset
تصاویر در سایزهای مختلف برای دستگاه‌های مختلف:

```tsx
<OptimizedImage
  src={imageUrl}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  // Browser loads appropriate size automatically
/>
```

### 3. Priority Loading
تصاویر مهم (مثل تصویر اصلی محصول) با `priority={true}` سریع‌تر بارگذاری می‌شوند:

```tsx
<OptimizedImage
  src={mainImage}
  priority={true}
  fetchPriority="high"
/>
```

### 4. Lazy Loading
تصاویر ثانویه تنها هنگام نزدیک شدن به viewport بارگذاری می‌شوند:

```tsx
<OptimizedImage
  src={secondaryImage}
  priority={false}
  loading="lazy"
/>
```

### 5. Perfect Image Fitting
تمام تصاویر با `object-fit: cover` و `object-position: center` کاملاً در container خود قرار می‌گیرند:

```css
.aspect-square img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

---

## استفاده / Usage

### کامپوننت OptimizedImage

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/image.webp"
  alt="توضیح تصویر"
  priority={false}
  aspectRatio="square"
  sizes="(max-width: 640px) 100vw, 50vw"
  className="custom-classes"
/>
```

**Props:**
- `src`: آدرس تصویر
- `alt`: توضیح تصویر (برای SEO و accessibility)
- `priority`: `true` برای تصاویر مهم (بدون lazy load)
- `aspectRatio`: `'square' | '16/9' | '4/3' | 'auto'`
- `sizes`: تعیین سایز مناسب برای هر دستگاه
- `className`: کلاس‌های اضافی

### آپلود تصاویر محصول

```tsx
import { optimizeProductImage } from '@/utils/imageOptimization';

// تبدیل و بهینه‌سازی خودکار
const optimizedBlob = await optimizeProductImage(file);

// آپلود به Supabase با cache headers
await supabase.storage
  .from('category-images')
  .upload(filePath, optimizedBlob, {
    cacheControl: '31536000', // 1 year cache
    contentType: 'image/webp'
  });
```

### آپلود تصاویر دسته‌بندی

```tsx
import { optimizeCategoryImage } from '@/utils/imageOptimization';

const optimizedBlob = await optimizeCategoryImage(file);
// سایز کوچک‌تر برای دسته‌بندی‌ها
```

---

## تنظیمات پیشرفته / Advanced Configuration

### سفارشی‌سازی کیفیت و سایز

```typescript
import { optimizeImage } from '@/utils/imageOptimization';

const customBlob = await optimizeImage(file, {
  maxWidth: 1500,
  maxHeight: 1500,
  quality: 0.9,
  format: 'webp',
  targetFileSize: 1024 * 1024 // 1MB
});
```

### تولید Thumbnail

```typescript
import { generateThumbnail } from '@/utils/imageOptimization';

const thumbnail = await generateThumbnail(file, 200); // 200x200px
```

---

## بهینه‌سازی Supabase Storage

### Cache Headers
تمام تصاویر با cache header 1 ساله ذخیره می‌شوند:

```typescript
cacheControl: '31536000' // 365 days
```

**نتیجه:**
- بعد از اولین بارگذاری، تصاویر از browser cache بارگذاری می‌شوند
- کاهش تعداد درخواست‌ها به Supabase
- بارگذاری فوری در بازدیدهای بعدی

### استراتژی نام‌گذاری

```typescript
const fileName = `${Date.now()}-${randomString()}.webp`;
```

- Timestamp برای جلوگیری از تداخل
- Random string برای امنیت بیشتر
- Extension `.webp` برای مشخص بودن فرمت

---

## نکات مهم / Important Notes

### 1. فرمت‌های پشتیبانی شده در آپلود
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF
- ✅ WebP (فشرده‌سازی مجدد)
- ❌ HEIC (نیاز به تبدیل توسط کاربر)

### 2. محدودیت‌ها
- حداکثر سایز فایل قبل از فشرده‌سازی: **10MB**
- بعد از بهینه‌سازی: معمولاً **200KB - 1MB**

### 3. سازگاری با مرورگرها
- WebP در 95%+ مرورگرها پشتیبانی می‌شود
- برای مرورگرهای قدیمی، تصویر اصلی به عنوان fallback استفاده می‌شود

---

## معیارهای عملکرد / Performance Metrics

### قبل از بهینه‌سازی
- تصویر محصول: 3-5MB
- زمان بارگذاری: 2-5 ثانیه (3G)
- فضای ذخیره‌سازی: زیاد

### بعد از بهینه‌سازی
- تصویر محصول: 300-800KB (کاهش 80%)
- زمان بارگذاری: 0.5-1 ثانیه (3G)
- فضای ذخیره‌سازی: 5-10 برابر کمتر

---

## تست و Debugging

### لاگ بهینه‌سازی
در Console مرورگر:

```
Image optimized: 4.2 MB → 650 KB (84% smaller)
Category image optimized: 2.8 MB → 320 KB (88% smaller)
```

### بررسی Network
1. باز کردن DevTools → Network
2. فیلتر کردن بر اساس "Img"
3. بررسی:
   - Size: باید کوچک باشد (< 1MB)
   - Type: باید `webp` باشد
   - Cache: در بار دوم از cache بارگذاری شود

---

## نگهداری / Maintenance

### بررسی منظم
- [ ] بررسی سایز متوسط تصاویر آپلود شده
- [ ] مانیتور کردن فضای استفاده شده در Supabase Storage
- [ ] تست سرعت بارگذاری در شبکه‌های مختلف

### بهبودهای آینده
- [ ] پشتیبانی از فرمت AVIF (فشرده‌سازی بهتر)
- [ ] تولید خودکار تصاویر در سایزهای مختلف
- [ ] CDN integration برای سرعت بیشتر

---

## مراجع / References

- [WebP Documentation](https://developers.google.com/speed/webp)
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- [Lazy Loading](https://web.dev/lazy-loading-images/)

---

## پشتیبانی / Support

برای سوالات یا مشکلات:
1. بررسی Console logs
2. چک کردن Network tab
3. مرور کردن این مستندات
