
-- Add discount_percentage field to products table
ALTER TABLE public.products 
ADD COLUMN discount_percentage integer DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Add comment for clarity
COMMENT ON COLUMN public.products.discount_percentage IS 'Discount percentage for the product (0-100)';
