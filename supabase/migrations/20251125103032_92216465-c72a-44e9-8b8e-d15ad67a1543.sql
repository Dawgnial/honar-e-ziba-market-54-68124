-- Add display_order to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing categories with sequential order
UPDATE categories SET display_order = (
  SELECT ROW_NUMBER() OVER (ORDER BY created_at)
  FROM categories c2 WHERE c2.id = categories.id
);

-- Add tags to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for faster tag searches
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Update RLS policies for support_messages to fix permission issues
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create messages" ON support_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON support_messages;

-- Recreate with better logic
CREATE POLICY "Anyone can create support messages"
ON support_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view messages in their conversations"
ON support_messages FOR SELECT
USING (
  auth.uid() = user_id 
  OR auth.uid() IS NULL 
  OR conversation_id IN (
    SELECT DISTINCT conversation_id 
    FROM support_messages 
    WHERE user_id = auth.uid() OR user_id IS NULL
  )
);