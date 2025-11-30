-- Add phone field to support_messages table
ALTER TABLE public.support_messages 
ADD COLUMN IF NOT EXISTS user_phone text;