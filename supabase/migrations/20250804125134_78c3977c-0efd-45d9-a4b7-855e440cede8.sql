-- حل مشکل RLS برای کامنت‌ها بدون تکرار trigger
-- فقط foreign key constraints و indexes

-- اضافه کردن foreign key constraint برای product_comments
ALTER TABLE public.product_comments 
ADD CONSTRAINT fk_product_comments_product_id 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- ایجاد indexes برای بهتر شدن performance
CREATE INDEX IF NOT EXISTS idx_product_comments_product_id ON public.product_comments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_comments_approved ON public.product_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_product_comments_created_at ON public.product_comments(created_at DESC);

-- اضافه کردن policy برای admin تا بتواند کامنت‌ها را مدیریت کند
CREATE POLICY "Admins can manage all comments" 
ON public.product_comments 
FOR ALL 
USING (get_user_role() = 'admin'::text);

-- اضافه کردن policy برای admin تا بتواند همه کامنت‌ها را ببیند (approved و unapproved)
CREATE POLICY "Admins can view all comments" 
ON public.product_comments 
FOR SELECT 
USING (get_user_role() = 'admin'::text);