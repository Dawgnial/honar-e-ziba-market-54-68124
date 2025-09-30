-- Add price column to product_attribute_values
ALTER TABLE public.product_attribute_values 
ADD COLUMN price_modifier NUMERIC DEFAULT 0;

-- Add comment to explain the price_modifier column
COMMENT ON COLUMN public.product_attribute_values.price_modifier IS 'Additional price to add to base product price for this attribute value';

-- Update some existing values with price modifiers for demonstration
UPDATE public.product_attribute_values 
SET price_modifier = 5000 
WHERE value = 'red';

UPDATE public.product_attribute_values 
SET price_modifier = 3000 
WHERE value = 'blue';

UPDATE public.product_attribute_values 
SET price_modifier = 2000 
WHERE value = 'large';

UPDATE public.product_attribute_values 
SET price_modifier = 1000 
WHERE value = 'medium';

-- Add selected_attributes column to order_items to store customer choices
ALTER TABLE public.order_items 
ADD COLUMN selected_attributes JSONB DEFAULT '[]'::jsonb;