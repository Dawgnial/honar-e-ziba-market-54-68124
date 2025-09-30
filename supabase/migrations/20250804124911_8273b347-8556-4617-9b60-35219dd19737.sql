-- حل مشکلات کامنت‌ها
-- 1. اضافه کردن foreign key constraints
-- 2. ایجاد indexes برای بهتر شدن performance
-- 3. اصلاح RLS policies برای امکان مدیریت کامنت‌ها توسط admin

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

-- اضافه کردن trigger برای automatic timestamp updates
CREATE TRIGGER update_product_comments_updated_at
BEFORE UPDATE ON public.product_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();