
-- Create a table for product comments and ratings
CREATE TABLE public.product_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view approved comments
CREATE POLICY "Anyone can view approved comments" 
  ON public.product_comments 
  FOR SELECT 
  USING (is_approved = true);

-- Create policy that allows anyone to insert comments (they will need approval)
CREATE POLICY "Anyone can create comments" 
  ON public.product_comments 
  FOR INSERT 
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_product_comments_updated_at
  BEFORE UPDATE ON public.product_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_product_comments_product_id ON public.product_comments(product_id);
CREATE INDEX idx_product_comments_approved ON public.product_comments(is_approved);
