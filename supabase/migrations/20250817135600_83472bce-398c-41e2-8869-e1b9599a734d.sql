-- Completely fix the RLS issue by disabling and re-enabling with correct approach
ALTER TABLE product_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;

-- Remove problematic get_user_role function dependency
DROP POLICY IF EXISTS "public_read_approved" ON product_comments;
DROP POLICY IF EXISTS "public_insert" ON product_comments;  
DROP POLICY IF EXISTS "admin_all_access" ON product_comments;

-- Create working policies without function calls
CREATE POLICY "Anyone can view approved comments" ON product_comments 
FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can insert comments" ON product_comments 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage comments" ON product_comments 
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Test insert a comment
INSERT INTO product_comments (product_id, user_name, rating, comment, is_approved) 
VALUES ('71441d29-0998-4a50-9814-6d947aaf574f', 'تست کامل سیستم', 4, 'سیستم نظرات کامل شده', false);