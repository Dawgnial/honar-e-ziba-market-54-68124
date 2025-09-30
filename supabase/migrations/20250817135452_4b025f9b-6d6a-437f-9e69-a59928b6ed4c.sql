-- Temporarily disable RLS to test if that's the issue
ALTER TABLE product_comments DISABLE ROW LEVEL SECURITY;

-- Test insert without RLS
INSERT INTO product_comments (product_id, user_name, rating, comment, is_approved) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'کاربر تست', 5, 'این یک نظر تست است', false);

-- Re-enable RLS with simpler policies
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;

-- Create simple policies that should work
CREATE POLICY "Allow all reads for approved comments" 
ON product_comments 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Allow anonymous inserts" 
ON product_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin full access" 
ON product_comments 
FOR ALL 
USING (
  COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid()),
    'user'
  ) = 'admin'
);