-- Fix critical security vulnerabilities in orders, order_history, and product_comments tables

-- 1. DROP existing problematic policies for orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- 2. CREATE secure policies for orders table
-- Block all anonymous access to orders
CREATE POLICY "Block anonymous access to orders" 
ON public.orders 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- Allow authenticated users to view only their own orders (user_id must match)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Allow authenticated users to create orders with their own user_id
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Allow authenticated users to update their own orders
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- 3. Fix order_history table policies
-- Block all anonymous access to order_history
CREATE POLICY "Block anonymous access to order_history" 
ON public.order_history 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- 4. Fix product_comments table - restrict insertions to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.product_comments;

-- Only authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments" 
ON public.product_comments 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Block anonymous users from inserting comments
CREATE POLICY "Block anonymous comment insertion" 
ON public.product_comments 
FOR INSERT 
TO anon 
WITH CHECK (false);

-- 5. Make user_id NOT NULL for future orders to prevent security gaps
-- Note: This will require updating the application logic to handle guest orders differently
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;