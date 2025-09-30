
-- Add featured column to products table for featured products functionality
ALTER TABLE public.products 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create index for better performance on featured products queries
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;

-- Create index for better performance on category queries
CREATE INDEX idx_products_category_active ON public.products(category_id, is_active) WHERE is_active = true;

-- Create index for better performance on categories
CREATE INDEX idx_categories_title ON public.categories(title);

-- Add constraint to limit featured products to maximum 4
CREATE OR REPLACE FUNCTION check_featured_products_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = true THEN
    IF (SELECT COUNT(*) FROM products WHERE is_featured = true AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) >= 4 THEN
      RAISE EXCEPTION 'حداکثر 4 محصول ویژه مجاز است';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_featured_products_limit
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION check_featured_products_limit();
