-- =====================================================
-- SECURITY FIX PHASE 1: Update Dependencies Before Dropping profiles.role
-- =====================================================

-- 1. Drop and recreate the product_comments policy that depends on profiles.role
DROP POLICY IF EXISTS "Admins can manage comments" ON public.product_comments;

-- Create new policy using has_role() instead of profiles.role
CREATE POLICY "Admins can manage comments"
ON public.product_comments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Check and update any other policies that might reference profiles.role
-- (This is a safety measure to catch any we might have missed)

-- 3. Now we can safely proceed with the main security fixes