-- Add parent_id to product_comments for reply functionality
ALTER TABLE product_comments 
ADD COLUMN parent_id uuid REFERENCES product_comments(id) ON DELETE CASCADE;

-- Add helpful_count for caching likes
ALTER TABLE product_comments 
ADD COLUMN helpful_count integer DEFAULT 0 NOT NULL;

-- Create comment_likes table
CREATE TABLE comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES product_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Enable RLS on comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comment_likes
CREATE POLICY "Anyone can view comment likes"
ON comment_likes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like comments"
ON comment_likes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON comment_likes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to update helpful_count
CREATE OR REPLACE FUNCTION update_comment_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE product_comments 
    SET helpful_count = helpful_count + 1 
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE product_comments 
    SET helpful_count = helpful_count - 1 
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Trigger to auto-update helpful_count
CREATE TRIGGER trigger_update_helpful_count
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_helpful_count();

-- Create index for better performance
CREATE INDEX idx_product_comments_parent_id ON product_comments(parent_id);
CREATE INDEX idx_product_comments_helpful_count ON product_comments(helpful_count DESC);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);