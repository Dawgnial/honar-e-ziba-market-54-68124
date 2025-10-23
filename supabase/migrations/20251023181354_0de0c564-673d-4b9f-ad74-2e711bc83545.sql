-- =====================================================
-- SECURITY FIX PHASE 2: Strengthen Orders RLS and Remove profiles.role
-- =====================================================

-- 1. Drop existing orders policies that may be too permissive
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Block anonymous access to orders" ON public.orders;

-- 2. Create stronger RLS policies for orders table
-- Only allow users to see THEIR orders, never other users' orders
CREATE POLICY "Users can only view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- Users can only create orders for themselves
CREATE POLICY "Users can only create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- Users can update ONLY their own orders (e.g., cancel)
CREATE POLICY "Users can only update their own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
)
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all orders (update status, etc.)
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Block ALL anonymous access
CREATE POLICY "Block all anonymous access to orders"
ON public.orders
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 3. Add indexes to improve orders query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. IMPORTANT: Drop profiles.role column to prevent inconsistency
-- This forces all role checks to use user_roles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 5. Add audit log for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  changed_by uuid REFERENCES auth.users(id) NOT NULL,
  target_user uuid REFERENCES auth.users(id) NOT NULL,
  old_role app_role,
  new_role app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on audit log
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.role_change_audit
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.role_change_audit
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = changed_by);

-- 6. Add comments for documentation
COMMENT ON TABLE public.role_change_audit IS 'Audit trail of all user role changes for security tracking';
COMMENT ON POLICY "Users can only view their own orders" ON public.orders IS 'Prevents order enumeration attacks by ensuring users can only see their own orders';
COMMENT ON POLICY "Block all anonymous access to orders" ON public.orders IS 'Critical: Prevents any anonymous access to customer order data';