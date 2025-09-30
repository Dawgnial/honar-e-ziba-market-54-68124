-- Remove all existing policies and start fresh
DROP POLICY IF EXISTS "Allow all reads for approved comments" ON product_comments;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON product_comments;
DROP POLICY IF EXISTS "Allow admin full access" ON product_comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON product_comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON product_comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON product_comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON product_comments;

-- Create minimal working policies
CREATE POLICY "public_read_approved" ON product_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "public_insert" ON product_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_access" ON product_comments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);