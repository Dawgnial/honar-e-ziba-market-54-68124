-- Make user_email optional and add user_phone for product comments to support phone-only submissions
ALTER TABLE public.product_comments
  ALTER COLUMN user_email DROP NOT NULL;

ALTER TABLE public.product_comments
  ADD COLUMN IF NOT EXISTS user_phone text;
