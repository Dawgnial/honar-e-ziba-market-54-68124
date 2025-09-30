-- Fix orders table RLS policies to prevent potential recursion issues
-- and ensure proper security using the security definer function

-- Drop existing admin policies that use direct subqueries
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

-- Create new admin policies using the security definer function
CREATE POLICY "Admins can view all orders" 
ON orders 
FOR SELECT 
USING (get_user_role() = 'admin');

CREATE POLICY "Admins can manage all orders" 
ON orders 
FOR ALL 
USING (get_user_role() = 'admin');

-- Ensure the existing user policies are optimal (they're already good)
-- These policies already properly restrict access to authenticated users
-- and ensure users can only access their own orders