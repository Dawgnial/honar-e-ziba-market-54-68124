-- Update RLS policy to allow viewing all products, not just active ones
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Create new policy that allows viewing all products 
CREATE POLICY "Anyone can view all products" 
ON public.products 
FOR SELECT 
USING (true);