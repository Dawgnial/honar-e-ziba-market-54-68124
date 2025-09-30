-- Fix order_history table RLS policies to prevent potential recursion issues
-- and ensure proper security using the security definer function

-- Drop existing admin policy that uses subquery
DROP POLICY IF EXISTS "Admins can view all order history" ON order_history;

-- Create new admin policy using the security definer function  
CREATE POLICY "Admins can view all order history" 
ON order_history 
FOR SELECT 
USING (get_user_role() = 'admin');

-- The existing user policies are already secure:
-- - "Users can view their own order history" uses auth.uid() = user_id
-- - "Authenticated users can create their own order history" uses auth.uid() = user_id  
-- - "Block anonymous access to order_history" prevents all anonymous access

-- These policies ensure users can only access their own order history
-- and prevent unauthorized access to sensitive customer data