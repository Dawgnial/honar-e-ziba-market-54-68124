
-- Add availability status field to products table
ALTER TABLE public.products 
ADD COLUMN availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'unavailable'));

-- Add comment for clarity
COMMENT ON COLUMN public.products.availability_status IS 'Manual availability status (available/unavailable)';

-- Update existing products to have availability status
UPDATE public.products 
SET availability_status = 'available' 
WHERE availability_status IS NULL;
