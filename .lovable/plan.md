

## برنامه رفع مشکلات و بهبود بارگذاری سایت

### مشکلات شناسایی شده

**مشکل بحرانی ۱: صفحه محصولات هیچ محصولی نشان نمی‌دهد**
در حالی که ۷۱۶ محصول فعال در دیتابیس وجود دارد، صفحه محصولات "هیچ محصولی یافت نشد" نمایش می‌دهد. دلیل: باگ در dependency array مربوط به `useMemo` در فایل `Products.tsx` -- فیلتر محصولات از `tagFilteredProducts` استفاده می‌کند اما وابستگی `useMemo` به `products` اشاره دارد نه `tagFilteredProducts`.

**مشکل بحرانی ۲: درخواست‌های API تکراری**
هر بار که صفحه محصولات باز می‌شود، دسته‌بندی‌ها و تگ‌ها هرکدام ۴ بار از سرور دریافت می‌شوند. دلیل: هوک‌های `useCategories` و `useTags` از `useState/useEffect` استفاده می‌کنند به جای React Query، بنابراین هیچ deduplication صورت نمی‌گیرد.

**مشکل ۳: فیلتر قیمت پیش‌فرض**
حداکثر قیمت پیش‌فرض ۱,۰۰۰,۰۰۰ تومان است اما محصولاتی با قیمت تا ۳,۱۵۰,۰۰۰ تومان وجود دارد. این باعث می‌شود محصولات گران‌تر در ابتدا فیلتر شوند.

**مشکل ۴: console.log اضافی**
لاگ‌های متعدد در کد production باعث کاهش سرعت می‌شوند.

---

### مراحل اجرا

#### فاز ۱: رفع باگ بحرانی نمایش محصولات

**فایل `src/pages/Products.tsx`:**
- رفع dependency array در `useMemo` خط ۱۳۱: تغییر از `[products, filters]` به `[tagFilteredProducts, filters]`
- رفع شرط خط ۳۹۵: تغییر `products.length === 0` به بررسی صحیح وضعیت loading
- افزایش حداکثر قیمت پیش‌فرض از ۱,۰۰۰,۰۰۰ به ۵۰,۰۰۰,۰۰۰

#### فاز ۲: رفع درخواست‌های تکراری API

**فایل `src/hooks/useSupabaseCategories.ts`:**
- تبدیل به React Query برای deduplication خودکار

**فایل `src/hooks/useTags.ts`:**
- تبدیل به React Query برای deduplication خودکار

**فایل `src/hooks/useSupabaseProducts.ts`:**
- تبدیل به React Query برای deduplication خودکار و caching بهتر

#### فاز ۳: رفع race condition در useProductsWithTags

**فایل `src/hooks/useProductsWithTags.ts`:**
- رفع مشکل initial state خالی با استفاده مستقیم از `products` به جای `useState`

#### فاز ۴: پاکسازی کد

**فایل‌های مختلف:**
- حذف `console.log` های اضافی از `useProducts.ts`، `useSupabaseCategories.ts`، و `useSupabaseProducts.ts`
- حذف debug logs که سرعت را کاهش می‌دهند

---

### جزئیات فنی

**تغییر اصلی در `Products.tsx`:**
```text
// قبل (باگ):
const filteredProducts = useMemo(() => {
  let filtered = [...tagFilteredProducts];
  // ...
}, [products, filters]);  // <-- اشتباه!

// بعد (درست):
const filteredProducts = useMemo(() => {
  let filtered = [...tagFilteredProducts];
  // ...
}, [tagFilteredProducts, filters]);  // <-- صحیح
```

**تبدیل hooks به React Query:**
```text
// قبل: هر کامپوننت یک درخواست جداگانه می‌زند
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => { fetch... }, []);
}

// بعد: React Query خودکار درخواست‌ها را deduplicate می‌کند
const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => { fetch... },
    staleTime: 10 * 60 * 1000,
  });
}
```

### نتایج مورد انتظار

| معیار | قبل | بعد |
|-------|------|------|
| نمایش محصولات | ۰ محصول (باگ) | ۷۱۶ محصول |
| تعداد درخواست API | ~۱۲ درخواست تکراری | ~۳ درخواست |
| سرعت بارگذاری | کند | سریع‌تر |
| Console logs | متعدد | حذف شده |

