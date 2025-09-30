
-- Add image_url column to categories table
ALTER TABLE public.categories 
ADD COLUMN image_url TEXT;

-- Create a storage bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true);

-- Create policy for public read access to category images
CREATE POLICY "Public can view category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

-- Create policy for authenticated users to upload category images
CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'category-images' 
  AND auth.role() = 'authenticated'
);

-- Create policy for authenticated users to update category images
CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'category-images' 
  AND auth.role() = 'authenticated'
);

-- Create policy for authenticated users to delete category images
CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'category-images' 
  AND auth.role() = 'authenticated'
);
