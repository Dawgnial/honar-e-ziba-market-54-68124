-- Fix RLS policies for product_comments table
-- First drop existing policies
DROP POLICY IF EXISTS "Anyone can create comments" ON product_comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON product_comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON product_comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON product_comments;

-- Recreate policies with correct permissions
CREATE POLICY "Anyone can view approved comments" 
ON product_comments 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Anyone can create comments" 
ON product_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all comments" 
ON product_comments 
FOR SELECT 
USING (get_user_role() = 'admin');

CREATE POLICY "Admins can manage all comments" 
ON product_comments 
FOR ALL 
USING (get_user_role() = 'admin');