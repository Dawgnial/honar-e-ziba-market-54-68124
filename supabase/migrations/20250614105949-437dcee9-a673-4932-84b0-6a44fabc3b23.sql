
-- حذف محصولاتی که به دسته‌بندی‌های حذف شده مرتبط هستند
DELETE FROM products 
WHERE category_id NOT IN (
    SELECT id FROM categories
);

-- یا اگر می‌خواهید محصولات را نگه دارید اما ارتباطشان را قطع کنید
-- UPDATE products 
-- SET category_id = NULL 
-- WHERE category_id NOT IN (
--     SELECT id FROM categories
-- );
